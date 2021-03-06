<template>
  <div>
    <v-tabs
      v-model="tab"
    >
      <v-tab
        v-for="item in items"
        :key="item"
      >
        {{ item }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item
        v-for="item in items"
        :key="item"
      >
        <v-card class="mt-6">
          <v-card-title>
            <h3>{{ $t('label.recap_close_suspect_possible_confirmed_contacts') }}</h3>
          </v-card-title>
          <v-divider class="ma-0" />
          <filter-recap-status
            class="ma-4"
            :params="params"
            :is-loading="isLoading"
            :handle-print="handlePrintPNG"
            :handle-export-excel="onExportExcelCriteria"
            :on-reset="onReset"
          />
          <v-row v-if="item === items[0]">
            <v-col>
              <v-card class="ma-4">
                <div id="printSummaryTable">
                  <table-recap-case
                    :list-recap-case="listSummaryCase"
                    :headers-table="headersStatus"
                    :is-loading="isLoading"
                  />
                </div>
              </v-card>
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col>
              <chart-status-case
                :tab-active="tabActive"
                :list-area="listArea"
                :list-confirmation="listConfirmation"
                :list-probable="listProbable"
                :list-suspect="listSuspect"
                :list-close-contact="listCloseContact"
                :is-loading="isLoading"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>
<script>
import FileSaver from 'file-saver'
import { formatDatetime } from '@/utils/parseDatetime'
import { rolesWidget } from '@/utils/constantVariable'
import { mapGetters } from 'vuex'

export default {
  name: 'RecapStatus',
  data() {
    return {
      tab: null,
      isLoading: false,
      items: [
        'Ringkasan', 'Visualisasi Data'
      ],
      tabActive: 'all',
      dataVisualization: {},
      params: {
        start_date: '',
        criteria: 'CONFIRMATION'
      },
      listSummaryCase: [],
      listArea: [],
      listConfirmation: [],
      listProbable: [],
      listSuspect: [],
      listCloseContact: [],
      headersStatus: [
        { text: 'Total', value: 'active' },
        { text: 'Masih Sakit', value: 'active' },
        { text: 'Isolasi Mandiri', value: 'sick_home' },
        { text: 'Isolasi RS', value: 'sick_hospital' },
        { text: 'Sembuh', value: 'recovered' },
        { text: 'Meninggal', value: 'decease' }
      ]
    }
  },
  computed: {
    ...mapGetters('user', [
      'roles',
      'fullName'
    ])
  },
  watch: {
    params: {
      handler(val) {
        if (this.tab === 0) {
          this.getAgregateSummaryCase()
        } else {
          this.getVisualizationCase()
        }
      },
      deep: true
    }
  },
  mounted() {
    const nameDistrict = rolesWidget['superadmin'].includes(this.roles[0]) ? 'KOTA/KAB' : 'Kecamatan'
    this.headersStatus.unshift(
      { text: '#', value: '_id', sortable: false },
      { text: nameDistrict, value: '_id' }
    )
    this.getVisualizationCase()
    this.getAgregateSummaryCase()
  },
  methods: {
    async getVisualizationCase() {
      this.isLoading = true
      const res = await this.$store.dispatch('statistic/agregateVisualizationCase', this.params)
      if (res.data) {
        this.dataVisualization = res.data[0].visualization
        this.listArea = res.data[0].visualization.map(({ _id }) => _id)
        this.listConfirmation = res.data[0].visualization.map(({ confirmed }) => confirmed)
        this.listProbable = res.data[0].visualization.map(({ probable }) => probable)
        this.listSuspect = res.data[0].visualization.map(({ suspect }) => suspect)
        this.listCloseContact = res.data[0].visualization.map(({ closecontact }) => closecontact)
      }
      this.isLoading = false
    },
    async getAgregateSummaryCase() {
      this.isLoading = true
      const res = await this.$store.dispatch('statistic/agregateSummaryCase', this.params)
      if (res.data) {
        this.listSummaryCase = res.data[0].summary
      }
      this.isLoading = false
    },
    onReset() {
      this.params.start_date = ''
      this.params.criteria = 'CONFIRMATION'
      this.params.address_subdistrict_code = ''
      this.params.address_village_code = ''
      this.getVisualizationCase()
      this.getAgregateSummaryCase()
    },
    async handlePrintPNG() {
      this.isLoading = true
      let el
      if (this.tab === 0) {
        el = document.querySelector('#printSummaryTable')
      } else {
        el = document.querySelector('#horizontalbar-chart')
      }
      const dateNow = Date.now()
      const filename = `${this.$t('label.recap_close_suspect_possible_confirmed_contacts')} - ${formatDatetime(dateNow, 'DD/MM/YYYY HH:mm')} WIB.png`
      const options = {
        type: 'dataURL'
      }
      const output = await this.$html2canvas(el, options)
      await FileSaver.saveAs(output, filename)
      this.isLoading = false
    },
    async onExportExcelCriteria() {
      this.isLoading = true
      const criteria = this.params.criteria
      let criteriaText = this.$t(`label.${criteria.toLowerCase()}`)
      if (criteria === 'CONFIRMATION') {
        criteriaText = this.$t('label.confirmed')
      } else if (criteria === 'CLOSECONTACT') {
        criteriaText = this.$t('label.tight_contact')
      }
      const response = await this.$store.dispatch('statistic/exportCriteria', this.params)
      const dateNow = Date.now()
      const fileName = `${this.$t('label.recap_criteria_data')} ${criteriaText} - ${this.fullName} - ${formatDatetime(dateNow, 'DD/MM/YYYY HH:mm')} WIB.xlsx`
      FileSaver.saveAs(response, fileName)
      this.isLoading = false
    }
  }
}
</script>
