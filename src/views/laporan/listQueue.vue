<template>
  <div>
    <v-card
      outlined
      class="mt-2"
    >
      <v-card-title class="pb-0">
        {{ $t('route.queue') }}
        <v-spacer />
      </v-card-title>
      <v-divider />
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

export default {
  name: 'Queue',
  data() {
    return {
      queueList: [],
      isLoading: false,
      totalPages: 0,
      listQuery: {
        page: 1,
        limit: 30
      }
    }
  },
  watch: {
    'listQuery': {
      handler: function(value) {
        if (value && value.length >= 2) {
          this.listQuery.page = 1
          this.getListQueue()
        } else if (value && value.length === 0) {
          this.listQuery.page = 1
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
