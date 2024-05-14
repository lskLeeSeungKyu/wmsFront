<template>
  <v-app>
    <v-container style="margin-left: 248px;"> 
    <v-row>
      <v-col cols="2">
        <v-text-field @keyup.enter="userSearch({ID, NAME})" dense outlined label="사용자ID" v-model="ID" style="max-width: 300px;"></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-text-field @keyup.enter="userSearch({ID, NAME})" dense outlined label="사용자이름" v-model="NAME" style="max-width: 300px;"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
    <v-col cols="2">
    <v-text-field label="사용자 검색" v-model="search" style="max-width: 300px;"></v-text-field>
    </v-col>
    <v-col>
      <v-btn @click="doReset" class="font-weight-bold" style="float: right;">초기화</v-btn>
      <v-btn @click="deleteUsers(selectedItems)" class="font-weight-bold" style="float: right; background: red; color: white;">삭제</v-btn>
      <v-btn @click="userGenerate" class="font-weight-bold" style="float: right; background: black; color: white;">신규</v-btn>
      <v-btn @click="userSearch({ID, NAME})" class="font-weight-bold" style="float: right;">조회</v-btn> 
    </v-col>
    </v-row>
    <v-data-table :headers="headers"
                  :items="grid_mstUser"
                  :search="search"
                  no-data-text="조회된 데이터가 없습니다."
                  :items-per-page="viewCount"
                  :footer-props="{
                    'items-per-page-text': '페이지 별 데이터 행 수',
                     pageText: '총 {2}개 항목 중 {0}-{1}',
                  }"
                  show-select
                  :single-select="singleSelect"
                  v-model="selectedItems"
                  @dblclick:row="userModify"
                  dense
    ></v-data-table>
    
  </v-container>
 </v-app> 
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { SessionValid } from '@/mixin/SessionValid.js'

export default ({
  mixins: [SessionValid],

  data() {
    return {
      headers: [
          { text: '사용자ID', value: 'id' },
          { text: '이름', value: 'name' },
          { text: '휴대폰', value: 'htel' },
          { text: '이메일', value: 'email' },
        ],
      
        search: '',
        viewCount: 15,
        ID: '',
        NAME: '',
        dummy: '',

        singleSelect: false,
        selectedItems: [],

        isModal: false,
    }
  },

  methods: {
    ...mapActions(['userDelete', 'userSearch', 'sessionInfo']),

    userGenerate() {
      this.$router.push({name: 'UserGenerate'});
    },

    doReset() {
      this.$store.state.grid_mstUser = [];
      this.search = '';
      this.ID = '';
      this.NAME = '';
      this.selectedItems = [];
    },

    userModify (event, { item } ) {
      this.$router.push({name: 'UserGenerate', params: { item }});
    },

    async deleteUsers(items) {
      if(items.length === 0) {
        alert("처리할 대상이 없습니다.");
        return;
      }
      if(confirm("삭제 하시겠습니까?")) {
        await this.userDelete(items);
        await this.userSearch({ID: this.dummy, NAME: this.dummy});
      }
      
    },

  },

  computed: {
    ...mapGetters(['grid_mstUser']),
  },
})
</script>

<style scoped>
  
</style>