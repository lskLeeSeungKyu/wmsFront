<template>
    <v-navigation-drawer app>
    <profile-template></profile-template>
    <v-list>
      <v-list-group
        v-for="(item, i) in items"
        :key="i"
        v-model="item.active"
        :prepend-icon="item.icon"
        no-action
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title> <!-- v-text="item.title" -->
          </v-list-item-content>
        </template>

        <v-list-item
          v-for="subItem in item.subItems"
          :key="subItem.title"
          :to="subItem.to"
        >
          <v-list-item-content>
            <v-list-item-title>
              <v-icon>mdi-chevron-right</v-icon> <!-- 오른쪽 화살표 아이콘 (small속성가능) --> 
            {{ subItem.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
    </v-navigation-drawer>
</template>

<script>
import ProfileTemplate from './ProfileTemplate'

export default {
  created() {
    
  },

  data () {
    return {
      items: [
        {
          title: '마스터관리',
          active: false,
          //icon: 'mdi-home',
          subItems: [
            {
              title: '사용자',
              to: '/MstUser'
            },
          ]
        },


        {
          title: '입고관리',
          active: false,
          //icon: 'mdi-home',
          subItems: [
            {
              title: '입고예정',
              to: '/InbOrder'
            },
            {
              title: '입고등록',
              to: '/InbEntry'
            },
            {
              title: '입고검수',
              to: '/InbInspection'
            },
          ]
        },


        {
          title: '출고관리',
          active: false,
          //icon: 'mdi-account',
          subItems: [
            {
              title: '출고예정',
              to: '/OutOrder'
            },
            {
              title: '출고등록',
              to: '/OutEntry'
            },
            {
              title: '출고검수',
              to: '/OutInspection'
            },
          ],
        },

        {
          title: '재고관리',
          active: false,
          //icon: 'mdi-account',
          subItems: [
            {
              title: '현재고관리',
              to: '/StkBoard'
            },
          ],
        },

      ],
      
    }
  },

  components: {
    ProfileTemplate,
  }
}
</script>