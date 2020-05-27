<template>
  <v-card
    outlined
  >
    <v-row align="center" justify="space-between">
      <v-col>
        <!--        05 Mei 2020 17:00 WIB-->
        <div class="title ml-4">
          {{ $t('label.patient_recap') }} <span>{{ fullName }} {{ this.$moment().format('DD MMMM YYYY HH:mm') }} WIB</span>
        </div>
      </v-col>
    </v-row>
    <hr class="table-divider">
    <v-row align="center" justify="space-between">
      <v-col>
        <div class="title ml-4">
          <v-row>
            <v-col>
              <range-date-picker
                v-model="dateRange"
                :start-label="$t('label.start_date')"
                :end-label="$t('label.end_date')"
                :place-holder="$t('label.input_date_filters')"
              />
            </v-col>
            <v-col>
              <v-btn
                color="#4f4f4f"
                class="ml-5 btn-reset"
                @click="onReset"
              >
                {{ $t('label.reset') }}
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-col>
      <v-col cols="12" sm="6" class="align-right">
        <v-btn
          class="mr-5"
          style="float: right;"
          color="#b3e2cd"
          :loading="loading"
          @click="handleVisualReport"
        >
          <v-icon left>mdi-upload</v-icon>
          {{ $t('label.export_png') }}
        </v-btn>
        <v-btn
          class="mr-5"
          style="float: right;"
          color="#b3e2cd"
          :loading="loading"
          @click="handleExport"
        >
          <v-icon left>mdi-upload</v-icon>
          {{ $t('label.export_xls') }}
        </v-btn>
      </v-col>
    </v-row>
    <div ref="printMe">
      <daily-report-table
        :list="list"
        :table-headers="headers"
        :list-query="listQuery"
      />
    </div>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import FileSaver from 'file-saver'
import { formatDatetime } from '@/utils/parseDatetime'

export default {
  name: 'DailyReport',
  data() {
    return {
      loading: false,
      dateRange: {
        start: '',
        end: ''
      },
      headers: [
        { text: 'KOTA/KAB', value: 'kotkabkec' },
        { text: 'OTG PROSES', value: 'otg_proses' },
        { text: 'OTG SELESAI', value: 'otg_selesai' },
        { text: 'ODP PROSES', value: 'odp_proses' },
        { text: 'ODP SELESAI', value: 'odp_selesai' },
        { text: 'PDP PROSES', value: 'pdp_proses' },
        { text: 'PDP SELESAI', value: 'pdp_selesai' },
        { text: 'POSITIF PROSES', value: 'positif_aktif_proses' },
        { text: 'POSITIF SEMBUH', value: 'positif_sembuh_selesai' },
        { text: 'POSITIF MENINGGAL', value: 'positif_meninggal_selesai' },
        { text: 'GRAND TOTAL', value: 'grand_total' }
      ],
      listQuery: {
        limit: 100,
        min_date: '',
        max_date: ''
      },
      list: []
    }
  },
  computed: {
    ...mapGetters('user', [
      'fullName'
    ])
  },
  watch: {
    'dateRange': {
      handler: function(value) {
        if (Object.keys(this.dateRange.start).length > 0) {
          this.listQuery.min_date = value.start
          this.listQuery.max_date = value.end
        }
        this.handleSearch()
      },
      immediate: true
    }
  },
  async mounted() {
    this.handleSearch()
  },
  methods: {
    async handleSearch() {
      const response = await this.$store.dispatch('statistic/agregateCriteria', this.listQuery)
      this.list = response.data.summary
    },
    async handleExport() {
      this.loading = true
      const response = await this.$store.dispatch('statistic/exportAgregateCriteriaExcel', this.listQuery)
      const dateNow = Date.now()
      const fileName = `${this.$t('label.patient_recap')} ${this.fullName} - ${formatDatetime(dateNow, 'DD/MM/YYYY HH:mm')} WIB.xlsx`
      await FileSaver.saveAs(response, fileName)
      this.loading = false
    },
    async handleVisualReport() {
      this.loading = true
      const el = this.$refs.printMe
      const dateNow = Date.now()
      const filename = `${this.$t('label.patient_recap')} ${this.fullName} - ${formatDatetime(dateNow, 'DD/MM/YYYY HH:mm')} WIB.png`
      const options = {
        type: 'dataURL'
      }
      const output = await this.$html2canvas(el, options)
      await FileSaver.saveAs(output, filename)
      this.loading = false
    },
    onReset() {
      this.dateRange.start = ''
      this.dateRange.end = ''
      this.listQuery.min_date = ''
      this.listQuery.max_date = ''
      this.handleSearch()
    }
  }
}
</script>

<style scoped>
  .btn-reset {
    min-width: 37px!important;
    height: 46px !important;
    color: white !important;
  }
</style>