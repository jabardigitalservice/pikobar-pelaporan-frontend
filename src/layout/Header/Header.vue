<!-- Header Structure -->
<template>
  <div>
    <v-navigation-drawer
      v-model="primaryDrawer.model"
      :clipped="primaryDrawer.clipped"
      :floating="primaryDrawer.floating"
      :mini-variant.sync="primaryDrawer.mini"
      :permanent="primaryDrawer.type === 'permanent'"
      :temporary="primaryDrawer.type === 'temporary'"
      app
      overflow
    >
      <app-sidebar />
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="primaryDrawer.clipped"
      app
    >
      <div class="title-app">
        <img
          height="50"
          src="../../static/login/logo.svg"
        >
      </div>
      <v-app-bar-nav-icon
        v-if="primaryDrawer.type !== 'permanent'"
        @click.stop="primaryDrawer.model = !primaryDrawer.model"
      />
      <v-spacer />
      <div class="pr-6">
        <v-badge
          color="red"
          :content="notificationTotalUnread"
          :value="notificationTotalUnread"
          overlap
        >
          <v-btn
            fab
            dark
            small
            color="grey"
            @click="handleNotif"
          >
            <v-icon
              medium
              color="darken-2"
            >
              mdi-bell-outline
            </v-icon>
          </v-btn>
        </v-badge>
      </div>
      <div>
        <v-label>{{ fullName }}</v-label>
      </div>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            large
            v-on="on"
          >
            <div class="drop-menu">
              <img width="30px" height="30px" src="https://picsum.photos/200/300?grayscale" class="rounded-circle">
            </div>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click.native="updateUser">
            <v-icon class="mr-3 font-lg text-gray">mdi-account</v-icon>
            <v-list-item-title>{{ $t('label.change_account') }}</v-list-item-title>
          </v-list-item>
          <v-list-item @click.native="changePassword">
            <v-icon class="mr-3 font-lg text-gray">mdi-lock</v-icon>
            <v-list-item-title>{{ $t('label.change_password') }}</v-list-item-title>
          </v-list-item>
          <v-list-item @click.native="logout">
            <v-icon class="mr-3 font-lg text-gray">mdi-logout</v-icon>
            <v-list-item-title>{{ $t('label.log_out') }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
  </div>
</template>

<script>
/* eslint-disable */
import Sidebar from "../Sidebar/Sidebar.vue"
import EventBus from "@/utils/eventBus"
import { mapGetters } from 'vuex'

export default {
  components: {
    appSidebar: Sidebar
  },
  data() {
    return {
      customizerIn: false, // customizer
      drawers: ['Default (no property)', 'Permanent', 'Temporary'],
      footer: {
        inset: false,
      },
      items: [
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me 2' },
      ],
      messages: 10,
      itemsNotifications: [
        {
          title: "Total App Memory",
          icon: "storage"
        },
        {
          title: "Total Memory Used",
          icon: "memory"
        },
        {
          title: "12 Unread Mail",
          icon: "mail"
        },
        {
          title: "Feedback",
          icon: "feedback"
        }
      ],
      languages: [
        { flag: 'us', language: 'en', title: 'English' },
        { flag: 'id', language: 'id', title: 'Indonesia' }
      ]
    };
  },
  computed: {
    ...mapGetters('user', [
      'fullName'
    ]),
    ...mapGetters('notifDrawer', [
      'notifDrawer'
    ]),
    ...mapGetters('notifications', [
      'notificationTotalUnread'
    ]),
    ...mapGetters('primaryDrawer', [
      'primaryDrawer'
    ])
  },
  methods: {
    updateUser() {
      this.$router.push('/user/update')
    },
    changePassword() {
      this.$router.push('/change-password')
    },
    logout() {
      this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    emitDarkMode: function(isDarkMode) {
      EventBus.$emit("darkMode", isDarkMode);
    },
    // change language
    changeLanguage: function(lang) {
      this.$i18n.locale = lang
    },
    async handleNotif() {
      const params = {
        page: 1,
        limit: 30,
      }
      await this.$store.dispatch('notifDrawer/notificationDrawer', !this.notifDrawer)
      await this.$store.dispatch('notifications/getListNotifications', params)
    }
  }
};
</script>
