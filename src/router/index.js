import Vue from 'vue'
import VueRouter from 'vue-router'
import vueCookies from 'vue-cookies'

Vue.use(VueRouter);

export const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: () => import('@/views/LoginPage.vue'),
        },
        {
            //입고예정
            path: '/InbOrder',
            name: 'InbOrder',
            component: () => import('@/views/InbBoard.vue'),
        },
        {
            //입고등록
            path: '/InbEntry',
            name: 'InbEntry',
            component: () => import('@/views/InbBoardEntry.vue'),
        },
        {
            //입고검수
            path: '/InbInspection',
            name: 'InbInspection',
            component: () => import('@/views/InbBoardInspection.vue'),
        },
        {
            //출고예정
            path: '/OutOrder',
            name: 'OutOrder',
            component: () => import('@/views/OutBoard.vue'),
        },
        {
            //출고등록
            path: '/OutEntry',
            name: 'OutEntry',
            component: () => import('@/views/OutBoardEntry.vue'),
        },
        {
            //출고검수
            path: '/OutInspection',
            name: 'OutInspection',
            component: () => import('@/views/OutBoardInspection.vue'),
        },
        {
            //현재고관리
            path: '/StkBoard',
            name: 'StkBoard',
            component: () => import('@/views/StkBoard.vue'),
        },
        {
            //
            path: '/MainPage',
            name: 'MainPage',
            component: () => import('@/views/MainPage.vue'),
        },
        {
            //사용자
            path: '/MstUser',
            name: 'MstUser',
            component: () => import('@/views/MstUser.vue'),
        },
        {
            //사용자 > 생성버튼, :item이있으면 수정(더블클릭)
            path: '/UserGenerate/:item',
            name: 'UserGenerate',
            component: () => import('@/views/UserGenerate.vue'),
        },
        {
            //404
            path: '*',
            component: () => import('@/views/NotFoundPage.vue'),
        }
    ]
});

router.beforeEach((to, from, next) => {
    console.log(to.path);
    console.log(from);
    if(vueCookies.isKey('UserSession') || to.path === '/') {
        next();
    }
    else {
        router.push('/');
        alert("권한이 없습니다.");
    }
})