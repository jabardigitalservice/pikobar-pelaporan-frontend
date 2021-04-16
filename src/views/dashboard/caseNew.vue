<template>
  <v-container
    v-if="display"
    fluid
    grid-list-xl
    py-0
    mb-10
    class="dashboard-case-new"
  >
    <h3><strong>{{ `${$t('label.dashboard')} ${$t('label.case')} ${$t('label.covid19')}` }}</strong></h3>
    <v-card
      class="warning-background"
      outlined
      color="#6FCF97"
      min-height="90px"
    >
      <div
        class="white--text ml-8 mt-6"
      >
        <div class="font-weight-bold">
          Pengumuman:
          <br>
          Versi Tanggal 01 - 04 - 2021 | 11:28:00
        </div>
        <div class="my-8">
          Sistem mungkin mengalami keterlambatan dalam menampilkan data terbaru. Tunggu 5-10 menit setelah Anda input data baru dan lakukan muat ulang.
        </div>
      </div>
    </v-card>
    <!-- <v-row class="mb-3">
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
    </v-row> -->
    <v-row class="case-new-filter mb-3">
      <v-col
        cols="12"
        lg="8"
      >
        <v-row>
          <v-col
            cols="12"
            lg="4"
            class="py-0"
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
            lg="4"
            class="py-0"
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
            lg="4"
            class="py-0"
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
        lg="2"
      >
        <div class="pt-0">
          <v-btn
            block
            color="success"
            class="button"
            @click="onSearch"
          >
            {{ $t('label.look_for_it') }}
          </v-btn>
        </div>
      </v-col>
      <v-col
        cols="12"
        lg="2"
      >
        <div class="pt-0">
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
    <v-row class="statistic mb-1 row-eq-height">
      <v-col
        cols="12"
        lg="3"
      >
        <statistic-new-confirmed
          :loading="loadingStatistic"
          :statistic="statistic.confirmed"
        />
      </v-col>
      <v-col
        cols="12"
        lg="3"
      >
        <statistic-new-active
          :loading="loadingStatistic"
          :statistic="statistic.confirmed"
        />
      </v-col>
      <v-col
        cols="12"
        lg="3"
      >
        <statistic-new-recovered
          :loading="loadingStatistic"
          :statistic="statistic.confirmed"
        />
      </v-col>
      <v-col
        cols="12"
        lg="3"
      >
        <statistic-new-death
          :loading="loadingStatistic"
          :statistic="statistic.confirmed"
        />
      </v-col>
    </v-row>
    <v-row class="statistic mb-3 row-eq-height">
      <v-col
        cols="12"
        lg="4"
      >
        <statistic-new-probable
          :loading="loadingStatistic"
          :statistic="statistic.probable"
        />
      </v-col>
      <v-col
        cols="12"
        lg="4"
      >
        <statistic-new-suspect
          :loading="loadingStatistic"
          :statistic="statistic.suspect"
        />
      </v-col>
      <v-col
        cols="12"
        lg="4"
      >
        <statistic-new-close-contact
          :loading="loadingStatistic"
          :statistic="statistic.closeContact"
        />
      </v-col>
    </v-row>
    <recap-status />
    <recap-demographic />
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { rolesWidget } from '@/utils/constantVariable'

export default {
  name: 'DashboardCaseNew',
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
        address_village_code: null
      },
      statistic: {
        confirmed: {
          sick_home: 0,
          sick_hospital: 0,
          recovered: 0,
          decease: 0
        },
        probable: {
          sick: 0,
          recovered: 0,
          decease: 0
        },
        suspect: {
          sick: 0,
          discarded: 0
        },
        closeContact: {
          quarantine: 0,
          discarded: 0
        }
      }
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
    districtCode: value => {
      if (value) {
        this.districtCity = {
          kota_kode: value,
          kota_nama: this.districtName
        }
      } else {
        this.clearCity()
      }
    },
    subDistrictCode: value => {
      this.subDistrict = {
        kecamatan_kode: value,
        kecamatan_nama: this.subDistrictName
      }
    },
    villageCode: value => {
      this.village = {
        desa_kode: value,
        desa_nama: this.villageName
      }
    }
  },
  async beforeMount() {
    if (rolesWidget['dinkesKotaAndFaskes'].includes(this.roles[0])) {
      this.disabledDistrict = true
      this.filterActive.address_district_code = this.district_user
    }

    this.districtCity = {
      kota_kode: this.district_user,
      kota_nama: this.district_name_user
    }

    this.getStatisticCaseNew()
  },
  beforeDestroy() {
    this.clearCity()
    this.clearDistrict()
    this.clearVillage()
  },
  methods: {
    async onSelectDistrict(value) {
      this.districtCity = value
      this.clearDistrict()
      this.clearVillage()
      this.$emit('update:codeDistrict', value.kota_kode || null)
      this.$emit('update:nameDistrict', value.kota_nama || null)
    },
    async onSelectSubDistrict(value) {
      this.subDistrict = value
      this.clearVillage()
      this.$emit('update:codeSubDistrict', value.kecamatan_kode || null)
      this.$emit('update:nameSubDistrict', value.kecamatan_nama || null)
    },
    async onSelectVillage(value) {
      this.village = value
      this.$emit('update:codeVillage', value.desa_kode || null)
      this.$emit('update:nameVillage', value.desa_nama || null)
    },
    async onSearch() {
      this.filterActive.address_district_code = this.districtCity.kota_kode
      this.filterActive.address_subdistrict_code = this.subDistrict.kecamatan_kode
      this.filterActive.address_village_code = this.village.desa_kode

      this.getStatisticCaseNew()
    },
    async onReset() {
      if (rolesWidget['superadmin'].includes(this.roles[0])) {
        this.clearCity()
        this.filterActive.address_district_code = null
      }
      this.clearDistrict()
      this.clearVillage()
      this.filterActive.address_subdistrict_code = null
      this.filterActive.address_village_code = null

      this.getStatisticCaseNew()
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
    handleHelp() {
      window.open('https://s.id/panduan_laporcovid19', '_blank')
    },
    async getStatisticCaseNew() {
      this.loadingStatistic = true

      const params = {
        address_district_code: this.filterActive.address_district_code,
        address_subdistrict_code: this.filterActive.address_subdistrict_code,
        address_village_code: this.filterActive.address_village_code
      }
      const res = await this.$store.dispatch('statistic/countCaseNew', params)

      if (res) this.loadingStatistic = false

      this.statistic.confirmed = {
        sick_home: res.data[0].confirmed[0].sick_home || 0,
        sick_hospital: res.data[0].confirmed[0].sick_hospital || 0,
        recovered: res.data[0].confirmed[0].recovered || 0,
        decease: res.data[0].confirmed[0].decease || 0
      }

      this.statistic.probable = {
        sick: res.data[0].probable[0].sick || 0,
        recovered: res.data[0].probable[0].recovered || 0,
        decease: res.data[0].probable[0].decease || 0
      }

      this.statistic.suspect = {
        sick: res.data[0].suspect[0].sick || 0,
        discarded: res.data[0].suspect[0].discarded || 0
      }

      this.statistic.closeContact = {
        quarantine: res.data[0].closeContact[0].quarantine || 0,
        discarded: res.data[0].closeContact[0].discarded || 0
      }
    }
  }
}
</script>

<style lang="scss">
  .warning-background {
    background-image: url('../../static/warning_green_icon.svg');
    // background: linear-gradient(88.9deg, #27AE60 0%, #6FCF97 100%);
    // border-radius: 8px;
  }
  .dashboard-case-new {
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

    .v-text-field.v-text-field--enclosed .v-text-field__details {
      display: none !important;
    }

    .button {
      height: 46px !important;
      text-transform: none;
    }

    .row-eq-height {
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
    }
  }
</style>
