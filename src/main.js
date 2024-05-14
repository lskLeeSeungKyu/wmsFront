import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueCookies from 'vue-cookies'
import { router } from './router/index'
import { store } from './store/store'

Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  store,
  VueCookies,
  render: h => h(App)
}).$mount('#app')

Vue.use(VueCookies);

Vue.$cookies.config('3d');