<template>
  <div>
    <form-information-patient
      :form-pasien="formReferral"
      :patient-referral="true"
    />
    <form-information-history
      :form-pasien="formReferral"
      :patient-referral="true"
    />
    <v-container>
      <v-expansion-panels
        v-model="panelListRiwayat"
        multiple
      >
        <v-expansion-panel>
          <v-expansion-panel-header style="color: #27AE60;">
            <img src="@/static/hospital_refferal.svg" alt="hospital-refferal" style="max-width: 30px;">
            {{ $t('label.choose_referral_hospital') }}
            <v-divider />
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row>
              <v-col>
                <label class="required">{{ $t('label.choose_referral_hospital') }}</label>
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
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>
  </div>
</template>

<script>
import { ValidationProvider } from 'vee-validate'

export default {
  name: 'FormPatientUnregistered',
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
      unitList: [],
      panelListRiwayat: [0],
      isUnitLoading: false,
      searchUnit: null,
      queryUnit: {
        search: '',
        unit_type: 'rumahsakit'
      }
    }
  },
  watch: {
    async searchUnit(value) {
      this.isUnitLoading = true
      this.queryUnit.search = value
      const response = await this.$store.dispatch('region/listUnit', this.queryUnit)
      if (response.data) {
        this.unitList = response.data.itemsList
      }
      this.isUnitLoading = false
    }
  },
  async mounted() {
    const responseUnit = await this.$store.dispatch('region/listUnit', this.queryUnit)
    this.unitList = responseUnit.data.itemsList
  }
}
</script>
