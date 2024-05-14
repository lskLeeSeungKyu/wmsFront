import vueCookies from 'vue-cookies'
import { router } from '@/router/index'
import { store } from '@/store/store'

export const SessionValid = {
    async created() {

        if(vueCookies.isKey('UserSession') && Object.keys(store.state.session).length === 0) {

          const result = await store.dispatch('sessionInfo');

          if(result === '') { //브라우저 껏다 켰을 때. (쿠키 없음, 서버에 세션 끊어짐)
            vueCookies.remove('UserSession');
          }
          else {
            router.push('/MainPage');
          }
        }
      },
}