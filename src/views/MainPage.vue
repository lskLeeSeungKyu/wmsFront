<template>
    <v-container fluid style="width: 80%; margin-left: 258px; margin-top: 82px;">
    <v-textarea @input="toUpperCase" v-model="query" @keyup.enter="execute(query)" outlined label="Query + Enter"></v-textarea>

    <v-text-field v-show="gridShow" label="검색" v-model="search" style="max-width: 300px;"></v-text-field>
    <v-data-table :headers="headers"
                  :items="grid_mainPage"
                  :search="search"
                  no-data-text="조회된 데이터가 없습니다."
                  :items-per-page="viewCount"
                  :footer-props="{
                    'items-per-page-text': '페이지 별 데이터 행 수',
                     pageText: '총 {2}개 항목 중 {0}-{1}',
                  }"
                  :hide-default-footer="hidePageing"
                  dense
    ></v-data-table>
    </v-container>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { SessionValid } from '@/mixin/SessionValid.js'

export default ({
    mixins: [SessionValid],

    data() {
        return {
            query: '',
            viewCount: 15,
            search: '',
            flag: false,
            hide: true,

            headers: [],
        }
    },

    computed: {
         ...mapGetters(['grid_mainPage']),

         gridShow() {
            return this.flag;
         },

         hidePageing() {
            return this.hide;
         }
    },

    methods: {

        toUpperCase() {
            this.query = this.query.toUpperCase();
        },

        async execute(query) {
            await this.mainPageQuery(query);

            if(this.headers.length !== 0) {
                this.headers = [];
            }

           for(const key in this.$store.state.grid_mainPage[0]) {
              this.headers.push(
                 { text: key, value: key }
              );
           }

           if(this.headers.length === 0) {
              this.flag = false;
           }
           else {
              this.hide = false;
              this.flag = true;
           }
        },

        ...mapActions(['mainPageQuery', 'sessionInfo']),
    },

})
</script>