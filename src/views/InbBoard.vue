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
          :rules="custCdRequired"
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
            label="입고예정일자"
            dense
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        
        <v-date-picker v-model="ORDER_DATE" @input="menu=false"></v-date-picker>
      </v-menu>
      </v-col>
      <v-col cols="2">
        <v-select
          outlined
          v-model="TRANS_STATUS_FILE"
          label="파일처리상태"
          :items="selectTransStatusFile"
          item-text="name"
          dense
          item-value="value"
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-text-field ref="uploadFile" 
                      append-outer-icon="mdi-magnify" 
                      @click:append-outer="doUploadSearch({ORDER_DATE, FILE_NM})"
                      outlined label="업로드파일명" 
                      dense
                      v-model="FILE_NM" 
                      style="max-width: 300px;"></v-text-field>
      </v-col>
    </v-row>

    <v-row>
    <v-col cols="2">
    <v-text-field label="상품 검색" v-model="search" style="max-width: 300px;"></v-text-field>
    </v-col>
    <v-col>
      <v-btn @click="doReset" class="font-weight-bold" style="float: right;">초기화</v-btn>
      <v-btn @click="excelDownload" class="font-weight-bold" style="float: right; background-color: green; color: white;">액셀양식</v-btn>
      <v-btn @click="doPrint" class="font-weight-bold" style="float: right; background-color: black; color: white;">출력</v-btn>
      <v-btn @click="doUpload" class="font-weight-bold" style="float: right; background-color: black; color: white;">업로드</v-btn>
      <v-btn @click="doGenerate" class="font-weight-bold" style="float: right; background-color: red; color: white;">생성</v-btn>
      <v-btn @click="doSearchValid" class="font-weight-bold" style="float: right;">조회</v-btn> 
    </v-col>
    </v-row>
    <v-data-table :headers="headers"
                  :items="grid_inbOrder"
                  :search="search"
                  no-data-text="조회된 데이터가 없습니다."
                  :items-per-page="viewCount"
                  :footer-props="{
                    'items-per-page-text': '페이지 별 데이터 행 수',
                     pageText: '총 {2}개 항목 중 {0}-{1}',
                  }"
                  dense
    ></v-data-table>
  <input style="display: none;" ref="upload" type="file" @change="readFile" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
  </v-container>

  <v-container v-if="uploadModal">
    <v-overlay>
      <v-btn @click="closeModal" class="close" style="background-color: red;">X</v-btn>
      <v-data-table :headers="modalHeader" light style="width: 500px;"
                  :items="modalItem"
                  no-data-text="조회된 데이터가 없습니다."
                  :hide-default-footer="true"
                  @dblclick:row="chooseFile"
                  dense
    ></v-data-table>
    </v-overlay>
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

  data() {
    return {
      headers: [
          { text: '라인번호', value: 'LINE_NO', align: 'center' },
          { text: '처리상태', value: 'TRANS_STATUS_FILE' },
          { text: '에러메세지', value: 'ERROR_MSG'},
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
      
        search: '',
        menu: false,
        viewCount: 15,
        ORDER_DATE: new Date().toISOString().substr(0, 10),
        TRANS_STATUS_FILE: '',
        CUST_CD: '',
        FILE_NM: '',

        isModal: false,

        selectTransStatusFile: [
          { name: '', value: '' },
          { name: '생성전', value: '생성전' },
          { name: '생성완료', value: '생성완료' },
          { name: '에러', value: '에러' },
        ],
        selectCustCd: [
          { name: '', value: '' },
          { name: '카카오', value: '카카오' },
          { name: '배민', value: '배민' },
        ],
        custCdRequired: [
        v => !!v || '고객사 항목은 필수 선택 사항입니다.'
        ],



        //modal
        
        modalHeader: [
          { text: '예정일자', value: 'ORDER_DATE' },
          { text: '파일이름', value: 'FILE_NM' },
          { text: '생성자', value: 'CREATE_ON' },
        ],

        modalItem: [],


        // excelDownload
        visibleHeadProps: [],
        instance: undefined, 
        excelList: [
          { blank: '' }, 
        ], 
        //https://string.tistory.com/71
        header: [
          { key:'blank', name: 'CUST_CD' },
          { key:'blank', name: 'ITEM_CD' },
          { key:'blank', name: 'ITEM_CD_CUST' },
          { key:'blank', name: 'ITEM_NM' },
          { key:'blank', name: 'OPT_SIZE' },
          { key:'blank', name: 'OPT_COLOR' },
          { key:'blank', name: 'ORDER_QTY' },
        ]
    }
  },

  methods: {
    ...mapActions(['doSearch', 'sessionInfo', 'selectUploadFile', 'insertUploadFile', 'inbGenerateU']),

excelDownload() {
  let options = {
    header: this.header,
    headProps: 'header'
  };
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
  XLSX.writeFile(wb, '입고예정업로드.xlsx');

},

    async doGenerate() {

      if(this.$store.state.grid_inbOrder.length === 0) {
        alert("업로드는 필수입니다.");
        return;
      }

      if(this.$store.state.grid_inbOrder[0]['TRANS_STATUS_FILE'] === '생성완료') {
        alert("이미 생성되었습니다.");
        return;
      }

      const data = {
        FILE_NM: this.$store.state.grid_inbOrder[0]['FILE_NM'],
        ORDER_NO_CUST: this.$store.state.grid_inbOrder[0]['ORDER_NO_CUST'],
      }

      await this.inbGenerateU(data);

        
      for(const item of this.$store.state.grid_inbOrder) {
          item['TRANS_STATUS_FILE'] = '생성완료';
        }
    },

    doSearchValid() {

      if(this.FILE_NM === '') {
        alert("업로드 파일명은 필수입니다.");
        return;
      }

      const data = {
        ORDER_DATE: this.ORDER_DATE.replaceAll('-', ''), 
        TRANS_STATUS_FILE: this.TRANS_STATUS_FILE, 
        CUST_CD: this.CUST_CD, 
        FILE_NM: this.FILE_NM,
      };
      this.doSearch(data);
    },

    closeModal() {
      this.isModal = false;
    },

    doUpload() {
      if(this.ORDER_DATE === '') {
        alert('입고예정일자는 필수입니다.');
        return;
      }
      this.$refs.upload.click();
    },

    async doUploadSearch(data) {
      if(this.ORDER_DATE === '') {
        alert('입고예정일자는 필수입니다.');
        return;
      }
      data['ORDER_DATE'] = data['ORDER_DATE'].replaceAll('-', '');
      this.modalItem = [];

      const result = await this.selectUploadFile(data);

      this.isModal = true;

      for(const item of result) {
        const obj = {
          CREATE_ON: item['CREATE_ON'],
          ORDER_DATE: item['ORDER_DATE'],
          FILE_NM: item['FILE_NM'],
        }

        this.modalItem.push(obj);
      }
      
    },

    chooseFile (event, { item } ) {
      this.FILE_NM = item['FILE_NM'];
      this.isModal = false;
    },
    
    readFile(event) {

    const file = event.target.files[0];
    this.FILE_NM = file['name'];
    const reader = new FileReader();

    reader.onload = e => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // 첫 번째 시트를 가져옴 (헤더)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      // 셀 데이터를 파싱하여 출력
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const listMap = [];
      
      for(const i of jsonData) {
        listMap.push({});
      }

      for(let i=0; i<jsonData.length; i++) {
        for(let j=0; j<jsonData[0].length; j++) {
          const header = jsonData[0][j]
          listMap[i][header] = jsonData[i][j];
        }
      }

      listMap.splice(0, 1); //헤더 제거

      for(let i=0; i<listMap.length; i++) {
        listMap[i]['FILE_NM'] = file['name'];
        listMap[i]['ORDER_DATE'] = this.ORDER_DATE.replaceAll('-', '');
        listMap[i]['CREATE_ON'] = this.$store.state.session['id'];
      } 
      
      this.uploadMiddleWare(listMap);

    };

    reader.readAsArrayBuffer(file);

    },

    async uploadMiddleWare(listMap) {

      await this.insertUploadFile(listMap);
      await this.doSearchValid();
    },


    doReset() {
      this.$store.state.grid_inbOrder = [];
      this.search='';
      this.ORDER_DATE = new Date().toISOString().substr(0, 10);
      this.TRANS_STATUS_FILE = '';
      this.CUST_CD = '';
      this.FILE_NM = '';
    },
  },

  computed: {
    ...mapGetters(['grid_inbOrder']),

    uploadModal() {
      return this.isModal;
    }
  }
})
</script>

<style scoped>
  .close {
    float: right; 
  }

  .close:hover {
    background-color: white;
    color: black;
  }
</style>