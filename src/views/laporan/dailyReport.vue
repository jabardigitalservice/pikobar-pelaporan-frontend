<template>
  <div>
    <h3><strong>Laporan Harian Covid-19</strong></h3>
    <v-card
      class="warning-background"
      outlined
      min-height="75px"
    >
      <div
        class="white--text ml-8 mt-6"
      >
        <div class="font-weight-bold">
          {{ $t('label.last_update') }}: 7 Juli 2021 pukul 08:51 | {{ $t('label.please_wait_and_refresh_this_page_to_update_the_data') }}
        </div>
      </div>
    </v-card>
    <v-row>
      <v-col v-if="rolesWidget['superadmin'].includes(roles[0])" cols="5">
        <v-autocomplete
          v-model="listQuery.address_district_code"
          :items="listDistrictCity"
          :label="$t('label.search_author_district_health_office')"
          prepend-inner-icon="search"
          item-value="kota_kode"
          item-text="kota_nama"
          single-line
          solo
          autocomplete
        />
      </v-col>
      <v-col>
        <input-date-picker
          :format-date="formatDate"
          :label="$t('label.choose_date')"
          :date-value="listQuery.date"
          :value-date.sync="listQuery.date"
          @changeDate="listQuery.date = $event"
        />
      </v-col>
      <v-col>
        <v-btn
          color="#27ae60"
          class="ml-5 btn-reset"
          @click="handleSearch"
        >
          {{ $t('label.look_for_it') }}
        </v-btn>
        <v-btn
          color="#4f4f4f"
          class="ml-5 btn-reset"
          @click="onReset"
        >
          {{ $t('label.reset') }}
        </v-btn>
      </v-col>
    </v-row>
    <div>
      <v-card
        outlined
      >
        <v-row>
          <v-col cols="8" sm="8">
            <div class="title ml-3">
              {{ $t('label.patient_recap') }} <span>{{ fullName }} {{ reportingDate }}</span>
            </div>
          </v-col>
          <v-col cols="12" sm="2" class="align-right">
            <v-btn
              class="mr-5"
              style="float: right;min-width:90px;"
              outlined
              color="#27ae60"
              :loading="loading"
              @click="handleVisualReport"
            >
              <v-icon left>mdi-upload</v-icon>
              {{ $t('label.export_png') }}
            </v-btn>
          </v-col>
          <v-col cols="12" sm="2" class="align-right">
            <v-btn
              class="mr-5"
              style="float: right;min-width:90px;"
              outlined
              color="#27ae60"
              :loading="loading"
              @click="handleExport"
            >
              <v-icon left>mdi-upload</v-icon>
              {{ $t('label.export_xls') }}
            </v-btn>
          </v-col>
        </v-row>
        <hr class="table-divider">
        <div ref="printMe">
          <daily-report-table-revamp :data="data" :date="listQuery.date" />
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FileSaver from 'file-saver'
import { formatDatetime } from '@/utils/parseDatetime'
import { rolesWidget } from '@/utils/constantVariable'

export default {
  name: 'DailyReport',
  data() {
    return {
      rolesWidget,
      formatDate: 'YYYY/MM/DD',
      reportingDate: this.$moment().format('DD MMMM YYYY'),
      loading: false,
      headers: [
        { text: this.$t('label.otg_procces').toUpperCase(), value: 'otg_proses' },
        { text: this.$t('label.otg_done').toUpperCase(), value: 'otg_selesai' },
        { text: this.$t('label.odp_procces').toUpperCase(), value: 'odp_proses' },
        { text: this.$t('label.odp_done').toUpperCase(), value: 'odp_selesai' },
        { text: this.$t('label.pdp_procces').toUpperCase(), value: 'pdp_proses' },
        { text: this.$t('label.pdp_done').toUpperCase(), value: 'pdp_selesai' },
        { text: this.$t('label.positif_procces').toUpperCase(), value: 'positif_aktif_proses' },
        { text: this.$t('label.positive_cured').toUpperCase(), value: 'positif_sembuh_selesai' },
        { text: this.$t('label.positif_dead').toUpperCase(), value: 'positif_meninggal_selesai' },
        { text: this.$t('label.grand_total').toUpperCase(), value: 'grand_total' }
      ],
      listQuery: {
        address_district_code: '',
        date: ''
      },
      data: null
    }
  },
  computed: {
    ...mapGetters('user', [
      'roles',
      'fullName'
    ]),
    ...mapGetters('region', [
      'listDistrictCity'
    ])
  },
  watch: {
    'listQuery.date': {
      handler: function(value) {
        if (value !== undefined && value.length > 0) {
          this.reportingDate = this.$moment(value).format('DD MMMM YYYY')
          this.handleSearch()
        } else {
          this.reportingDate = this.$moment().format('DD MMMM YYYY')
        }
      },
      immediate: true
    }
  },
  async mounted() {
    if (this.roles[0] === 'dinkeskota') {
      this.headers.unshift({ text: this.$t('label.subdistrict').toUpperCase(), value: 'kotkabkec' })
    } else {
      this.headers.unshift({ text: this.$t('label.select_district').toUpperCase(), value: 'kotkabkec' })
    }
    this.handleSearch()
    await this.$store.dispatch('region/getListDistrictCity')
  },
  methods: {
    async handleSearch() {
      const response = await this.$store.dispatch('reports/getDailyReport', this.listQuery)
      if (response) {
        this.data = response
      }
    },
    async handleExport() {
      this.loading = true
      const response = await this.$store.dispatch('exportReports/exportExcelDailyReport', this.listQuery)
      let reportingDate
      if (this.listQuery.date.length > 1) {
        reportingDate = this.$moment(this.listQuery.date).format('YYYY/MM/DD')
      } else {
        reportingDate = this.$moment().format('YYYY/MM/DD')
      }
      const fileName = `${this.fullName} - ${reportingDate} - ${this.fullName}.xlsx`
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
      this.listQuery.address_district_code = ''
      this.listQuery.date = ''
      this.handleSearch()
    }
  }
}
</script>

<style scoped>
  .btn-reset {
    min-width: 120px!important;
    height: 46px !important;
    color: white !important;
  }
</style>
