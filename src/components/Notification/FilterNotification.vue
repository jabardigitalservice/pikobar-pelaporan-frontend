<template>
  <v-row class="px-2">
    <v-col cols="12" md="3" sm="3">
      <search
        :list-query="listQuery"
        :handle-search="onSearch"
      />
    </v-col>
    <v-col cols="12" sm="3">
      <v-select
        v-model="listQuery.eventType"
        :items="statusNotification"
        :label="$t('label.all_category')"
        solo
        item-text="label"
        item-value="value"
      />
    </v-col>
    <v-col cols="12" sm="3">
      <input-date-picker
        :format-date="formatDate"
        :label="$t('label.date_of_beginning')"
        :date-value="listQuery.startDate"
        :value-date.sync="listQuery.startDate"
        @changeDate="listQuery.startDate = $event"
      />
    </v-col>
    <v-col cols="12" sm="1">
      <v-btn
        block
        color="#4f4f4f"
        class="btn-reset"
        @click="onReset"
      >
        {{ $t('label.reset') }}
      </v-btn>
    </v-col>
    <v-col cols="12" sm="2">
      <v-btn
        block
        color="success"
        class="btn-cari"
        @click="onSearch"
      >
        {{ $t('label.look_for_it') }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { statusNotification } from '@/utils/constantOption'
export default {
  name: 'FilterNotification',
  props: {
    listQuery: {
      type: Object,
      default: null
    },
    onSearch: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      formatDate: 'YYYY/MM/DD',
      statusNotification: statusNotification
    }
  },
  methods: {
    onReset() {
      this.listQuery.search = ''
      this.listQuery.eventType = ''
      this.listQuery.startDate = ''
      this.$store.dispatch('notifications/getListNotifications', this.listQuery)
    }
  }
}
</script>
