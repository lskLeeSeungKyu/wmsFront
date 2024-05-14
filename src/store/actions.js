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


    userSearch: async (context, data) => {
        context.commit('isLoading');
        //let result = await instance.post('selectUser', data);
        let result = await axios.post('http://10.101.52.96:8090/selectUser', data);
        context.commit('userDataSet', result.data);
        context.commit('isLoading');
    },


    loginHandler: async (context, data) => {
        context.commit('isLoading');
        //let result = await instance.post('login.wms', data);
        let result = await axios.post('http://10.101.52.96:8090/login.wms', data);
        context.commit('isLoading');
        if(result.data === '') {
            //실패
            return 'fail';
        }
        context.commit('isLogin');
        context.commit('sessionSet', result.data); //세션 상태관리

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
            
            if(event.data.indexOf(':') == -1) {

                let userList = event.data.substring(1);
                userList = userList.slice(0, -1);
                userList = userList.split(',');
                context.commit('loginUserSet', userList);
            }
            else {
                context.commit('chatMessagePush', event.data);
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
            alert("에러발생");
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
    
    selectInbOrderEntry: async (context, data) => {
        context.commit('isLoading');
        //const result = await instance.post('selectInbOrderEntry', data);
        let result = await axios.post('http://10.101.52.96:8090/selectInbOrderEntry', data);
        context.commit('isLoading');
        context.commit('dataSet2', result.data);
    },

    selectInbOrderEntryDetail: async (context, data) => {
        context.commit('isLoading');
        //const result = await instance.post('selectInbOrderEntryDetail', data);
        let result = await axios.post('http://10.101.52.96:8090/selectInbOrderEntryDetail', data);
        context.commit('isLoading');
        context.commit('dataSet3', result.data);
    },


    insertUploadFile: async (context, data) => {
        context.commit('isLoading');
        //await instance.post('insertUploadFile', data);
        await axios.post('http://10.101.52.96:8090/insertUploadFile', data);
        context.commit('isLoading');
    },

    inbGenerateU: async (context, data) => {
        context.commit('isLoading');
        //const result = await instance.post('inbGenerateU', data);
        let result = await axios.post('http://10.101.52.96:8090/inbGenerateU', data);
        context.commit('isLoading');

        return result.data
    },

    doInbEntry: async (context, data) => {
        context.commit('isLoading');
        //await instance.post('inbGenerateMD', data);
        await axios.post('http://10.101.52.96:8090/inbGenerateMD', data);
        context.commit('isLoading');
    },
    
    selectInbInspection: async (context, data) => {
        context.commit('isLoading');
        //const result = await instance.post('selectInbInspection', data);
        let result = await axios.post('http://10.101.52.96:8090/selectInbInspection', data);
        context.commit('isLoading');
        context.commit('InbInspectionDataSet', result.data);
    },
    
    selectInbInspectionDetail: async (context, data) => {
        context.commit('isLoading');
        //const result = await instance.post('selectInbInspectionDetail', data);
        let result = await axios.post('http://10.101.52.96:8090/selectInbInspectionDetail', data);
        context.commit('isLoading');
        context.commit('InbInspectionDetailDataSet', result.data);
    },
    
    inbInspection: async (context, data) => {
        context.commit('isLoading');
        //await instance.post('inbInspection', data);
        await axios.post('http://10.101.52.96:8090/inbInspection', data);
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

    selectInbConfirmValid: async (context, data) => {
        context.commit('isLoading');
        //const result = await instance.post('selectInbConfirmValid', data);
        let result = await axios.post('http://10.101.52.96:8090/selectInbConfirmValid', data);
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