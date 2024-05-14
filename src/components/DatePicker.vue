<template>
    <v-menu
        v-model="menu"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="ITEM_CD"
            label="입고예정일자"
            readonly
            v-on="on"
            style="max-width: 300px;"
          ></v-text-field>
        </template>
        
        <v-date-picker v-model="ITEM_CD" @input="menu = false"></v-date-picker>
      </v-menu>
</template>

<script>
export default {
  data() {
    return {
      menu: false,
      ITEM_CD: null,
    };
  },
};
</script>