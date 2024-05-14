<template>
    <div style="height: 200px;">
        <b @click="sessionValid" style="cursor: pointer; font-size: 70px; margin-left: 32px;">WMS</b>
        <v-card style="width: 200px; height: 90px; border: solid 1px; margin-left: 25px; padding-top: 10px;">
          <v-icon size="30" style="padding-left: 50px;">mdi-account</v-icon>
            <b style="">{{ this.$store.state.session['name'] }}</b><br>
            <div style="margin-left: 11px; margin-top: 10px;">
              <v-btn @click="userModify" small style="margin-right: 20px;">정보수정</v-btn>
              <v-btn @click="logout" small>로그아웃</v-btn>
            </div>
        </v-card>
      </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'

export default ({
    methods: {
        userModify() {
            this.$store.state.userModal = !this.$store.state.userModal
        },

        logout() {
            this.logoutHandler();
            location.href = "/";
        },

        sessionValid() {
            const result = this.loginSessionValid();
            if(result) {
                this.$router.push('/');
            }
            else {
                if(this.$router.history.current['name'] === 'MainPage') {
                    //this.$router.go(this.$router.currentRoute); //새로고침 시 vuex가 날아감.
                    return;
                }
                else {
                    this.$router.push('/MainPage');
                }
            }
        },

        ...mapActions(['logoutHandler']),
        ...mapMutations(['loginSessionValid']),
    },
})
</script>
