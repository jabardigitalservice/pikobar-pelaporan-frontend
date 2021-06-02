<!-- App Main Structure -->
<template>
  <div>
    <!-- App Header -->
    <app-header />
    <!-- Notif Drawer -->
    <notification-list
      :drawer-notif="isNotif"
      :notif-drawer.sync="isNotif"
    />
    <!-- App Main Content -->
    <v-main>
      <!-- Breadcrumbs -->
      <v-row style="padding: 5px 20px;">
        <breadcrumb />
      </v-row>
      <!-- App Router -->
      <div class="app-container">
        <transition name="fade" mode="out-in">
          <router-view :key="key" />
        </transition>
      </div>
    </v-main>
    <!-- App Back To Top -->
    <vm-back-top style="bottom: 10px;" />
    <dialog-survey :show-dialog="getUserSurvey()" />
  </div>
</template>

<script>
/* eslint-disable */
import Header from "./Header/Header.vue"
import { mapGetters } from 'vuex'
import {
  getUserSurvey
} from '@/utils/cookies'
export default {
  components: {
    appHeader: Header
  },
  data: () => ({
      itemsBreadcrumbs: [
         {
           text: 'Dashboard',
           disabled: false,
           to: '/',
         }
      ],
  }),
  computed: {
    ...mapGetters('notifDrawer', [
      'notifDrawer'
    ]),
    isNotif: {
      set(value) {
        return value
      },
      get() {
        return this.notifDrawer
      }
    },
    key() {
      return this.$route.fullPath
    }
  },
  mounted() {
    //
  },
  methods: {
    getUserSurvey() {
      const isUserSurvey = String(getUserSurvey()) === 'true'
      return !isUserSurvey
    }
  }
};
</script>
<style scoped>
.app-container {
  /* 50= navbar  50  */
  /* min-height: calc(100vh - 50px); */
  padding: 5px 20px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
