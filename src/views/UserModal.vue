<template>
    <v-app>
        <v-dialog
            @keydown.esc="closeModal"
            @click:outside="closeModal"
            v-model="this.$store.state.userModal"
            width="300">
            <v-card>
                <v-card-title class="headline black" primary-title>
                    <b style="color: white;">정보수정</b>
                </v-card-title>
                <v-card-text class="pa-5">
                        <v-text-field disabled v-model="USER['id']" ref="id" label="아이디"></v-text-field>
                        <v-text-field disabled v-model="USER['name']" ref="name" label="사용자명"></v-text-field>
                        <v-text-field @keyup.enter="saveUser" type="password" v-model="USER['pw']" ref="pw" label="비밀번호" :rules="[rules.required]"></v-text-field>
                        <v-text-field @keyup.enter="saveUser" v-model="USER['htel']" ref="htel" label="휴대폰"></v-text-field>
                        <v-text-field @keyup.enter="saveUser" v-model="USER['email']" ref="email" label="이메일"></v-text-field>
                </v-card-text>
                <v-card-actions class="pa-5">
                    <v-btn class="ml-auto" @click="saveUser" outlined color="primary">저장</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-app>
</template>

<script>
import { mapActions } from 'vuex'
export default ({
    data() {
        return {
            rules: {
                required: value => !!value || "",
            },
            USER: {
                id: this.$store.state.session['id'],
                pw: this.$store.state.session['pw'],
                name: this.$store.state.session['name'],
                htel: this.$store.state.session['htel'],
                email: this.$store.state.session['email'],
            },  

        }
    },

    methods: {
        saveUser() {
            if(this.USER.pw === '') {
                this.$refs.pw.focus();
                return;
            }
            this.userModify(this.USER);
            this.closeModal();
        },
        closeModal() {
            this.$store.state.userModal = false;
        },
        ...mapActions(['userModify'])
    },
})
</script>
