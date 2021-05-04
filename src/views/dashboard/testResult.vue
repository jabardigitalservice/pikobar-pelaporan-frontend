<template>
  <v-container
    v-if="display"
    fluid
    grid-list-xl
    py-0
    mb-10
    class="dashboard-test-result"
  >
    <h3><strong>{{ $t('label.dashboard') }} {{ $t('label.test_result_id') }}</strong></h3>
    <v-row class="test-result-filter mb-3">
      <v-col
        cols="12"
        lg="10"
      >
        <v-row>
          <v-col
            cols="12"
            lg="3"
            class="py-0"
          >
            <label>{{ $t('label.date') }}</label>
            <v-dialog
              ref="dialog"
              v-model="modal"
              persistent
              width="291"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="dateActive"
                  :label="$t('label.choose_date')"
                  prepend-icon="event"
                  readonly
                  v-bind="attrs"
                  solo-inverted
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="dateActive"
                :allowed-dates="disablePastDates"
                range
                scrollable
                locale="id"
              >
                <div
                  class="d-flex justify-end"
                  style="width: 100%"
                >
                  <v-btn
                    color="grey darken-3"
                    class="button white--text mr-3"
                    min-width="auto"
                    @click="dateActive = []"
                  >
                    {{ $t('label.reset') }}
                  </v-btn>
                  <v-btn
                    color="grey darken-3"
                    class="button white--text mr-3"
                    min-width="auto"
                    @click="modal = false"
                  >
                    {{ $t('label.cancel') }}
                  </v-btn>
                  <v-btn
                    color="success"
                    class="button"
                    min-width="auto"
                    @click="onSelectDate(dateActive)"
                  >
                    {{ $t('label.ok') }}
                  </v-btn>
                </div>
              </v-date-picker>
            </v-dialog>
          </v-col>
          <v-col
            cols="12"
            lg="3"
            class="py-0"
          >
            <label>{{ $t('label.district_city') }}</label>
            <select-area-district-city
              :disabled-district="disabledDistrict"
              :district-city="districtCity"
              :city-district.sync="districtCity"
              :on-select-district="onSelectDistrict"
            />
          </v-col>
          <v-col
            cols="12"
            lg="3"
            class="py-0"
          >
            <label>{{ $t('label.subdistrict') }}</label>
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
            lg="3"
            class="py-0"
          >
            <label>{{ $t('label.village') }}</label>
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
        lg="2"
      >
        <div class="pt-lg-5">
          <v-btn
            block
            color="grey darken-3"
            class="button white--text"
            @click="onReset"
          >
            {{ $t('label.reset') }}
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row class="d-flex flex-wrap mb-3">
      <v-col
        cols="12"
        lg="2"
        md="12"
        class="d-flex"
      >
        <v-card
          class="total-test-result d-flex align-center"
          style="width: 100%"
          outlined
        >
          <v-card-text class="white--text text-center">
            <h4 class="mb-0"><strong>{{ $t('label.total_test_result') }}</strong></h4>
            <h3 class="mb-0"><strong>{{ statistic.total | number }}</strong></h3>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        lg="5"
        md="12"
      >
        <v-card
          class="total-rapid"
          outlined
        >
          <v-card-text>
            <div class="d-flex align-center mb-2">
              <div class="box mr-3 pa-4">
                <v-img src="@/static/rapid.svg" />
              </div>
              <div>
                <span>{{ $t('label.rapid_test_id') }}</span>
                <h3 class="mb-0"><strong>{{ statistic.totalRdt | number }}</strong></h3>
              </div>
            </div>
            <v-row>
              <v-col
                cols="12"
                sm="4"
                xs="12"
              >
                <v-card
                  class="total-rapid-reaktif"
                  outlined
                >
                  <v-card-text class="text-center">
                    <span>{{ $t('label.reaktif') }}</span>
                    <h4 class="mb-0"><strong>{{ statistic.totalRdtReaktif | number }}</strong></h4>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col
                cols="12"
                sm="4"
                xs="12"
              >
                <v-card
                  class="total-rapid-nonreaktif"
                  outlined
                >
                  <v-card-text class="text-center">
                    <span>{{ $t('label.non_reaktif') }}</span>
                    <h4 class="mb-0"><strong>{{ statistic.totalRdtNonReaktif | number }}</strong></h4>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col
                cols="12"
                sm="4"
                xs="12"
              >
                <v-card
                  class="total-rapid-inkonklusif"
                  outlined
                >
                  <v-card-text class="text-center">
                    <span>{{ $t('label.inkonklusif') }}</span>
                    <h4 class="mb-0"><strong>{{ statistic.totalRdtInkonklusif | number }}</strong></h4>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        lg="5"
        md="12"
      >
        <v-card
          class="total-pcr"
          outlined
        >
          <v-card-text>
            <div class="d-flex align-center mb-2">
              <div class="box mr-3 pa-4">
                <v-img src="@/static/pcr.svg" />
              </div>
              <div>
                <span>{{ $t('label.pcr') }}</span>
                <h3 class="mb-0"><strong>{{ statistic.totalPcr | number }}</strong></h3>
              </div>
            </div>
            <v-row>
              <v-col
                cols="12"
                sm="4"
                xs="12"
              >
                <v-card
                  class="total-rapid-positif"
                  outlined
                >
                  <v-card-text class="text-center">
                    <span>{{ $t('label.positif') }}</span>
                    <h4 class="mb-0"><strong>{{ statistic.totalPcrPositif | number }}</strong></h4>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col
                cols="12"
                sm="4"
                xs="12"
              >
                <v-card
                  class="total-rapid-negatif"
                  outlined
                >
                  <v-card-text class="text-center">
                    <span>{{ $t('label.negatif') }}</span>
                    <h4 class="mb-0"><strong>{{ statistic.totalPcrNegatif | number }}</strong></h4>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col
                cols="12"
                sm="4"
                xs="12"
              >
                <v-card
                  class="total-rapid-invalid"
                  outlined
                >
                  <v-card-text class="text-center">
                    <span>{{ $t('label.invalid') }}</span>
                    <h4 class="mb-0"><strong>{{ statistic.totalPcrInvalid | number }}</strong></h4>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-tabs class="mb-3">
      <v-tab
        :key="'all'"
        @click="filterTab('all')"
      >
        Semua
      </v-tab>
      <v-tab
        :key="'rapid'"
        @click="filterTab('rapid')"
      >
        Rapid Test
      </v-tab>
      <v-tab
        :key="'pcr'"
        @click="filterTab('pcr')"
      >
        PCR
      </v-tab>
    </v-tabs>
    <v-row class="mb-1">
      <v-col cols="12">
        <chart-test-monthly
          :tab-active="tabActive"
          :test-tools="filterActive.test_tools"
          :filter-test-tools.sync="filterActive.test_tools"
          :data-test-monthly="summaryTestResultMonthly"
          :test-monthly-data.sync="summaryTestResultMonthly"
          :data-test-monthly-rdt="summaryTestResultMonthlyRDT"
          :data-test-monthly-pcr="summaryTestResultMonthlyPCR"
          :test-monthly-rdt-data.sync="summaryTestResultMonthlyRDT"
          :test-monthly-pcr-data.sync="summaryTestResultMonthlyPCR"
        />
      </v-col>
    </v-row>
    <v-row class="mb-1">
      <v-col
        cols="12"
        lg="6"
        sm="12"
      >
        <chart-test-area
          :tab-active="tabActive"
          :data-test-region="summaryTestResultRegion"
          :test-region-data.sync="summaryTestResultRegion"
        />
      </v-col>
      <v-col
        cols="12"
        lg="6"
        sm="12"
      >
        <chart-test-target
          :tab-active="tabActive"
          :data-test-target="summaryTestResultTargets"
          :test-target-data.sync="summaryTestResultTargets"
        />
      </v-col>
    </v-row>
    <v-row class="mb-1">
      <v-col
        cols="12"
        lg="4"
        sm="12"
      >
        <chart-test-gender
          :tab-active="tabActive"
          :params="filterActive"
        />
      </v-col>
      <v-col
        cols="12"
        lg="8"
        sm="12"
      >
        <chart-test-age
          :tab-active="tabActive"
          :params="filterActive"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { rolesWidget } from '@/utils/constantVariable'

export default {
  name: 'DashboardTestResult',
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
      display: true,
      loadingStatistic: false,
      dateActive: [],
      modal: false,
      disabledDistrict: false,
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
      filterActive: {
        address_district_code: null,
        address_subdistrict_code: null,
        address_village_code: null,
        min_date: null,
        max_date: null,
        test_tools: ['vena', 'kapiler']

      },
      tabActive: 'all',
      statistic: {
        total: 0,
        totalRdt: 0,
        totalRdtReaktif: 0,
        totalRdtNonReaktif: 0,
        totalRdtInkonklusif: 0,
        totalPcr: 0,
        totalPcrPositif: 0,
        totalPcrNegatif: 0,
        totalPcrInvalid: 0
      },
      summaryTestResultMonthly: [],
      summaryTestResultMonthlyRDT: [],
      summaryTestResultMonthlyPCR: [],
      summaryTestResultRegion: [],
      summaryTestResultTargets: []
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
    },
    'filterActive': {
      async handler(value) {
        await this.getStatisticTestResult()
        await this.getSummaryTestResult()
        await this.getSummaryTestResultLocation()
      },
      deep: true
    }
  },
  async mounted() {
    if (rolesWidget['dinkesKotaAndFaskes'].includes(this.roles[0])) {
      this.disabledDistrict = true
      this.filterActive.address_district_code = this.district_user
    }

    this.districtCity = {
      kota_kode: this.district_user,
      kota_nama: this.district_name_user
    }

    await this.getStatisticTestResult()
    await this.getSummaryTestResult()
    await this.getSummaryTestResultLocation()
  },
  beforeDestroy() {
    this.clearCity()
    this.clearDistrict()
    this.clearVillage()
  },
  methods: {
    filterTab(value) {
      this.tabActive = value
    },
    disablePastDates(val) {
      if (this.dateActive.length > 0) {
        return val >= new Date(this.dateActive[0]).toISOString().substr(0, 10)
      }
      return val
    },
    async onSelectDate(event) {
      this.$refs.dialog.save(event)
      if (event.length === 1) {
        this.filterActive.min_date = event[0]
        this.filterActive.max_date = event[0]
      } else {
        const min = new Date(event[0]).getTime()
        const max = new Date(event[1]).getTime()
        if (min > max) {
          this.filterActive.min_date = event[1]
          this.filterActive.max_date = event[0]
        } else {
          this.filterActive.min_date = event[0]
          this.filterActive.max_date = event[1]
        }
      }
    },
    async onSelectDistrict(value) {
      this.districtCity = value
      this.clearDistrict()
      this.clearVillage()
      this.$emit('update:codeDistrict', value.kota_kode || null)
      this.$emit('update:nameDistrict', value.kota_nama || null)

      this.filterActive.address_district_code = value.kota_kode
    },
    async onSelectSubDistrict(value) {
      this.subDistrict = value
      this.clearVillage()
      this.$emit('update:codeSubDistrict', value.kecamatan_kode || null)
      this.$emit('update:nameSubDistrict', value.kecamatan_nama || null)

      this.filterActive.address_subdistrict_code = value.kecamatan_kode
    },
    async onSelectVillage(value) {
      this.village = value
      this.$emit('update:codeVillage', value.desa_kode || null)
      this.$emit('update:nameVillage', value.desa_nama || null)

      this.filterActive.address_village_code = value.desa_kode
    },
    async onReset() {
      if (rolesWidget['superadmin'].includes(this.roles[0])) {
        this.clearCity()
        this.filterActive.address_district_code = null
      }
      this.clearDistrict()
      this.clearVillage()
      this.clearDate()
      this.filterActive.address_subdistrict_code = null
      this.filterActive.address_village_code = null
      this.filterActive.min_date = null
      this.filterActive.max_date = null
    },
    clearDate() {
      this.dateActive = []
    },
    clearCity() {
      this.districtCity = {
        kota_kode: null,
        kota_nama: null
      }
      this.filterActive.address_district_code = null
    },
    clearDistrict() {
      this.subDistrict = {
        kecamatan_kode: null,
        kecamatan_nama: null
      }
      this.filterActive.address_subdistrict_code = null
    },
    clearVillage() {
      this.village = {
        desa_kode: null,
        desa_nama: null
      }
      this.filterActive.address_village_code = null
    },
    async getStatisticTestResult() {
      this.loadingStatistic = true
      const res = await this.$store.dispatch('statistic/countTestResult', this.filterActive)

      if (res) this.loadingStatistic = false

      if (res.data.length > 0) {
        this.statistic = {
          total: res.data[0].TOTAL,
          totalRdt: res.data[0].RDT,
          totalRdtReaktif: res.data[0].RDT_REAKTIF,
          totalRdtNonReaktif: res.data[0].RDT_NON_REAKTIF,
          totalRdtInkonklusif: res.data[0].RDT_INKONKLUSIF,
          totalPcr: res.data[0].PCR,
          totalPcrPositif: res.data[0].PCR_POSITIF,
          totalPcrNegatif: res.data[0].PCR_NEGATIF,
          totalPcrInvalid: res.data[0].PCR_INVALID
        }
      } else {
        this.statistic = {
          total: 0,
          totalRdt: 0,
          totalRdtReaktif: 0,
          totalRdtNonReaktif: 0,
          totalRdtInkonklusif: 0,
          totalPcr: 0,
          totalPcrPositif: 0,
          totalPcrNegatif: 0,
          totalPcrInvalid: 0
        }
      }
    },
    async getSummaryTestResult() {
      const res = await this.$store.dispatch('statistic/summaryTestResult', this.filterActive)
      const { data } = res
      this.summaryTestResultMonthly = Array.isArray(data) ? data[0].month : []
      this.summaryTestResultMonthlyRDT = Array.isArray(data) ? data[0].month_rdt : []
      this.summaryTestResultMonthlyPCR = Array.isArray(data) ? data[0].month_pcr : []
    },
    async getSummaryTestResultLocation() {
      const res = await this.$store.dispatch('statistic/summaryTestResultLocation', this.filterActive)
      const { data } = res
      this.summaryTestResultRegion = Array.isArray(data) ? data[0].summary : []
      this.summaryTestResultTargets = Array.isArray(data) ? data[0].targets : []
    }
  }
}
</script>

<style lang="scss">
.dashboard-test-result {
  .button {
    height: 46px !important;
    text-transform: none;
  }

  .v-text-field.v-text-field--enclosed .v-text-field__details {
    display: none !important;
  }

  .total-test-result {
    background: linear-gradient(38.05deg, #27ae60 0%, #6fcf97 100%);
  }

  .box {
    width: 54px;
    height: 54px;
    border-radius: 8px;
  }

  .total-rapid {
    .box {
      background: #27ae60;
    }
  }

  .total-pcr {
    .box {
      background: #f2c94c;
    }
  }
}
</style>
