import vueCookies from 'vue-cookies'

export const mutations = {
    dataSet: (state, payload) => {
        state.grid_inbOrder = payload;
    },
    dataSet2: (state, payload) => {
        state.grid_inbEntry = payload;
    },
    dataSet3: (state, payload) => {
        state.grid_inbEntryDetail = payload;
    },
    InbInspectionDataSet: (state, payload) => {
        state.grid_inbInspection = payload;
    },
    InbInspectionDetailDataSet: (state, payload) => {

        for(const item of payload) {
            if(item['INSPECTION_YN'] === 'Y') {
                item['SCAN_QTY'] = item['ORDER_QTY'];
            }
            else {
                item['SCAN_QTY'] = '0';
            }
        }
        state.grid_inbInspectionDetail = payload;
    },
    stockDataSet: (state, payload) => {
        state.grid_stock = payload;
    },
    userDataSet: (state, payload) => {
        state.grid_mstUser = payload;
    },
    mainPageDataSet: (state, payload) => {
        state.grid_mainPage = payload;
    },
    sessionSet: (state, payload) => {
        state.session = payload;
        vueCookies.set('UserSession', '');
    },
    socketSet: (state, payload) => {
        state.socket = payload;
    },
    loginUserSet: (state, payload) => {
        state.loginUser = payload;
    },
    btnShowFlag: state => {
         if(state.btnShow === true) {
            state.newMessageText = true;
         }
    },
    chatMessagePush: (state, payload) => {
        state.chat.push(payload);
    },
    isLogin: state => {
        state.isLogin = !state.isLogin;
    },
    isLogout: (state, payload) => {

        for(let i=0; i<state.loginUser.length; i++) {
            if(state.session['name'] === state.loginUser[i]) {
                state.loginUser.splice(i, 1);
            }
        }

        state.session = payload;
        state.isLogin = !state.isLogin;
        state.chat = [];
        vueCookies.remove('UserSession');

    },
    isLoading: state => {
        state.isLoading = !state.isLoading;
    },
    loginSessionValid: state => {
        if(Object.keys(state.session).length !== 0) {
            return false;
        }
        else {
            return true;
        }
    },
    
}