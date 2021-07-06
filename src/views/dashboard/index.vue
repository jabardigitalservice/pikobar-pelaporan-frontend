<template>
  <v-container
    v-if="display"
    fluid
    grid-list-xl
    py-0
    mb-5
  >
    <v-row>
      <v-col
        cols="12"
        class="pb-0"
      >
        <h3><strong>{{ `${$t('label.dashboard')} ${$t('label.report')}` }}</strong></h3>
      </v-col>
    </v-row>
    <v-row class="mb-3">
      <v-col cols="12">
        <v-card
          class="chart mx-auto"
          outlined
        >
          <v-card-text class="white--text disclaimer">
            {{ $t('label.dashboard_disclaimer') }}
            <a
              class="white--text help"
              @click="handleHelp"
            >
              {{ $t('label.disclaimer_help') }}
            </a>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="8">
        <v-row>
          <v-col
            cols="12"
            md="4"
            sm="12"
            class="pt-0"
          >
            <select-area-district-city
              :disabled-district="disabledDistrict"
              :district-city="districtCity"
              :city-district.sync="districtCity"
              :on-select-district="onSelectDistrict"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
            sm="12"
            class="pt-0"
          >
            <select-area-sub-district
              :sub-district="subDistrict"
              :update-sub-district.sync="subDistrict"
              :code-district="districtCity.kota_kode"
              :district-code.sync="districtCity.kota_kode"
              :on-select-sub-district="onSelectSubDistrict"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
            sm="12"
            class="pt-0"
          >
            <select-area-village
              :village="village"
              :update-village.sync="village"
              :code-sub-district="subDistrict.kecamatan_kode"
              :sub-district-code.sync="subDistrict.kecamatan_kode"
              :on-select-village="onSelectVillage"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col
        cols="12"
        md="2"
        sm="12"
      >
        <v-btn
          block
          color="success"
          class="button"
          @click="onSearch"
        >
          {{ $t('label.look_for_it') }}
        </v-btn>
      </v-col>
      <v-col
        cols="12"
        md="2"
        sm="12"
      >
        <v-btn
          block
          color="grey darken-3"
          class="button white--text"
          @click="onReset"
        >
          {{ $t('label.reset') }}
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        md="3"
        sm="6"
      >
        <statistic-total-confirmed
          :loading="loadingConfirmed"
          :total-confirmed="statistic.confirmed.total"
        />
      </v-col>
      <v-col
        cols="12"
        md="3"
        sm="6"
      >
        <statistic-total-active
          :loading="loadingConfirmed"
          :total-active="statistic.confirmed.active"
        />
      </v-col>
      <v-col
        cols="12"
        md="3"
        sm="6"
      >
        <statistic-total-recovered
          :loading="loadingConfirmed"
          :total-recovered="statistic.confirmed.recovery"
        />
      </v-col>
      <v-col
        cols="12"
        md="3"
        sm="6"
      >
        <statistic-total-death
          :loading="loadingConfirmed"
          :total-death="statistic.confirmed.dead"
        />
      </v-col>
    </v-row>
    <v-row class="mb-3">
      <v-col
        cols="12"
        md="4"
      >
        <statistic-people-without-symptoms
          :loading="loadingNotConfirmed"
          :process="statistic.otg.process"
          :process-percent="statistic.otg.processPercent"
          :done="statistic.otg.done"
          :done-percent="statistic.otg.donePercent"
          :total="statistic.otg.total"
        />
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <statistic-person-under-monitoring
          :loading="loadingNotConfirmed"
          :process="statistic.odp.process"
          :process-percent="statistic.odp.processPercent"
          :done="statistic.odp.done"
          :done-percent="statistic.odp.donePercent"
          :total="statistic.odp.total"
        />
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <statistic-patient-under-investigation
          :loading="loadingNotConfirmed"
          :process="statistic.pdp.process"
          :process-percent="statistic.pdp.processPercent"
          :done="statistic.pdp.done"
          :done-percent="statistic.pdp.donePercent"
          :total="statistic.pdp.total"
        />
      </v-col>
    </v-row>
    <v-divider />
    <v-tabs>
      <v-tab
        :key="'daily'"
        :href="'#tab-daily'"
      >
        {{ $t('label.daily_number') }}
      </v-tab>
      <v-tab
        :key="'cumulative'"
        :href="'#tab-cumulative'"
      >
        {{ $t('label.cumulative') }}
      </v-tab>
      <div class="ml-auto">
        <v-select
          v-model="selectedTimeSeries"
          :items="listTimeSeries"
          item-value="id"
          item-text="name"
          label="Waktu"
          solo
          @change="onSelectTimeSeries"
        />
      </div>
      <v-tab-item
        :key="'daily'"
        :value="'tab-daily'"
      >
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <chart-daily-people-without-symptoms
              :loading="loadingOTG"
              :c-data="statistic.otgDaily"
              :chart-height="250"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <chart-daily-person-under-monitoring
              :loading="loadingODP"
              :c-data="statistic.odpDaily"
              :chart-height="250"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <chart-daily-patient-under-investigation
              :loading="loadingPDP"
              :c-data="statistic.pdpDaily"
              :chart-height="250"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <chart-daily-confirmed
              :loading="loadingPositive"
              :c-data="statistic.positiveDaily"
              :chart-height="250"
            />
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item
        :key="'cumulative'"
        :value="'tab-cumulative'"
      >
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <chart-cumulative-people-without-symptoms
              :loading="loadingOTG"
              :c-data="statistic.otgCumulative"
              :chart-height="250"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <chart-cumulative-person-under-monitoring
              :loading="loadingODP"
              :c-data="statistic.odpCumulative"
              :chart-height="250"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <chart-cumulative-patient-under-investigation
              :loading="loadingPDP"
              :c-data="statistic.pdpCumulative"
              :chart-height="250"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <chart-cumulative-confirmed
              :loading="loadingPositive"
              :c-data="statistic.positiveCumulative"
              :chart-height="250"
            />
          </v-col>
        </v-row>
      </v-tab-item>
    </v-tabs>
    <v-divider />
    <v-row>
      <v-col
        cols="12"
        md="4"
      >
        <chart-gender :list-query="listQuery" />
      </v-col>
      <v-col
        cols="12"
        md="8"
      >
        <chart-age :list-query="listQuery" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  props: {
    districtCode: {
      type: String,
      default: null
    },
    districtName: {
      type: String,
      default: null
    },
    subDistrictCode: {
      type: String,
      default: null
    },
    subDistrictName: {
      type: String,
      default: null
    },
    villageCode: {
      type: String,
      default: null
    },
    villageName: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      loadingConfirmed: true,
      loadingNotConfirmed: true,
      loadingOTG: true,
      loadingODP: true,
      loadingPDP: true,
      loadingPositive: true,
      display: true,
      districtCity: {
        kota_kode: this.districtCode,
        kota_nama: this.districtName
      },
      subDistrict: {
        kecamatan_kode: this.subDistrictCode,
        kecamatan_nama: this.subDistrictName
      },
      village: {
        desa_kode: this.villageCode,
        desa_nama: this.villageName
      },
      disabledDistrict: false,
      filter: {
        isCity: false,
        isDistrict: false,
        isVillage: false,
        city: null,
        district: null,
        village: null
      },
      statistic: {
        confirmed: {
          active: 0,
          recovery: 0,
          dead: 0,
          total: 0
        },
        otg: {
          process: 0,
          processPercent: 0,
          done: 0,
          donePercent: 0,
          total: 0
        },
        odp: {
          process: 0,
          processPercent: 0,
          done: 0,
          donePercent: 0,
          total: 0
        },
        pdp: {
          process: 0,
          processPercent: 0,
          done: 0,
          donePercent: 0,
          total: 0
        },
        otgDaily: {
          label: [],
          process: [],
          done: []
        },
        odpDaily: {
          label: [],
          process: [],
          done: []
        },
        pdpDaily: {
          label: [],
          process: [],
          done: []
        },
        positiveDaily: {
          label: [],
          active: [],
          recovery: [],
          dead: []
        },
        otgCumulative: {
          label: [],
          process: [],
          done: []
        },
        odpCumulative: {
          label: [],
          process: [],
          done: []
        },
        pdpCumulative: {
          label: [],
          process: [],
          done: []
        },
        positiveCumulative: {
          label: [],
          active: [],
          recovery: [],
          dead: []
        },
        gender: {
          male: 0,
          female: 0
        },
        age: {
          male: [],
          female: []
        }
      },
      listQuery: {
        address_district_code: null,
        address_subdistrict_code: null,
        address_village_code: null
      },
      listQueryDate: {
        min_date: null,
        max_date: null
      },
      selectedTimeSeries: 'two_week',
      listTimeSeries: [
        {
          id: 'all',
          name: 'Semua Waktu'
        },
        {
          id: 'one_week',
          name: '1 Minggu Terakhir'
        },
        {
          id: 'two_week',
          name: '2 Minggu Terakhir'
        },
        {
          id: 'one_month',
          name: '1 Bulan Terakhir'
        }
      ]
    }
  },
  computed: {
    ...mapGetters('user', [
      'roles',
      'fullName',
      'district_user',
      'district_name_user'
    ])
  },
  watch: {
    districtCode: (value) => {
      if (value) {
        this.districtCity = {
          kota_kode: value,
          kota_nama: this.districtName
        }
      } else {
        this.clearCity()
      }
    },
    subDistrictCode: (value) => {
      this.subDistrict = {
        kecamatan_kode: value,
        kecamatan_nama: this.subDistrictName
      }
    },
    villageCode: (value) => {
      this.village = {
        desa_kode: value,
        desa_nama: this.villageName
      }
    }
  },
  async beforeMount() {
    if (this.roles[0] === 'faskes') {
      this.display = false
    }

    if (this.roles[0] === 'dinkeskota') {
      this.disabledDistrict = true
      this.filter.isCity = true
      this.filter.city = this.district_user
      this.listQuery.address_district_code = this.district_user
    }

    this.districtCity = {
      kota_kode: this.district_user,
      kota_nama: this.district_name_user
    }

    await this.filterTimeSeries()
    this.getStatisticConfirmed()
    this.getStatisticNotConfirmed()
    this.getStatisticOTG()
    this.getStatisticODP()
    this.getStatisticPDP()
    this.getStatisticPositive()
  },
  beforeDestroy() {
    this.clearCity()
    this.clearDistrict()
    this.clearVillage()
    this.filter = null
  },
  methods: {
    async onSelectDistrict(value) {
      this.districtCity = value
      this.clearDistrict()
      this.clearVillage()
      this.$emit('update:codeDistrict', value?.kota_kode || null)
      this.$emit('update:nameDistrict', value?.kota_nama || null)
    },
    async onSelectSubDistrict(value) {
      this.subDistrict = value
      this.clearVillage()
      this.$emit('update:codeSubDistrict', value?.kecamatan_kode || null)
      this.$emit('update:nameSubDistrict', value?.kecamatan_nama || null)
    },
    async onSelectVillage(value) {
      this.village = value
      this.$emit('update:codeVillage', value?.desa_kode || null)
      this.$emit('update:nameVillage', value?.desa_nama || null)
    },
    async onReset() {
      if (this.roles[0] === 'dinkesprov' || this.roles[0] === 'superadmin') {
        this.clearCity()
        this.filter.isCity = false
        this.filter.city = null
      }
      this.clearDistrict()
      this.clearVillage()

      this.filter.isDistrict = false
      this.filter.isVillage = false
      this.filter.district = null
      this.filter.village = null

      await this.filterTimeSeries()
      this.getStatisticConfirmed()
      this.getStatisticNotConfirmed()
      this.getStatisticOTG()
      this.getStatisticODP()
      this.getStatisticPDP()
      this.getStatisticPositive()
    },
    async onSearch() {
      this.filter.city = this.districtCity.kota_kode
      this.filter.district = this.subDistrict.kecamatan_kode
      this.filter.village = this.village.desa_kode
      this.filter.isCity = !!this.filter.city
      this.filter.isDistrict = !!this.filter.district
      this.filter.isVillage = !!this.filter.village

      this.listQuery = {
        address_district_code: this.districtCity.kota_kode,
        address_subdistrict_code: this.subDistrict.kecamatan_kode,
        address_village_code: this.village.desa_kode
      }

      await this.filterTimeSeries()
      this.getStatisticConfirmed()
      this.getStatisticNotConfirmed()
      this.getStatisticOTG()
      this.getStatisticODP()
      this.getStatisticPDP()
      this.getStatisticPositive()
    },
    clearCity() {
      this.districtCity = {
        kota_kode: null,
        kota_nama: null
      }
      this.listQuery.address_district_code = null
    },
    clearDistrict() {
      this.subDistrict = {
        kecamatan_kode: null,
        kecamatan_nama: null
      }
      this.listQuery.address_subdistrict_code = null
    },
    clearVillage() {
      this.village = {
        desa_kode: null,
        desa_nama: null
      }
      this.listQuery.address_village_code = null
    },
    async getStatisticConfirmed() {
      this.loadingConfirmed = true
      const res = await this.$store.dispatch('reports/countReportCaseFinal', this.listQuery)

      if (res) this.loadingConfirmed = false

      const active = res.data.POSITIF
      const recovery = res.data.SEMBUH
      const dead = res.data.MENINGGAL

      this.statistic.confirmed = {
        active,
        recovery,
        dead,
        total: active + recovery + dead
      }
    },
    async getStatisticNotConfirmed() {
      this.loadingNotConfirmed = true
      const res = await this.$store.dispatch('reports/countReportCase', this.listQuery)

      if (res) this.loadingNotConfirmed = false

      const otgProcess = res.data.OTG_PROCESS
      const otgDone = res.data.OTG_DONE
      const otgTotalSum = (otgProcess + otgDone)
      const otgTotal = (otgTotalSum === res.data.OTG) ? res.data.OTG : otgTotalSum
      const odpProcess = res.data.ODP_PROCESS
      const odpDone = res.data.ODP_DONE
      const odpTotalSum = (odpProcess + odpDone)
      const odpTotal = (odpTotalSum === res.data.ODP) ? res.data.ODP : odpTotalSum
      const pdpProcess = res.data.PDP_PROCESS
      const pdpDone = res.data.PDP_DONE
      const pdpTotalSum = (pdpProcess + pdpDone)
      const pdpTotal = (pdpTotalSum === res.data.PDP) ? res.data.PDP : pdpTotalSum

      this.statistic.otg = {
        process: otgProcess,
        processPercent: (otgProcess / otgTotal) * 100,
        done: otgDone,
        donePercent: (otgDone / otgTotal) * 100,
        total: otgTotal
      }
      this.statistic.odp = {
        process: odpProcess,
        processPercent: (odpProcess / odpTotal) * 100,
        done: odpDone,
        donePercent: (odpDone / odpTotal) * 100,
        total: odpTotal
      }
      this.statistic.pdp = {
        process: pdpProcess,
        processPercent: (pdpProcess / pdpTotal) * 100,
        done: pdpDone,
        donePercent: (pdpDone / pdpTotal) * 100,
        total: pdpTotal
      }
    },
    async getStatisticOTG() {
      this.loadingOTG = true

      const params = {
        address_district_code: this.listQuery.address_district_code,
        address_subdistrict_code: this.listQuery.address_subdistrict_code,
        address_village_code: this.listQuery.address_village_code,
        min_date: this.listQueryDate.min_date,
        max_date: this.listQueryDate.max_date
      }
      const res = await this.$store.dispatch('statistic/countOTG', params)

      if (res) this.loadingOTG = false

      const label = []
      const doneDaily = []
      const processDaily = []
      const doneCumulative = []
      const processCumulative = []
      res.data.map((data) => {
        let date = new Date(data.date).getTime()
        date = this.$moment(date).format('DD/MM')
        label.push(date)
        doneDaily.push(data.selesai)
        processDaily.push(data.proses)
        doneCumulative.push(data.cum_selesai)
        processCumulative.push(data.cum_proses)
      })
      this.statistic.otgDaily = {
        label,
        process: processDaily,
        done: doneDaily
      }
      this.statistic.otgCumulative = {
        label,
        process: processCumulative,
        done: doneCumulative
      }
    },
    async getStatisticODP() {
      this.loadingODP = true

      const params = {
        address_district_code: this.listQuery.address_district_code,
        address_subdistrict_code: this.listQuery.address_subdistrict_code,
        address_village_code: this.listQuery.address_village_code,
        min_date: this.listQueryDate.min_date,
        max_date: this.listQueryDate.max_date
      }
      const res = await this.$store.dispatch('statistic/countODP', params)

      if (res) this.loadingODP = false

      const label = []
      const doneDaily = []
      const processDaily = []
      const doneCumulative = []
      const processCumulative = []
      res.data.map((data) => {
        let date = new Date(data.date).getTime()
        date = this.$moment(date).format('DD/MM')
        label.push(date)
        doneDaily.push(data.selesai)
        processDaily.push(data.proses)
        doneCumulative.push(data.cum_selesai)
        processCumulative.push(data.cum_proses)
      })
      this.statistic.odpDaily = {
        label,
        process: processDaily,
        done: doneDaily
      }
      this.statistic.odpCumulative = {
        label,
        process: processCumulative,
        done: doneCumulative
      }
    },
    async getStatisticPDP() {
      this.loadingPDP = true

      const params = {
        address_district_code: this.listQuery.address_district_code,
        address_subdistrict_code: this.listQuery.address_subdistrict_code,
        address_village_code: this.listQuery.address_village_code,
        min_date: this.listQueryDate.min_date,
        max_date: this.listQueryDate.max_date
      }
      const res = await this.$store.dispatch('statistic/countPDP', params)

      if (res) this.loadingPDP = false

      const label = []
      const doneDaily = []
      const processDaily = []
      const doneCumulative = []
      const processCumulative = []
      res.data.map((data) => {
        let date = new Date(data.date).getTime()
        date = this.$moment(date).format('DD/MM')
        label.push(date)
        doneDaily.push(data.selesai)
        processDaily.push(data.proses)
        doneCumulative.push(data.cum_selesai)
        processCumulative.push(data.cum_proses)
      })
      this.statistic.pdpDaily = {
        label,
        process: processDaily,
        done: doneDaily
      }
      this.statistic.pdpCumulative = {
        label,
        process: processCumulative,
        done: doneCumulative
      }
    },
    async getStatisticPositive() {
      this.loadingPositive = true

      const params = {
        address_district_code: this.listQuery.address_district_code,
        address_subdistrict_code: this.listQuery.address_subdistrict_code,
        address_village_code: this.listQuery.address_village_code,
        min_date: this.listQueryDate.min_date,
        max_date: this.listQueryDate.max_date
      }
      const res = await this.$store.dispatch('statistic/countPositive', params)

      if (res) this.loadingPositive = false

      const label = []
      const activeDaily = []
      const recoveryDaily = []
      const deadDaily = []
      const activeCumulative = []
      const recoveryCumulative = []
      const deadCumulative = []
      res.data.map((data) => {
        let date = new Date(data.date).getTime()
        date = this.$moment(date).format('DD/MM')
        label.push(date)
        activeDaily.push(data.positif)
        recoveryDaily.push(data.sembuh)
        deadDaily.push(data.meninggal)
        activeCumulative.push(data.cum_positif)
        recoveryCumulative.push(data.cum_sembuh)
        deadCumulative.push(data.cum_meninggal)
      })
      this.statistic.positiveDaily = {
        label,
        active: activeDaily,
        recovery: recoveryDaily,
        dead: deadDaily
      }
      this.statistic.positiveCumulative = {
        label,
        active: activeCumulative,
        recovery: recoveryCumulative,
        dead: deadCumulative
      }
    },
    async onSelectTimeSeries(value) {
      this.selectedTimeSeries = value

      await this.filterTimeSeries()
      this.getStatisticOTG()
      this.getStatisticODP()
      this.getStatisticPDP()
      this.getStatisticPositive()
    },
    filterTimeSeries() {
      const today = new Date()
      const max = today.getTime()
      if (this.selectedTimeSeries === 'all') {
        this.listQueryDate = {
          min_date: null,
          max_date: null
        }
      } else if (this.selectedTimeSeries === 'one_week') {
        this.listQueryDate = {
          min_date: this.$moment(max).subtract(6, 'days').format('YYYY/MM/DD'),
          max_date: this.$moment(max).format('YYYY/MM/DD')
        }
      } else if (this.selectedTimeSeries === 'two_week') {
        this.listQueryDate = {
          min_date: this.$moment(max).subtract(13, 'days').format('YYYY/MM/DD'),
          max_date: this.$moment(max).format('YYYY/MM/DD')
        }
      } else if (this.selectedTimeSeries === 'one_month') {
        this.listQueryDate = {
          min_date: this.$moment(max).subtract(1, 'months').format('YYYY/MM/DD'),
          max_date: this.$moment(max).format('YYYY/MM/DD')
        }
      }
    },
    handleHelp() {
      window.open('https://s.id/panduan_laporcovid19', '_blank')
    }
  }
}
</script>

<style scoped>
.button {
  height: 46px !important;
  text-transform: none;
}
.v-text-field.v-text-field--enclosed .v-text-field__details {
  display: none !important;
}
.disclaimer {
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  background: linear-gradient(80.13deg, #27ae60 0%, #6fcf97 100%);
  padding: 24px;
}
.disclaimer .help {
  font-size: 16px;
  text-decoration: underline;
}
.v-input__slot {
  width: 250px;
}
.v-tabs-bar__content {
  display: flex;
}
</style>
