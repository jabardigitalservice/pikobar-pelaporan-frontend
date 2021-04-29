<template>
  <div>
    <v-card
      outlined
      class="mt-2"
    >
      <v-card-title class="pb-0">
        {{ $t('label.list_positive_examination_results') }}
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
        <v-col cols="12" md="2" sm="3" :class="{'mr-4': $vuetify.breakpoint. mdAndUp}">
          <v-btn
            color="primary"
            block
          >
            {{ $t('label.filter') }}
            <v-icon v-if="!showFilter">mdi-chevron-right</v-icon>
            <v-icon v-else>mdi-chevron-down</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <table-inspection-report
          :is-loading="isLoading"
          :list-query="listQuery"
          :list-inspection-report="inspectionReportList"
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
  name: 'InspectionReport',
  data() {
    return {
      inspectionReportList: [],
      isLoading: false,
      totalPages: 0,
      showFilter: false,
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
      //   const resp = await this.$store.dispatch('exportReports/getListQueue', this.listQuery)
      //   this.queueList = resp?.data?.history || []
      //   this.totalPages = resp?.data?._meta.totalPages || 0
      this.isLoading = false
    },
    async onNext() {
      await this.getListQueue()
    }
  }
}
</script>
