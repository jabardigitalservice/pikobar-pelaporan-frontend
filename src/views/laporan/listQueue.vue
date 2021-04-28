<template>
  <div>
    <v-card
      outlined
      class="mt-2"
    >
      <v-card-title class="pb-0">
        {{ $t('route.case_list_export_history') }}
        <v-spacer />
      </v-card-title>
      <v-divider />
      <v-row justify="center">
        <v-col cols="12" md="4" sm="4">
          <v-text-field
            v-model="listQuery.search"
            solo
            :label="$t('label.search')"
            prepend-inner-icon="search"
            class="ml-4"
          />
        </v-col>
        <v-spacer />
        <v-col cols="12" md="3" sm="3">
          <v-select
            v-model="listQuery.status"
            :items="queueStatusLabel"
            :label="$t('label.all_status')"
            item-value="value"
            item-text="label"
            solo
          />
        </v-col>
        <v-col cols="12" md="3" sm="3" :class="{'mr-4': $vuetify.breakpoint. mdAndUp}">
          <input-date-picker
            :format-date="formatDate"
            :label="$t('label.choose_download_date')"
            :date-value="listQuery.date"
            :value-date.sync="listQuery.date"
            @changeDate="listQuery.date = $event"
          />
        </v-col>
      </v-row>
      <v-row>
        <table-queue
          :is-loading="isLoading"
          :list-query="listQuery"
          :list-queue="queueList"
        />
      </v-row>
    </v-card>
    <pagination
      :total="totalPages"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      :on-next="onNext"
    />
  </div>
</template>
<script>
import { queueStatusLabel } from '@/utils/constantOption'

export default {
  name: 'Queue',
  data() {
    return {
      formatDate: 'YYYY-MM-DD',
      queueList: [],
      isLoading: false,
      totalPages: 0,
      showFilter: false,
      queueStatusLabel: queueStatusLabel,
      listQuery: {
        search: '',
        status: '',
        date: '',
        page: 1,
        limit: 30
      }
    }
  },
  watch: {
    'listQuery': {
      handler: function(value) {
        if (value.search.length >= 2) {
          this.listQuery.page = 1
          this.getListQueue()
        } else if (value.search.length === 0) {
          this.listQuery.page = 1
          this.getListQueue()
        } else {
          this.getListQueue()
        }
      },
      deep: true
    }
  },
  async mounted() {
    await this.getListQueue()
  },
  methods: {
    async getListQueue() {
      this.isLoading = true
      const resp = await this.$store.dispatch('exportReports/getListQueue', this.listQuery)
      this.queueList = resp?.data?.history || []
      this.totalPages = resp?.data?._meta.totalPages || 0
      this.isLoading = false
    },
    async onNext() {
      await this.getListQueue()
    }
  }
}
</script>
