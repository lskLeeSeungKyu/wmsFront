<template>
 <v-app>
  <v-container style="margin-left: 248px;"> 
    <v-row>
      <v-col cols="2">
        <v-text-field ref="id" v-model="USER['id']" label="아이디" style="max-width: 300px;" :rules="required"></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-text-field ref="pw" type="password" v-model="USER['pw']" label="비밀번호" style="max-width: 300px;" :rules="required"></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-text-field ref="name" v-model="USER['name']" label="사용자명" style="max-width: 300px;" :rules="required"></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-text-field v-model="USER['htel']" label="휴대폰" style="max-width: 300px;"></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-text-field v-model="USER['email']" label="이메일" style="max-width: 300px;"></v-text-field>
      </v-col>
      <v-col>
        <v-btn @click="generate" class="font-weight-bold" style="float: right; background: black; color: white;">저장</v-btn>
        <v-btn @click="previous" class="font-weight-bold" style="float: right;">이전</v-btn> 
      </v-col>
    </v-row>  
  </v-container>
 </v-app>
</template>

<script>
import { mapActions } from 'vuex';
export default ({
    data() {
        return {
            USER: {},

            dummy: '',

            required: [
             v => !!v || '필수 항목입니다.'
            ],
        }
    },

    created() {
      const item = this.$route.params.item;
      if(item !== undefined) {
        this.USER['id'] = item['id'];
        this.USER['pw'] = item['pw'];
        this.USER['name'] = item['name'];
        this.USER['htel'] = item['htel'];
        this.USER['email'] = item['email'];
      }
    },

    mounted() {
      const item = this.$route.params.item;
      if(item !== undefined) {
        this.$refs.id.disabled = true;
        this.$refs.name.disabled = true;
      }
    },

    methods: {
        previous() {
            this.$router.push('/MstUser');
        },

        async generate() {
            const item = this.$route.params.item;

            if(this.USER.id === undefined) {
                this.$refs.id.focus();
                return;
            }
            else if(this.USER.pw === undefined) {
                this.$refs.pw.focus();
                return;
            }
            else if(this.USER.name === undefined) {
                this.$refs.name.focus();
                return;
            }

            if(item === undefined) {
                await this.userGenerate(this.USER);
            }
            else {
                await this.userModify(this.USER);
                await this.userSearch({ID: this.dummy, NAME: this.dummy});
            }
            this.$router.push('/MstUser');
            
        },

        ...mapActions(['userGenerate', 'userModify', 'userSearch']),
    }
})
</script>

<style scoped>
  .font-weight-bold {
    font-weight: bold;
  }
</style>