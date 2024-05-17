<template>
  <v-app>
    <v-container style="margin-left: 248px;"> 
    <v-row>
      <v-col cols="4">
        <v-text-field
          outlined
          ref="scan"
          v-model="barcodeScan"
          label="바코드 스캔"
          hint="작업번호 스캔 후 상품코드를 스캔하세요"
          style="font-size: 30px;"
          @keyup.enter="doSearchValid"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
    <v-col cols="2">
    </v-col>
    <v-col>
      <v-btn @click="doReset" class="font-weight-bold" style="float: right;">초기화</v-btn>
      <v-btn @click="doConfirm" class="font-weight-bold" style="float: right; background-color: green; color: white;">확정</v-btn>
      <v-btn @click="doInspectionCancel" class="font-weight-bold" style="float: right; background-color: black;; color: white;">취소</v-btn>
      <v-btn @click="doInspection" class="font-weight-bold" style="float: right; background-color: red; color: white;">검수완료</v-btn>
      <v-btn @click="doSearchValid" class="font-weight-bold" style="float: right;">조회</v-btn> 
    </v-col>
    </v-row>

    <v-data-table :headers="headers1"
                  style="margin-top: 34px;" 
                  :items="grid_outInspection"
                  show-select
                  :single-select="true"
                  item-key="TRANS_NO"
                  :hide-default-footer="true"
                  no-data-text="조회된 데이터가 없습니다."
                  @click:row="doSearchDetail"
                  v-model="selectedItemsM"
                  class="font-weight-bold"
                  dense
    ></v-data-table>

    <v-data-table :headers="headers2"
                  style="margin-top: 150px;" 
                  show-select
                  :single-select="singleSelect"
                  item-key="LINE_NO"
                  :items="grid_outInspectionDetail"
                  no-data-text="조회된 데이터가 없습니다."
                  :items-per-page="viewCount"
                  v-model="selectedItemsD"
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

  mounted() {
    this.$refs.scan.focus();
  },

  data() {
    return {
      headers1: [
          { text: '예정일자', value: 'ORDER_DATE' },
          { text: '작업번호', value: 'TRANS_NO' },
          { text: '확정유무', value: 'CONFIRM_YN' },
        ],

      headers2: [
          { text: '검수유무', value: 'INSPECTION_YN', align: 'center'},
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
          { text: '스캔수량', value: 'SCAN_QTY', align: 'right' },
        ],
      
        menu: false,
        barcodeScan: '',
        selectedItemsM: [],
        selectedItemsD: [],
        scanInspectionItem: [],
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
    ...mapActions(['selectOutInspection', 
                   'selectOutInspectionDetail', 
                   'sessionInfo', 
                   'doOutEntry', 
                   'outInspection', 
                   'outInspectionCancel', 
                   'outConfirm', 
                   'selectOutConfirmValid',]),


    async doSearchDetail(event, { item } ) {
      
      const data = { TRANS_NO: item['TRANS_NO'] };

      await this.selectOutInspectionDetail(data);

      this.barcodeScan = '';
      this.$refs.scan.focus();
    },

    async doInspection() {

      if(this.selectedItemsD.length === 0) {
        alert("처리할 대상이 없습니다.");
        return;
      }

      for(const item of this.selectedItemsD) {
        if(item['INSPECTION_YN'] === 'Y') {
          alert("이미 검수완료된 상품입니다.");
          return;
        }
      }

      if(confirm("검수완료 하시겠습니까?")) {
        await this.outInspection(this.selectedItemsD);

       for(var i=0; i<this.$store.state.grid_outInspectionDetail.length; i++) {
        for(var j=0; j<this.selectedItemsD.length; j++) {

          if(this.$store.state.grid_outInspectionDetail[i]['LINE_NO'] === this.selectedItemsD[j]['LINE_NO']) {
            this.$store.state.grid_outInspectionDetail[i]['INSPECTION_YN'] = 'Y';
          }
        }
      }
      }

    },

    async doInspectionCancel() {

      if(this.selectedItemsD.length === 0) {
        alert("처리할 대상이 없습니다.");
        return;
      }

      for(const item of this.selectedItemsD) {
        if(item['INSPECTION_YN'] === 'N') {
          alert("검수되지않은 상품입니다.");
          return;
        }
      }

      for(const item of this.$store.state.grid_outInspection) {
        if(item['TRANS_NO'] === this.selectedItemsD[0]['TRANS_NO'] && item['CONFIRM_YN'] === '확정') {
          alert("이미 확정된 주문입니다.");
          return;
        }
      }

      if(confirm("검수취소 하시겠습니까?")) {
        await this.outInspectionCancel(this.selectedItemsD);
      
        for(var i=0; i<this.$store.state.grid_outInspectionDetail.length; i++) {
         for(var j=0; j<this.selectedItemsD.length; j++) {

          if(this.$store.state.grid_outInspectionDetail[i]['LINE_NO'] === this.selectedItemsD[j]['LINE_NO']) {
            this.$store.state.grid_outInspectionDetail[i]['INSPECTION_YN'] = 'N';
            this.$store.state.grid_outInspectionDetail[i]['SCAN_QTY'] = '0';
          }
        }
      }
      }

    },

    async doConfirm() {
      if(this.selectedItemsM.length === 0) {
        alert("처리할 대상이 없습니다.");
        return;
      }

      if(this.selectedItemsM[0]['CONFIRM_YN'] === '확정') {
        alert("이미 확정된 주문입니다.");
        return;
      }

      if(confirm("확정하시겠습니까?")) {

        const result = await this.selectOutConfirmValid({ TRANS_NO: this.selectedItemsM[0]['TRANS_NO'] });
        
        for(const item of result) {
          if(item['INSPECTION_YN'] === 'N') {
            alert("검수가 완료되지 않았습니다.");
            return;
          }
        }

        await this.outConfirm({ TRANS_NO: this.selectedItemsM[0]['TRANS_NO'] });

        for(let i=0; i<this.$store.state.grid_outInspection.length; i++) {
          
          if(this.$store.state.grid_outInspection[i]['TRANS_NO'] === this.selectedItemsM[0]['TRANS_NO']) {

            this.$store.state.grid_outInspection[i]['CONFIRM_YN'] = '확정';
          }
        }
      }

    },

    async doSearchValid() {

      if(this.barcodeScan === '') {
        alert("바코드는 필수입니다.");
        return;
      }

      const data = {};

      if(this.barcodeScan.startsWith('O90')) {
        data['TRANS_NO'] = this.barcodeScan;

        await this.selectOutInspection(data);

        this.$store.state.grid_outInspectionDetail = [];
      }

      else {
        if(this.$store.state.grid_outInspection.length === 0) {
          alert("작업번호를 먼저 스캔하세요.");
          return;
        }
        else if(this.$store.state.grid_outInspection.length === 1 && this.$store.state.grid_outInspectionDetail.length === 0) {
          alert("상품정보를 먼저 조회하세요.");
          return;
        }

        for(const item of this.$store.state.grid_outInspectionDetail) {
          if(item['ITEM_CD'] === this.barcodeScan) {

            if(Number(item['ORDER_QTY']) === Number(item['SCAN_QTY'])) {

              if(item['INSPECTION_YN'] === 'Y') {
                alert("이미 검수완료된 상품입니다.");
                return;
              }

              if(confirm("예정수량과 스캔수량이 같습니다. 검수완료 하시겠습니까?")) {

                  this.scanInspectionItem.push({ TRANS_NO: item['TRANS_NO'], LINE_NO: item['LINE_NO'] });
                  this.scanInspection();
              }
 
            }
            else {
              item['SCAN_QTY']++;
            }
            break;
          }
        }
 
      }
      
    },

    async scanInspection() {

      await this.outInspection(this.scanInspectionItem);

      for(const item of this.$store.state.grid_outInspectionDetail) {

        if(Number(item['LINE_NO']) === Number(this.scanInspectionItem[0]['LINE_NO'])) {
          item['INSPECTION_YN'] = 'Y';
          this.scanInspectionItem = [];
          break;
        }
      }

    },

    doReset() {
      this.$store.state.grid_outInspection = [];
      this.$store.state.grid_outInspectionDetail = [];
      this.barcodeScan = '';
      this.$refs.scan.focus();
    },
  },

  computed: {
    ...mapGetters(['grid_outInspection', 'grid_outInspectionDetail']),
  }
})
</script>

<style scoped>
</style>