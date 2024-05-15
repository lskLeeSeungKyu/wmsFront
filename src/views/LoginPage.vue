<template>
  <v-img
    src="@/assets/warehouse.png"
    gradient="to bottom, rgba(0,0,0,.3), rgba(0,0,0,.3)"
    height="100vh"
  >
  <v-container>
    <v-layout justify-center align-center>
      <v-flex xs12 sm8 md4> <!-- 중앙 정렬 -->
        <v-card class="center"> 
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title style="margin: 0 auto">창고 관리 시스템</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="login({ID, PW})">
              <v-text-field
                v-model="ID"
                ref="id"
                label="아이디"
                prepend-icon="mdi-account"
                @input="onInput"
              ></v-text-field>
              <v-text-field
                v-model="PW"
                ref="pw"
                label="비밀번호"
                prepend-icon="mdi-lock"
                type="password"
                @input="onInput"
              ></v-text-field>
              <v-btn color="primary" type="submit" style="color: black; margin-left: 15px; width: 240px">로그인</v-btn>
              <span v-show="validCheck" style="color: red; margin-left: 25px;">로그인 정보가 일치하지 않습니다.</span>
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
  </v-img>
</template>

<script>
import { mapActions } from 'vuex'
import { SessionValid } from '@/mixin/SessionValid.js'
export default {
  mixins: [SessionValid],

  data() {
    return {
      ID: '',
      PW: '',
      danger: false,
    };
  },
  methods: {
    async login(data) {
      if (this.ID === '') {
        this.$refs.id.focus();
        return;
      }
      if (this.PW === '') {
        this.$refs.pw.focus();
        return;
      }

      let result = await this.loginHandler(data);
      if (result === 'fail') {
        this.danger = true;
        return;
      }
      else if (result === 'cancel') {
        return;
      }
      this.$router.push('/MainPage');
    },

    onInput() {
      this.danger = false;
    },

    ...mapActions(['loginHandler']),

  },
  computed: {
    validCheck() {
      return this.danger;
    }
  }
};
</script>

<style scoped>

.center {
  width: 300px;
  height: 280px;
  /* 상하좌우 정중앙 정렬하기 */
  position: absolute;
  background-color: #f7f7f7; /* 카드의 배경색 설정 */
  top: 35%;
  left: 45%;
  margin: -25px 0 0 -25px; /* 자식 요소 전체를 중앙 정렬하기 위해, 상단 및 왼쪽 margin을 마이너스 값으로 적용하기 */
}
</style>