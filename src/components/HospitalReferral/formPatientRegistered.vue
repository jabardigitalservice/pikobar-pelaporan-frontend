<template>
  <v-form
    ref="form"
    lazy-validation
  >
    <v-row>
      <v-col>
        <label class="required">{{ $t('label.search_patient_by_name_nik') }}</label>
        <ValidationProvider
          v-slot="{ errors }"
          rules="required"
        >
          <v-autocomplete
            :items="caseList"
            :error-messages="errors"
            :loading="isCaseLoading"
            :search-input.sync="searchCase"
            menu-props="auto"
            return-object
            item-text="name"
            item-value="_id"
            single-line
            solo
            autocomplete
            @change="handleChangeCase"
          >
            <template v-slot:selection="data">
              {{ getNameCase(data.item.nik, data.item.name, data.item.phone_number) }}
            </template>
            <template v-slot:item="data">
              {{ getNameCase(data.item.nik, data.item.name, data.item.phone_number) }}
            </template>
          </v-autocomplete>
        </ValidationProvider>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <label class="required">{{ $t('label.referral_hospital') }}</label>
        <ValidationProvider
          v-slot="{ errors }"
          rules="required"
        >
          <v-autocomplete
            v-model="formReferral.transfer_to_unit"
            :items="unitList"
            :error-messages="errors"
            :loading="isUnitLoading"
            :search-input.sync="searchUnit"
            :return-object="true"
            menu-props="auto"
            item-text="name"
            item-value="_id"
            single-line
            solo
            autocomplete
          />
        </ValidationProvider>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { ValidationProvider } from 'vee-validate'

export default {
  name: 'FormPatientRegistered',
  components: {
    ValidationProvider
  },
  props: {
    formReferral: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      isUnitLoading: false,
      isCaseLoading: false,
      caseList: [],
      unitList: [],
      searchCase: null,
      searchUnit: null,
      queryUnit: {
        search: '',
        unit_type: 'rumahsakit'
      },
      queryCase: {
        search: '',
        verified_status: 'verified'
      }
    }
  },
  watch: {
    async searchCase(value) {
      this.isCaseLoading = true
      this.queryCase.search = value
      if (value) {
        const response = await this.$store.dispatch('reports/listReportCase', this.queryCase)
        this.caseList = response.data.cases
      }
      this.isCaseLoading = false
    },
    async searchUnit(value) {
      this.isUnitLoading = true
      this.queryUnit.search = value
      const response = await this.$store.dispatch('region/listUnit', this.queryUnit)
      this.unitList = response.data.itemsList
      this.isUnitLoading = false
    }
  },
  async mounted() {
    const responseUnit = await this.$store.dispatch('region/listUnit', this.queryUnit)
    this.unitList = responseUnit.data.itemsList
    const responseCase = await this.$store.dispatch('reports/listReportCase', this.queryCase)
    if (responseCase.data !== null) {
      this.caseList = responseCase.data.cases
    }
  },
  methods: {
    getNameCase(nik, name, phone_number) {
      // eslint-disable-next-line no-redeclare
      let nameCase = ''
      if (nik) nameCase += nik + ' / '
      if (name) nameCase += name
      if (phone_number) nameCase += ' / ' + phone_number
      return nameCase
    },
    handleChangeCase(value) {
      this.formReferral.case_id = value._id
    }
  }
}
</script>
