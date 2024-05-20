<template>
  <v-app>
    <v-container style="margin-left: 248px;"> 
    <v-row>
      <v-col cols="4">
        <v-text-field
          outlined
          ref="scan"
          v-model="ITEM_CD"
          label="상품코드 스캔"
          hint="상품코드를 스캔하세요"
          @keyup.enter="selectStock({ITEM_CD})"
          >
        </v-text-field>
      </v-col>

      <v-col cols="3">
        <v-text-field outlined 
                      label="A-00-00-01" 
                      disabled
                      filled
                      style="max-width: 300px; font-weight: bold;"></v-text-field>
      </v-col>
    </v-row>

    <v-row>
    <v-col cols="2">
    <v-text-field label="상품 검색" v-model="search" style="max-width: 300px;"></v-text-field>
    </v-col>
    <v-col>
      <v-btn @click="doReset" class="font-weight-bold" style="float: right;">초기화</v-btn>
      <v-btn @click="excelDownload" class="font-weight-bold" style="float: right; background-color: green; color: white;">다운로드</v-btn>
      <v-btn @click="doPrint" class="font-weight-bold" style="float: right; background-color: black; color: white;">출력</v-btn>
      <v-btn @click="selectStock({ITEM_CD})" class="font-weight-bold" style="float: right;">조회</v-btn> 
    </v-col>
    </v-row>
    <v-data-table :headers="headers"
                  :items="grid_stock"
                  :search="search"
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

<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.15.5/xlsx.full.min.js"></script>
<script>
import { mapActions, mapGetters } from 'vuex'
import { SessionValid } from '@/mixin/SessionValid.js'
import * as XLSX from 'xlsx';

export default ({
  mixins: [SessionValid],

  mounted() {
    this.$refs.scan.focus();
  },

  data() {
    return {
      headers: [
          { text: '라인번호', value: 'LINE_NO', align: 'center' },
          { text: '존', value: 'ZONE_CD' },
          { text: '로케이션', value: 'LOC_CD' },
          { text: '고객사', value: 'CUST_CD' },
          { text: '상품코드', value: 'ITEM_CD' },
          { text: '고객사상품코드', value: 'ITEM_CD_CUST' },
          { text: '상품명', value: 'ITEM_NM' },
          { text: '수량', value: 'ORDER_QTY', align: 'right' },
          { text: '옵션표기명', value: 'OPT_DISPLAY' },
          { text: '사이즈', value: 'OPT_SIZE' },
          { text: '색상', value: 'OPT_COLOR' },
          { text: '스타일', value: 'OPT_STYLE'},
        ],
      
        search: '',
        viewCount: 15,
        menu: false,
        ITEM_CD: '',

        // excelDownload
        visibleHeadProps: [],
        instance: undefined, 
        excelList: [],

        //https://string.tistory.com/71
        header: [
          { key:'LINE_NO', name: '라인번호' },
          { key:'ZONE_CD', name: '존' },
          { key:'LOC_CD', name: '로케이션' },
          { key:'CUST_CD', name: '고객사' },
          { key:'ITEM_CD', name: '상품코드' },
          { key:'ITEM_CD_CUST', name: '고객사상품코드' },
          { key:'ITEM_NM', name: '상품명' },
          { key:'ORDER_QTY', name: '수량' },
          { key:'OPT_DISPLAY', name: '옵션명' },
          { key:'OPT_SIZE', name: '사이즈' },
          { key:'OPT_COLOR', name: '색상' },
          { key:'OPT_STYLE', name: '스타일' },
        ],
    }
  },

  methods: {
    ...mapActions(['sessionInfo', 'selectStock']),

excelDownload() {

  if(this.$store.state.grid_stock.length === 0) {
    alert("처리할 대상이 없습니다.");
    return;
  }

  let options = {
    header: this.header,
    headProps: 'header'
  };

  for(let i=0; i<this.$store.state.grid_stock.length; i++) {

    let item = this.$store.state.grid_stock

    this.excelList.push({

      LINE_NO: item[i]['LINE_NO'] !== undefined? item[i]['LINE_NO'] : '',
      ZONE_CD: item[i]['ZONE_CD'] !== undefined? item[i]['ZONE_CD'] : '',
      LOC_CD: item[i]['LOC_CD'] !== undefined? item[i]['LOC_CD'] : '',
      CUST_CD: item[i]['CUST_CD'] !== undefined? item[i]['CUST_CD'] : '',
      ITEM_CD: item[i]['ITEM_CD'] !== undefined? item[i]['ITEM_CD'] : '',
      ITEM_CD_CUST: item[i]['ITEM_CD_CUST'] !== undefined? item[i]['ITEM_CD_CUST'] : '',
      ITEM_NM: item[i]['ITEM_NM'] !== undefined? item[i]['ITEM_NM'] : '',
      ORDER_QTY: item[i]['ORDER_QTY'] !== undefined? item[i]['ORDER_QTY'] : '',
      OPT_DISPLAY: item[i]['OPT_DISPLAY'] !== undefined? item[i]['OPT_DISPLAY'] : '',
      OPT_SIZE: item[i]['OPT_SIZE'] !== undefined? item[i]['OPT_SIZE'] : '',
      OPT_COLOR: item[i]['OPT_COLOR'] !== undefined? item[i]['OPT_COLOR'] : '',
      OPT_STYLE: item[i]['OPT_STYLE'] !== undefined? item[i]['OPT_STYLE'] : '',
      
     });
  }
  
  
  this.excelExport(this.excelList, options);
},

excelExport(data, options) {
  let headProps = [];

  if (Array.isArray(options.headProps)) {
    headProps = options.headProps;
  } 
  else if (options.headProps === 'header') {
    for (const h of this.header) {
      headProps.push(h.key);
    }
  } 
  else {
    headProps = Object.keys(data[0]);
  }

  this.visibleHeadProps = headProps;
  this.instance = document.createElement('table');

  let header = [];

  if (!Array.isArray(this.header[0])) {
    header.push(this.header);
  } 
  else {
    header = this.header;
  }

  let thead = document.createElement('thead');

  for (let row of header) {
    let tr = document.createElement('tr');

    for (let h of row) {

      let rowspan = h.rowspan || '1';
      let colspan = h.colspan || '1';
      let th = document.createElement('th');
      th.setAttribute('rowspan', rowspan);
      th.setAttribute('colspan', colspan);
      th.innerText = h.name;
      tr.appendChild(th);
    }
    thead.appendChild(tr);
  }
  this.instance.appendChild(thead);

  let tbody = document.createElement('tbody');

  for (let row of data) {
    let tr = document.createElement('tr');

    for (let cellkey of this.visibleHeadProps) {
      let td = document.createElement('td');

      td.innerText = row[cellkey];
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  this.instance.appendChild(tbody);

  let config = { raw: true, type: 'string' };
  let ws = XLSX.utils.table_to_sheet(this.instance, config);
  let wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, `현재고.xlsx`);

},

    doReset() {
      this.$store.state.grid_stock = [];
      this.search='';
      this.ITEM_CD = '';

      this.$refs.scan.focus();
    },

    doPrint() {
      try {

        window.open(`${process.env.VUE_APP_API_URL}stockPrint`);

      } catch(error) {
          alert(`에러발생 : ${error}`);
      }
    },
  },

  computed: {
    ...mapGetters(['grid_stock']),
  }
})
</script>

<style scoped>
</style>