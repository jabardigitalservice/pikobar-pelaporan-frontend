<template>
  <v-navigation-drawer
    v-model="isShowDrawer"
    class="mt-16"
    right
    fixed
    temporary
    overflow
  >
    <v-skeleton-loader
      :loading="isLoading"
      type="list-item-three-line"
    >
      <v-list d-flex dense style="max-height: 90vh;overflow: auto;">
        <v-list-item
          v-for="item in items"
          :key="item.title"
          :style="item.isRead ? '':'background: #C0EDFF 30%;'"
          link
        >
          <notification-item :item="item" :on-read="onRead" />
        </v-list-item>
      </v-list>
    </v-skeleton-loader>
  </v-navigation-drawer>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'NotificationList',
  props: {
    drawerNotif: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      params: {},
      items: [],
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('user', [
      'user_id'
    ]),
    isShowDrawer: {
      set(drawerNotif) {
        this.$emit('update:notifDrawer', drawerNotif)
      },
      get() {
        return this.drawerNotif
      }
    }
  },
  watch: {
    async drawerNotif(value) {
      if (value) {
        await this.getListNotifications()
      }
    }
  },
  methods: {
    async onRead(item) {
      await this.$store.dispatch('notifications/onReadNotification', item._id)
      item.isRead = true
      // caseID
    },
    async getListNotifications() {
      this.isLoading = true
      const response = await this.$store.dispatch('notifications/getListNotifications', this.params)
      this.items = response.data ? response.data.itemsList : []
      this.isLoading = false
    }
  }
}
</script>