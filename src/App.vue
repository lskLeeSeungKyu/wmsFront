<template>
  <div>
    <keep-alive>
      <menu-bar v-if="isLogin"></menu-bar>
    </keep-alive>
    <keep-alive>
      <loading-spinner class="loading-spinner-container" v-if="isLoading"></loading-spinner>
    </keep-alive>
    <keep-alive>
      <user-modal v-if="userModal"></user-modal>
    </keep-alive>
    <keep-alive>
      <user-chat v-if="isLogin"></user-chat>
    </keep-alive>

    <span @click="loginUserInfo" style="position: fixed; bottom: 10px; right: 1100px; color:black; font-size: 9px; cursor: pointer;">접속 유저</span>

    <router-view></router-view>
  </div>
</template>

<script>
import MenuBar from './components/MenuBar'
import LoadingSpinner from './components/LoadingSpinner'
import UserModal from './views/UserModal'
import UserChat from './components/UserChat'
import { mapGetters } from 'vuex'

export default {

  methods: {
    loginUserInfo() {
      alert(this.$store.state.loginUser);
    },
  },

  computed: {
    ...mapGetters(['isLogin', 'isLoading', 'userModal']),
  },

  components: {
    MenuBar,
    LoadingSpinner,
    UserModal,
    UserChat,

  },

}
</script>

<style scoped>
.loading-spinner-container {
  position: fixed; /* 페이지 스크롤과 관계없이 항상 화면에 고정됩니다. */
  top: 50%; /* 화면 세로 중앙에 위치합니다. */
  left: 50%; /* 화면 가로 중앙에 위치합니다. */
  transform: translate(-50%, -50%); /* 화면 가운데 정렬됩니다. */
}
</style>