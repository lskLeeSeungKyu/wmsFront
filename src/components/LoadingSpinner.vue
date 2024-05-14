<template>
  <v-overlay class="loading-overlay" :value="isLoading">
    <v-progress-circular style="margin-left: 95px;"
      :size="64"
      :width="7"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <br><br>
    <p style="margin-left: 80px;">처리중입니다.</p>
  </v-overlay>
</template>

<style scoped>
.loading-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 999;
}
</style>