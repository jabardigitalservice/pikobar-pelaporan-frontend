<template>
  <v-form
    ref="form"
    lazy-validation
  >
    <v-row class="filter-row">
      <v-col cols="12" sm="3">
        <v-label class="title">{{ $t('label.latest_patient_status') }}:</v-label>
        <v-select
          v-model="listQuery.final_result"
          :items="caseResultList"
          solo
          item-text="label"
          item-value="value"
        />
      </v-col>
      <v-col cols="12" sm="9" class="reduce-padding-top">
        <address-region
          :district-code="listQuery.address_district_code"
          :district-name="district_name_user"
          :code-district.sync="listQuery.address_district_code"
          :sub-district-code="listQuery.address_subdistrict_code"
          :code-sub-district.sync="listQuery.address_subdistrict_code"
          :village-code="listQuery.address_village_code"
          :code-village.sync="listQuery.address_village_code"
          :village-name="nameVillage"
          :name-village.sync="nameVillage"
          :disabled-district="disabledDistrict"
          :disabled-address="false"
          :required-address="false"
          :is-label="true"
        />
      </v-col>
    </v-row>
    <v-row class="filter-row">
      <v-col cols="12" sm="4">
        <v-label class="title">{{ $t('label.criteria') }}:</v-label>
        <v-select
          v-model="listQuery.status"
          :items="statusList"
          solo
          item-text="label"
          item-value="value"
        />
      </v-col>
      <v-col cols="12" sm="4">
        <v-label class="title">{{ $t('label.input_date') }}:</v-label>
        <input-date-picker
          :format-date="formatDate"
          :label="'Tanggal Awal'"
          :date-value="listQuery.start_date"
          :value-date.sync="listQuery.start_date"
          @changeDate="listQuery.start_date = $event"
        />
      </v-col>
      <v-col cols="12" sm="4">
        <br>
        <input-date-picker
          :format-date="formatDate"
          :label="'Tanggal Akhir'"
          :date-value="listQuery.end_date"
          :value-date.sync="listQuery.end_date"
          @changeDate="listQuery.end_date = $event"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-spacer />
      <v-col cols="12" md="2" sm="2" class="pt-0 float-right">
        <v-btn
          block
          color="#4f4f4f"
          class="btn-reset"
          @click="onReset"
        >
          {{ $t('label.reset') }}
        </v-btn>
      </v-col>
      <v-col cols="12" md="2" sm="2" class="pt-0">
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
  </v-form>
</template>

<script>
import { mapGetters } from 'vuex'
import { rolesWidget } from '@/utils/constantVariable'
export default {
  name: 'CaseFilter',
  props: {
    listQuery: {
      type: Object,
      default: null
    },
    resetStatistic: {
      type: Boolean,
      default: false
    },
    onSearch: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      formatDate: 'YYYY-MM-DD',
      disabledDistrict: true,
      codeDistrict: '',
      nameVillage: '',
      statusList: [
        {
          label: this.$t('label.confirmation').toUpperCase(),
          value: 'CONFIRMATION'
        },
        {
          label: this.$t('route.tight_contact').toUpperCase(),
          value: 'CLOSECONTACT'
        },
        {
          label: this.$t('label.suspect').toUpperCase(),
          value: 'SUSPECT'
        },
        {
          label: this.$t('label.probable').toUpperCase(),
          value: 'PROBABLE'
        }
      ],
      caseResultList: [
        {
          label: this.$t('label.recovery'),
          value: 1
        },
        {
          label: this.$t('label.dead'),
          value: 2
        },
        {
          label: this.$t('label.discarded'),
          value: 3
        },
        {
          label: this.$t('label.still_sick'),
          value: 4
        },
        {
          label: this.$t('label.still_quarantine'),
          value: 5
        }
      ]
    }
  },
  computed: {
    ...mapGetters('user', [
      'roles',
      'district_user',
      'district_name_user',
      'fullName'
    ])
  },
  async beforeMount() {
    this.disabledDistrict = rolesWidget['dinkesKotaAndFaskes'].includes(this.roles[0])
  },
  methods: {
    onSelectDistrict(value) {
      this.listQuery.address_district_code = value.kota_kode
    },
    onReset() {
      this.listQuery.search = ''
      this.listQuery.final_result = ''
      this.listQuery.status = ''
      this.listQuery.stage = ''
      this.listQuery.address_subdistrict_code = ''
      this.listQuery.address_village_code = ''
      this.listQuery.start_date = ''
      this.listQuery.end_date = ''
      this.nameVillage = ''
      if (this.roles[0] !== 'dinkeskota') {
        this.listQuery.address_district_code = ''
        this.codeDistrict = ''
      }
      this.$store.dispatch('reports/listReportCase', this.listQuery)
      this.$emit('update:resetStatistic', true)
    }
  }
}
</script>
<style scoped>
  .filter-row {
    margin-bottom: -20px;
  }
  .reduce-padding-top {
    padding-top: 0px !important;
  }
  .reduce-padding-right {
    padding-right: 6px;
  }
  .reduce-padding-left {
    padding-left: 6px;
  }
  .main-div {
    margin-top: 20px;
  }
  .container {
    padding: 0px 35px;
  }
  .btn-reset {
    height: 46px !important;
    color: white !important;
  }
  .btn-cari {
    height: 46px !important;
  }
</style>
