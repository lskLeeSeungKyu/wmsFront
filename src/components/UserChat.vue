<template>
<div>
  <transition name="modal">
    <div class="modal-container" v-if="showModal">
      <div class="modal-content" ref="modalContent">
        <p v-for="(message, index) in this.$store.state.chat" :key="index">{{ message }}</p>
      </div>
      <v-text-field v-model="messageInput" label="텍스트 입력" @keyup.enter="sendMessage" dense outlined style="height: 50px;"></v-text-field>
      <v-btn style="width: 100%; float: right;" @click="hideModal">닫기</v-btn>
    </div>
  </transition>

  <v-btn v-show="btnShow" style="background: black; color: white;" class="open-modal-button font-weight-bold" @click="modalOpen">실시간 공지</v-btn>

</div>
</template>

<script>
import { mapActions } from 'vuex'
export default {

  data() {
    return {
      showModal: false,
      btnShow: true,

      messageInput: '',
    };
  },
  
  methods: {

    scrollToBottom() { //스크롤 맨 아래로
      this.$nextTick(() => {
        const container = this.$refs.modalContent;
        container.scrollTop = container.scrollHeight;
      });
    },

    sendMessage() {
      let userName = this.$store.state.session['name'];
      let fullMessage = `${userName} : ${this.messageInput}`;

      this.messageInput = '';
      this.$store.state.socket.send(fullMessage);

      this.scrollToBottom();

    },

    hideModal() {
      this.showModal = false;
      this.btnShow = true;
    },

    modalOpen() {
      this.showModal = true;
      this.btnShow = false;

      this.scrollToBottom();
    },

    ...mapActions(['reset']),
  },

};
</script>

<style scoped>
.modal-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
}

.modal-content {
  position: relative;
  background-color: transparent; /* 투명하게 설정 */
  padding: 20px;
  max-height: 300px; /* 최대 높이 지정 */
  overflow-y: auto; /* 수직 스크롤이 필요한 경우 자동으로 스크롤 표시 */
  width: 300px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.open-modal-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
}

/* 모달 애니메이션 효과 */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s;
}
.modal-enter, .modal-leave-to {
  opacity: 0;
}
.font-weight-bold {
  font-weight: bold;
}
</style>