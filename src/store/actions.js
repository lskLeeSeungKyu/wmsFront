import axios from 'axios';

axios.defaults.baseURL = 'http://10.101.52.96:8090'; 
axios.defaults.withCredentials = true; //자격증명정보 (쿠키교환 가능 (jsessionid)) <CSR>

// const instance = axios.create({
//     baseURL: 'http://10.101.52.96:8090',
//     //process.env.VUE_APP_API_URL
// });



export const actions = {

    doSearch: async (context, data) => {
        context.commit('isLoading');
        //let result = await instance.post('selectInbOrder', data);
        let result = await axios.post('http://10.101.52.96:8090/selectInbOrder', data);
        context.commit('dataSet', result.data);
        context.commit('isLoading');
    },

    outOrderDoSearch: async (context, data) => {
        context.commit('isLoading');
        //let result = await instance.post('selectOutOrder', data);
        let result = await axios.post('http://10.101.52.96:8090/selectOutOrder', data);
        context.commit('outOrderDataSet', result.data);
        context.commit('isLoading');
    },


    userSearch: async (context, data) => {
        context.commit('isLoading');
        //let result = await instance.post('selectUser', data);
        let result = await axios.post('http://10.101.52.96:8090/selectUser', data);
        context.commit('userDataSet', result.data);
        context.commit('isLoading');
    },


    loginHandler: async (context, data) => {
        let multiLogin = false;

        context.commit('isLoading');
        //let result = await instance.post('login.wms', data);
        let result = await axios.post('http://10.101.52.96:8090/login.wms', data);
        context.commit('isLoading');

        if(result.data === '') {
            //실패
            return 'fail';
        }

        if(result.data['name'] === '중복') {
            if(confirm('이미 로그인되어 있습니다. 기존 접속을 끊으시겠습니까?')) {

                const multiResult = await axios.post('http://10.101.52.96:8090/multiLogin.wms', data);
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

        const socket = await new WebSocket('ws://10.101.52.96:8090/websocket-endpoint');

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

    logoutHandler: async context => {
        //await instance.post('logout.wms');
        await axios.post('http://10.101.52.96:8090/logout.wms');
        context.commit('isLogout', {});
    },


    userModify: async (context, data) => {
        context.commit('isLoading');
        //let result = await instance.post('userModify', data)
        let result = await axios.post('http://10.101.52.96:8090/userModify', data);
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
        //let result = await instance.post('userGenerate', data);
        let result = await axios.post('http://10.101.52.96:8090/userGenerate', data);
        //let result2 = await instance.post('selectUser', data);
        let result2 = await axios.post('http://10.101.52.96:8090/selectUser', data);
        context.commit('userDataSet', result2.data);
        context.commit('isLoading');

        if(result.data.result === 'fail') {
            alert("에러발생");
            return;
        }
    },


    userDelete: async(context, data) => {
        context.commit('isLoading');
        //let result = await instance.post('userDelete', data);
        let result = await axios.post('http://10.101.52.96:8090/userDelete', data);
        context.commit('isLoading');

        if(result.data.result === 'fail') {
            alert("에러발생");
            return;
        }
    },


    sessionInfo: async context => {
        context.commit('isLoading');
        //let result = await instance.post('sessionInfo');
        let result = await axios.post('http://10.101.52.96:8090/sessionInfo');
        context.commit('isLoading');
        if(result.data !== '') {
          context.commit('sessionSet', result.data);
          context.commit('isLogin');
        }
        
        return result.data;
    },


    mainPageQuery: async (context, data) => {
        context.commit('isLoading');
        //let result = await instance.post('mainPageQuery', data);
        let result = await axios.post('http://10.101.52.96:8090/mainPageQuery', data);
        context.commit('isLoading');
        
        if(result.data['result'] === 'fail') {
            alert('잘못된 쿼리입니다.');
            return;
        }

        context.commit('mainPageDataSet', result.data);
    },


    selectUploadFile: async (context, data) => {
        context.commit('isLoading');
        //let result = await instance.post('selectUploadFile', data);
        let result = await axios.post('http://10.101.52.96:8090/selectUploadFile', data);
        context.commit('isLoading');

        return result.data;
    },

    selectUploadFileO: async (context, data) => {
        context.commit('isLoading');
        //let result = await instance.post('selectUploadFileO', data);
        let result = await axios.post('http://10.101.52.96:8090/selectUploadFileO', data);
        context.commit('isLoading');

        return result.data;
    },
    
    selectInbOrderEntry: async (context, data) => {
        context.commit('isLoading');
        //const result = await instance.post('selectInbOrderEntry', data);
        let result = await axios.post('http://10.101.52.96:8090/selectInbOrderEntry', data);
        context.commit('isLoading');
        context.commit('dataSet2', result.data);
    },

    selectOutOrderEntry: async (context, data) => {
        context.commit('isLoading');
        //const result = await instance.post('selectOutOrderEntry', data);
        let result = await axios.post('http://10.101.52.96:8090/selectOutOrderEntry', data);
        context.commit('isLoading');
        context.commit('outOrderDataSet2', result.data);
    },

    selectInbOrderEntryDetail: async (context, data) => {
        context.commit('isLoading');
        //const result = await instance.post('selectInbOrderEntryDetail', data);
        let result = await axios.post('http://10.101.52.96:8090/selectInbOrderEntryDetail', data);
        context.commit('isLoading');
        context.commit('dataSet3', result.data);
    },

    selectOutOrderEntryDetail: async (context, data) => {
        context.commit('isLoading');
        //const result = await instance.post('selectOutOrderEntryDetail', data);
        let result = await axios.post('http://10.101.52.96:8090/selectOutOrderEntryDetail', data);
        context.commit('isLoading');
        context.commit('outOrderDataSet3', result.data);
    },

    insertUploadFile: async (context, data) => {
        context.commit('isLoading');
        //await instance.post('insertUploadFile', data);
        await axios.post('http://10.101.52.96:8090/insertUploadFile', data);
        context.commit('isLoading');
    },

    insertUploadFileO: async (context, data) => {
        context.commit('isLoading');
        //await instance.post('insertUploadFileO', data);
        await axios.post('http://10.101.52.96:8090/insertUploadFileO', data);
        context.commit('isLoading');
    },

    inbGenerateU: async (context, data) => {
        context.commit('isLoading');
        //const result = await instance.post('inbGenerateU', data);
        let result = await axios.post('http://10.101.52.96:8090/inbGenerateU', data);
        context.commit('isLoading');

        return result.data
    },

    outGenerateU: async (context, data) => {
        context.commit('isLoading');
        //const result = await instance.post('outGenerateU', data);
        let result = await axios.post('http://10.101.52.96:8090/outGenerateU', data);
        context.commit('isLoading');

        return result.data
    },

    doInbEntry: async (context, data) => {
        context.commit('isLoading');
        //await instance.post('inbGenerateMD', data);
        await axios.post('http://10.101.52.96:8090/inbGenerateMD', data);
        context.commit('isLoading');
    },

    doOutEntryValid: async (context, data) => {
        context.commit('isLoading');
        //await instance.post('outGenerateMD', data);
        const result = await axios.post('http://10.101.52.96:8090/outGenerateMDValid', data);
        context.commit('isLoading');

        return result.data;
    },

    doOutEntry: async (context, data) => {
        context.commit('isLoading');
        //await instance.post('outGenerateMD', data);
        await axios.post('http://10.101.52.96:8090/outGenerateMD', data);
        context.commit('isLoading');
    },
    
    selectInbInspection: async (context, data) => {
        context.commit('isLoading');
        //const result = await instance.post('selectInbInspection', data);
        let result = await axios.post('http://10.101.52.96:8090/selectInbInspection', data);
        context.commit('isLoading');
        context.commit('InbInspectionDataSet', result.data);
    },

    selectOutInspection: async (context, data) => {
        context.commit('isLoading');
        //const result = await instance.post('selectOutInspection', data);
        let result = await axios.post('http://10.101.52.96:8090/selectOutInspection', data);
        context.commit('isLoading');
        context.commit('OutInspectionDataSet', result.data);
    },
    
    selectInbInspectionDetail: async (context, data) => {
        context.commit('isLoading');
        //const result = await instance.post('selectInbInspectionDetail', data);
        let result = await axios.post('http://10.101.52.96:8090/selectInbInspectionDetail', data);
        context.commit('isLoading');
        context.commit('InbInspectionDetailDataSet', result.data);
    },

    selectOutInspectionDetail: async (context, data) => {
        context.commit('isLoading');
        //const result = await instance.post('selectOutInspectionDetail', data);
        let result = await axios.post('http://10.101.52.96:8090/selectOutInspectionDetail', data);
        context.commit('isLoading');
        context.commit('OutInspectionDetailDataSet', result.data);
    },
    
    inbInspection: async (context, data) => {
        context.commit('isLoading');
        //await instance.post('inbInspection', data);
        await axios.post('http://10.101.52.96:8090/inbInspection', data);
        context.commit('isLoading');
    },

    outInspection: async (context, data) => {
        context.commit('isLoading');
        //await instance.post('outInspection', data);
        await axios.post('http://10.101.52.96:8090/outInspection', data);
        context.commit('isLoading');
    },

    inbInspectionCancel: async (context, data) => {
        context.commit('isLoading');
        //await instance.post('inbInspectionCancel', data);
        await axios.post('http://10.101.52.96:8090/inbInspectionCancel', data);
        context.commit('isLoading');
    },
    
    inbConfirm: async (context, data) => {
        context.commit('isLoading');
        //await instance.post('inbConfirm', data);
        await axios.post('http://10.101.52.96:8090/inbConfirm', data);
        context.commit('isLoading');
    },

    outConfirm: async (context, data) => {
        context.commit('isLoading');
        //await instance.post('outConfirm', data);
        await axios.post('http://10.101.52.96:8090/outConfirm', data);
        context.commit('isLoading');
    },

    selectInbConfirmValid: async (context, data) => {
        context.commit('isLoading');
        //const result = await instance.post('selectInbConfirmValid', data);
        let result = await axios.post('http://10.101.52.96:8090/selectInbConfirmValid', data);
        context.commit('isLoading');
        
        return result.data;
    },

    selectOutConfirmValid: async (context, data) => {
        context.commit('isLoading');
        //const result = await instance.post('selectOutConfirmValid', data);
        let result = await axios.post('http://10.101.52.96:8090/selectOutConfirmValid', data);
        context.commit('isLoading');
        
        return result.data;
    },

    selectStock: async (context, data) => {
        context.commit('isLoading');
        //const result = await instance.post('selectStock', data);
        let result = await axios.post('http://10.101.52.96:8090/selectStock', data);
        context.commit('isLoading');
        
        context.commit('stockDataSet', result.data);
    },


    

}