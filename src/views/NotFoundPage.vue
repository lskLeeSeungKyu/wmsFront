<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card style="width: 500px; margin: 0 auto" class="elevation-12" color="grey lighten-4" max-width="600">
      <v-card-title style="margin-left: 153px; font-weight: bold;" class="headline text-center">Page Not Found</v-card-title>
      <v-card-text class="text-center" style="margin: 0 auto">
        <v-icon style="margin-left: 120px;" size="220" class="mb-5" color="grey">mdi-alert-circle-outline</v-icon>
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn color="primary" style="color: black; font-weight: bold; margin-left: 176px;" @click="goHome">메인으로 이동</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  methods: {
    goHome() {
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>