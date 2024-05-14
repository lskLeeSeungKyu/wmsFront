<template>
  <v-app>
    <v-container style="margin-left: 248px;"> 
    <v-row>
      <v-col cols="2">
        <v-select
          outlined
          v-model="CUST_CD"
          label="고객사"
          dense
          :items="selectCustCd"
          item-text="name"
          item-value="value"
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-menu
        v-model="menu"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            outlined
            v-model="ORDER_DATE"
            dense
            label="입고예정일자"
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        
        <v-date-picker v-model="ORDER_DATE" @input="menu=false"></v-date-picker>
      </v-menu>
      </v-col>

    </v-row>

    <v-row>
    <v-col cols="2">
    </v-col>
    <v-col>
      <v-btn @click="doReset" class="font-weight-bold" style="float: right;">초기화</v-btn>
      <v-btn @click="doEntry(selectedItems)" class="font-weight-bold" style="float: right; background-color: red; color: white;">등록</v-btn>
      <v-btn @click="doSearchValid" class="font-weight-bold" style="float: right;">조회</v-btn> 
    </v-col>
    </v-row>

    <v-data-table :headers="headers1"
                  style="margin-top: 34px;" 
                  show-select
                  :single-select="singleSelect"
                  :items="grid_inbEntry"
                  :hide-default-footer="true"
                  item-key="ORDER_NO_CUST"
                  no-data-text="조회된 데이터가 없습니다."
                  @click:row="doSearchDetail"
                  v-model="selectedItems"
                  class="font-weight-bold"
                  dense
    ></v-data-table>

    <v-data-table :headers="headers2"
                  style="margin-top: 150px;" 
                  :items="grid_inbEntryDetail"
                  no-data-text="조회된 데이터가 없습니다."
                  :items-per-page="viewCount"
                  :footer-props="{
                    'items-per-page-text': '페이지 별 데이터 행 수',
                     pageText: '총 {2}개 항목 중 {0}-{1}',
                  }"
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
      headers1: [
          { text: '예정일자', value: 'ORDER_DATE' },
          { text: '작업번호', value: 'ORDER_NO_CUST' },
          { text: '등록유무', value: 'ENTRY_YN', align: 'center' },
        ],

      headers2: [
          { text: '라인번호', value: 'LINE_NO', align: 'center' },
          { text: '고객사', value: 'CUST_CD' },
          { text: '상품코드', value: 'ITEM_CD' },
          { text: '고객사상품코드', value: 'ITEM_CD_CUST' },
          { text: '상품명', value: 'ITEM_NM' },
          { text: '옵션표기명', value: 'OPT_DISPLAY' },
          { text: '사이즈', value: 'OPT_SIZE' },
          { text: '색상', value: 'OPT_COLOR' },
          { text: '스타일', value: 'OPT_STYLE'},
          { text: '존', value: 'ZONE_CD'  },
          { text: '로케이션', value: 'LOC_CD' },
          { text: '예정수량', value: 'ORDER_QTY', align: 'right' },
        ],
      
        menu: false,
        ORDER_DATE: new Date().toISOString().substr(0, 10),
        CUST_CD: '',
        selectedItems: [],
        singleSelect: false,
        viewCount: 15,

        selectCustCd: [
          { name: '', value: '' },
          { name: '카카오', value: '카카오' },
          { name: '배민', value: '배민' },
        ],

    }
  },

  methods: {
    ...mapActions(['selectInbOrderEntry', 'selectInbOrderEntryDetail', 'sessionInfo', 'doInbEntry']),

    async doSearchDetail(event, { item } ) {
      const data = { ORDER_NO_CUST: item['ORDER_NO_CUST'] };

      await this.selectInbOrderEntryDetail(data);
    },

    async doEntry(selectedItems) {

      if(selectedItems.length === 0) {
        alert("처리할 대상이 없습니다.");
        return;
      }

      for(const item of selectedItems) {
        if(item['ENTRY_YN'] === '등록') {
          alert('이미 등록되었습니다.');
          return;
        }
      }

      await this.doInbEntry(selectedItems);
      
      for(const item of this.$store.state.grid_inbEntry) {

        for(const item2 of selectedItems) {

          if(item2['ORDER_NO_CUST'] === item['ORDER_NO_CUST']) {
            item['ENTRY_YN'] = '등록';
            console.log(item2);
          }
        }
        
      }
    },

    async doSearchValid() {

      if(this.ORDER_DATE === '') {
        alert("입고예정일자는 필수입니다.");
        return;
      }

      const data = {
        ORDER_DATE: this.ORDER_DATE.replaceAll('-', ''), 
        CUST_CD: this.CUST_CD, 
      };

      await this.selectInbOrderEntry(data);

      this.$store.state.grid_inbEntryDetail = [];
    },

    doReset() {
      this.$store.state.grid_inbEntry = [];
      this.$store.state.grid_inbEntryDetail = [];
      this.ORDER_DATE = new Date().toISOString().substr(0, 10);
      this.CUST_CD = '';
    },
  },

  computed: {
    ...mapGetters(['grid_inbEntry', 'grid_inbEntryDetail']),
  }
})
</script>

<style scoped>
  .font-weight-bold {
    font-weight: bold;
  }
</style>