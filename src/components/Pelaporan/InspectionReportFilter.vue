<template>
  <v-form
    ref="form"
    lazy-validation
  >
    <v-row class="filter-row">
      <v-col cols="12" sm="3">
        <v-label class="title">{{ $t('label.examination_result_date') }}:</v-label>
        <input-date-picker
          :format-date="formatDate"
          :label="$t('label.choose_date')"
          :date-value="listQuery.date"
          :value-date.sync="listQuery.date"
          @changeDate="listQuery.date = $event"
        />
      </v-col>
      <v-col cols="12" sm="9" class="pt-0">
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
  name: 'InspectionReportFilter',
  props: {
    listQuery: {
      type: Object,
      default: null
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
      nameVillage: ''
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
    if (rolesWidget['dinkesKotaAndFaskes'].includes(this.roles[0])) this.listQuery.address_district_code = this.district_user
    this.disabledDistrict = rolesWidget['dinkesKotaAndFaskes'].includes(this.roles[0])
  },
  methods: {
    onSelectDistrict(value) {
      this.listQuery.address_district_code = value.kota_kode
    },
    onReset() {
      this.listQuery.search = ''
      this.listQuery.address_subdistrict_code = ''
      this.listQuery.address_village_code = ''
      this.listQuery.date = ''
      this.nameVillage = ''
      if (this.roles[0] !== 'dinkeskota') {
        this.listQuery.address_district_code = ''
        this.codeDistrict = ''
      }
    }
  }
}
</script>
