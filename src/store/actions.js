import axios from 'axios';

// axios.defaults.baseURL = ''; 
axios.defaults.withCredentials = true; //자격증명정보 (쿠키교환 가능) <CSR>

const instance = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
});



export const actions = {

    doSearch: async (context, data) => {
        context.commit('isLoading');
        const result = await instance.post('selectInbOrder', data);
        context.commit('dataSet', result.data);
        context.commit('isLoading');
    },

    outOrderDoSearch: async (context, data) => {
        context.commit('isLoading');
        const result = await instance.post('selectOutOrder', data);
        context.commit('outOrderDataSet', result.data);
        context.commit('isLoading');
    },


    userSearch: async (context, data) => {
        context.commit('isLoading');
        const result = await instance.post('selectUser', data);
        context.commit('userDataSet', result.data);
        context.commit('isLoading');
    },


    loginHandler: async (context, data) => {
        let multiLogin = false;

        context.commit('isLoading');
        const result = await instance.post('login.wms', data);
        context.commit('isLoading');

        if(result.data === '') {
            //실패
            return 'fail';
        }

        if(result.data['name'] === '중복') {
            if(confirm('이미 로그인되어 있습니다. 기존 접속을 끊으시겠습니까?')) {

                const multiResult = await instance.post('multiLogin.wms', data);
                context.commit('sessionSet', multiResult.data);

                multiLogin = true;
            } else {
                return 'cancel';
            }
        }

        context.commit('isLogin');

        if(multiLogin === false) {
            context.commit('sessionSet', result.data); //세션 상태관리
        }

        const socket = await new WebSocket(`ws://${process.env.VUE_APP_LOCAL_URI}websocket-endpoint`);

        socket.onopen = function() {    
            
            context.commit('socketSet', socket);
            socket.send('접속');
        };

        /**
         * onmessage는 로그인할 때 한번만 전역적으로 등록되고 계속 쓴다. 계속 loginHandler가 호출되지 않는다.
         * 메세지가 올때마다 socket.onmessage 를 계속 호출하는게 아니라 처음에 한번 등록해놓으면 그걸 계속 재 사용하는것같은 느낌.
         */
        socket.onmessage = function(event) {
            
            if(event.data === 'multiLogin') {

                alert('동일한 아이디로 로그인 되었습니다. 로그아웃 됩니다.');

                context.commit('isLogout', {});
                location.href = '/';
            }
            
            if(event.data.indexOf(':') == -1) {

                let userList = event.data.substring(1);
                userList = userList.slice(0, -1);
                userList = userList.split(',');
                context.commit('loginUserSet', userList);
            }
            else {
                context.commit('chatMessagePush', event.data);

                context.commit('btnShowFlag');
                
            }
            
          };

        return 'success';
    },

    refreshSocketConnect: async context => {

        const socket = await new WebSocket(`ws://${process.env.VUE_APP_LOCAL_URI}websocket-endpoint`);

        socket.onopen = function() {    
            
            context.commit('socketSet', socket);
            socket.send('접속');
        };

        /**
         * onmessage는 로그인할 때 한번만 전역적으로 등록되고 계속 쓴다. 계속 loginHandler가 호출되지 않는다.
         * 메세지가 올때마다 socket.onmessage 를 계속 호출하는게 아니라 처음에 한번 등록해놓으면 그걸 계속 재 사용하는것같은 느낌.
         */
        socket.onmessage = function(event) {
            
            if(event.data === 'multiLogin') {

                alert('동일한 아이디로 로그인 되었습니다. 로그아웃 됩니다.');

                context.commit('isLogout', {});
                location.href = '/';
            }
            
            if(event.data.indexOf(':') == -1) {

                let userList = event.data.substring(1);
                userList = userList.slice(0, -1);
                userList = userList.split(',');
                context.commit('loginUserSet', userList);
            }
            else {
                context.commit('chatMessagePush', event.data);

                context.commit('btnShowFlag');
                
            }
            
          };
    },

    logoutHandler: async context => {
        await instance.post('logout.wms');
        context.commit('isLogout', {});
    },


    userModify: async (context, data) => {
        context.commit('isLoading');
        const result = await instance.post('userModify', data)
        context.commit('isLoading');
        
        if(result.data.result === 'success') {
            context.commit('sessionSet', result.data.user);
        }
        
        else {
            alert("에러 발생");
            return;
        }
    },


    userGenerate: async(context, data) => {
        context.commit('isLoading');
        const result = await instance.post('userGenerate', data);
        const result2 = await instance.post('selectUser', data);
        context.commit('userDataSet', result2.data);
        context.commit('isLoading');

        if(result.data.result === 'fail') {
            alert("에러발생");
            return;
        }
    },


    userDelete: async(context, data) => {
        context.commit('isLoading');
        const result = await instance.post('userDelete', data);
        context.commit('isLoading');

        if(result.data.result === 'fail') {
            alert("에러발생");
            return;
        }
    },


    sessionInfo: async context => {
        context.commit('isLoading');
        const result = await instance.post('sessionInfo');
        context.commit('isLoading');
        if(result.data !== '') {
          context.commit('sessionSet', result.data);
          context.commit('isLogin');
        }
        
        return result.data;
    },


    mainPageQuery: async (context, data) => {
        context.commit('isLoading');
        const result = await instance.post('mainPageQuery', data);
        context.commit('isLoading');
        
        if(result.data['result'] === 'fail') {
            alert('잘못된 쿼리입니다.');
            return;
        }

        context.commit('mainPageDataSet', result.data);
    },


    selectUploadFile: async (context, data) => {
        context.commit('isLoading');
        const result = await instance.post('selectUploadFile', data);
        context.commit('isLoading');

        return result.data;
    },

    selectUploadFileO: async (context, data) => {
        context.commit('isLoading');
        const result = await instance.post('selectUploadFileO', data);
        context.commit('isLoading');

        return result.data;
    },
    
    selectInbOrderEntry: async (context, data) => {
        context.commit('isLoading');
        const result = await instance.post('selectInbOrderEntry', data);
        context.commit('isLoading');
        context.commit('dataSet2', result.data);
    },

    selectOutOrderEntry: async (context, data) => {
        context.commit('isLoading');
        const result = await instance.post('selectOutOrderEntry', data);
        context.commit('isLoading');
        context.commit('outOrderDataSet2', result.data);
    },

    selectInbOrderEntryDetail: async (context, data) => {
        context.commit('isLoading');
        const result = await instance.post('selectInbOrderEntryDetail', data);
        context.commit('isLoading');
        context.commit('dataSet3', result.data);
    },

    selectOutOrderEntryDetail: async (context, data) => {
        context.commit('isLoading');
        const result = await instance.post('selectOutOrderEntryDetail', data);
        context.commit('isLoading');
        context.commit('outOrderDataSet3', result.data);
    },

    insertUploadFile: async (context, data) => {
        context.commit('isLoading');
        await instance.post('insertUploadFile', data);
        context.commit('isLoading');
    },

    insertUploadFileO: async (context, data) => {
        context.commit('isLoading');
        await instance.post('insertUploadFileO', data);
        context.commit('isLoading');
    },

    inbGenerateU: async (context, data) => {
        context.commit('isLoading');
        const result = await instance.post('inbGenerateU', data);
        context.commit('isLoading');

        return result.data
    },

    outGenerateU: async (context, data) => {
        context.commit('isLoading');
        const result = await instance.post('outGenerateU', data);
        context.commit('isLoading');

        return result.data
    },

    doInbEntry: async (context, data) => {
        context.commit('isLoading');
        await instance.post('inbGenerateMD', data);
        context.commit('isLoading');
    },

    doOutEntryValid: async (context, data) => {
        context.commit('isLoading');
        const result = await instance.post('outGenerateMD', data);
        context.commit('isLoading');

        return result.data;
    },

    doOutEntry: async (context, data) => {
        context.commit('isLoading');
        await instance.post('outGenerateMD', data);
        context.commit('isLoading');
    },
    
    selectInbInspection: async (context, data) => {
        context.commit('isLoading');
        const result = await instance.post('selectInbInspection', data);
        context.commit('isLoading');
        context.commit('InbInspectionDataSet', result.data);
    },

    selectOutInspection: async (context, data) => {
        context.commit('isLoading');
        const result = await instance.post('selectOutInspection', data);
        context.commit('isLoading');
        context.commit('OutInspectionDataSet', result.data);
    },
    
    selectInbInspectionDetail: async (context, data) => {
        context.commit('isLoading');
        const result = await instance.post('selectInbInspectionDetail', data);
        context.commit('isLoading');
        context.commit('InbInspectionDetailDataSet', result.data);
    },

    selectOutInspectionDetail: async (context, data) => {
        context.commit('isLoading');
        const result = await instance.post('selectOutInspectionDetail', data);
        context.commit('isLoading');
        context.commit('OutInspectionDetailDataSet', result.data);
    },
    
    inbInspection: async (context, data) => {
        context.commit('isLoading');
        await instance.post('inbInspection', data);
        context.commit('isLoading');
    },

    outInspection: async (context, data) => {
        context.commit('isLoading');
        await instance.post('outInspection', data);
        context.commit('isLoading');
    },

    inbInspectionCancel: async (context, data) => {
        context.commit('isLoading');
        await instance.post('inbInspectionCancel', data);
        context.commit('isLoading');
    },
    
    inbConfirm: async (context, data) => {
        context.commit('isLoading');
        await instance.post('inbConfirm', data);
        context.commit('isLoading');
    },

    outConfirm: async (context, data) => {
        context.commit('isLoading');
        await instance.post('outConfirm', data);
        context.commit('isLoading');
    },

    selectInbConfirmValid: async (context, data) => {
        context.commit('isLoading');
        const result = await instance.post('selectInbConfirmValid', data);
        context.commit('isLoading');
        
        return result.data;
    },

    selectOutConfirmValid: async (context, data) => {
        context.commit('isLoading');
        const result = await instance.post('selectOutConfirmValid', data);
        context.commit('isLoading');
        
        return result.data;
    },

    selectStock: async (context, data) => {
        context.commit('isLoading');
        const result = await instance.post('selectStock', data);
        context.commit('isLoading');
        
        context.commit('stockDataSet', result.data);
    },


    

}