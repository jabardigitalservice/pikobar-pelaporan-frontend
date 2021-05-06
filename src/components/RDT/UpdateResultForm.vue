<template>
  <v-container>
    <ValidationObserver ref="observer">
      <v-form
        ref="form"
        lazy-validation
      >
        <v-row>
          <v-col
            cols="12"
            md="6"
            sm="12"
          >
            <ValidationProvider
              v-slot="{ errors }"
              rules="required"
            >
              <label class="required">{{ $t('label.method') }}</label>
              <v-radio-group
                :key="formRapid.tool_tester"
                v-model="formRapid.tool_tester"
                :error-messages="errors"
                row
              >
                <v-radio
                  :label="$t('label.rapid_test')"
                  value="RDT"
                />
                <v-radio
                  :label="$t('label.pcr')"
                  value="PCR"
                />
              </v-radio-group>
            </ValidationProvider>
            <ValidationProvider
              v-if="formRapid.tool_tester === 'RDT'"
              v-slot="{ errors }"
              rules="required"
            >
              <label class="required">{{ $t('label.sampling') }}</label>
              <v-radio-group
                v-model="formRapid.sampling_type"
                :error-messages="errors"
                row
              >
                <v-radio
                  :label="$t('label.vena')"
                  value="Vena"
                />
                <v-radio
                  :label="$t('label.kapiler')"
                  value="Kapiler"
                />
              </v-radio-group>
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors }"
              rules="required"
            >
              <label class="required">{{ $t('label.test_result') }}</label>
              <v-radio-group
                v-model="formRapid.final_result"
                :error-messages="errors"
                class="ml-3"
                row
              >
                <v-row
                  v-if="formRapid.tool_tester === 'PCR'"
                >
                  <v-radio
                    :label="$t('label.negatif')"
                    value="NEGATIF"
                  />
                  <v-radio
                    :label="$t('label.positif')"
                    value="POSITIF"
                  />
                  <v-radio
                    :label="$t('label.inkonklusif')"
                    value="INKONKLUSIF"
                  />

                </v-row>
                <v-row
                  v-else
                >
                  <v-radio
                    :label="$t('label.reaktif')"
                    value="REAKTIF"
                  />
                  <v-radio
                    :label="$t('label.non_reaktif')"
                    value="NON REAKTIF"
                  />
                  <v-radio
                    :label="$t('label.invalid')"
                    value="INVALID"
                  />
                </v-row>
              </v-radio-group>
            </ValidationProvider>
            <ValidationProvider
              v-if="formRapid.tool_tester"
              v-slot="{ errors }"
              rules="required|numeric"
              class="full-width"
            >
              <label class="required">{{ formRapid.tool_tester === 'PCR' ? $t('label.swab_count') : $t('label.rdt_count') }}</label>
              <v-text-field
                v-if="formRapid.tool_tester === 'PCR'"
                v-model="formRapid.swab_to"
                :error-messages="errors"
                solo-inverted
                type="number"
              />
              <v-text-field
                v-else
                v-model="formRapid.rdt_to"
                :error-messages="errors"
                solo-inverted
                type="number"
              />
            </ValidationProvider>
          </v-col>
          <v-col>
            <label class="required">{{ $t('label.testing_date') }}</label>
            <input-date-picker
              :label="$t('label.testing_date')"
              :format-date="'YYYY/MM/DD'"
              :date-value="testDate"
              :value-date.sync="testDate"
              @changeDate="handleChangeDate"
            />
            <ValidationProvider
              v-slot="{ errors }"
              rules="required"
            >
              <label class="required">{{ $t('label.place_testing') }}</label>
              <v-radio-group
                v-model="formRapid.test_location_type"
                :error-messages="errors"
                row
                @change="handleChangeLocationNow"
              >
                <v-radio
                  :label="$t('label.hospital')"
                  value="RS"
                />
                <v-radio
                  :label="$t('label.lab')"
                  value="LAB"
                />
                <v-radio
                  :label="$t('label.other')"
                  value="LAINNYA"
                />
              </v-radio-group>
            </ValidationProvider>
            <ValidationProvider
              v-if="formRapid.test_location_type === 'RS'"
              v-slot="{ errors }"
              rules="required"
            >
              <v-autocomplete
                v-model="formRapid.test_location"
                :no-data-text="$t('label.data_not_available')"
                :items="hospitalList"
                :return-object="false"
                :error-messages="errors"
                :label="$t('label.choose_place_test')"
                menu-props="auto"
                item-text="name"
                item-value="name"
                single-line
                solo
                autocomplete
                @change="onSelectHospital"
              />
            </ValidationProvider>
            <ValidationProvider
              v-if="formRapid.test_location_type === 'LAB'"
              v-slot="{ errors }"
              rules="required"
            >
              <v-autocomplete
                v-model="formRapid.lab"
                :no-data-text="$t('label.data_not_available')"
                :return-object="false"
                :error-messages="errors"
                :label="$t('label.choose_place_test')"
                :items="listLab"
                menu-props="auto"
                item-text="lab_name"
                item-value="lab_name"
                single-line
                solo
                autocomplete
                @change="onSelectHospital"
              />
            </ValidationProvider>
            <ValidationProvider
              v-if="formRapid.test_location_type === 'LAINNYA'"
              v-slot="{ errors }"
            >
              <v-text-field
                v-model="formRapid.test_other_location"
                :error-messages="errors"
                :placeholder="$t('label.input_name_place')"
                solo-inverted
              />
            </ValidationProvider>
            <div v-if="formRapid.test_location_type === 'LAINNYA'">
              <address-region
                v-model="formRapid.test_address_district_name"
                :disabled-district="true"
                :district-code="formRapid.test_address_district_code"
                :district-name="formRapid.test_address_district_name"
                :code-district.sync="formRapid.test_address_district_code"
                :name-district.sync="formRapid.test_address_district_name"
                :sub-district-code="formRapid.test_address_subdistrict_code"
                :sub-district-name="formRapid.test_address_subdistrict_name"
                :code-sub-district.sync="formRapid.test_address_subdistrict_code"
                :name-sub-district.sync="formRapid.test_address_subdistrict_name"
                :village-code="formRapid.test_address_village_code"
                :village-name="formRapid.test_address_village_name"
                :code-village.sync="formRapid.test_address_village_code"
                :name-village.sync="formRapid.test_address_village_name"
                :required-address="true"
              />
            </div>
            <label v-if="formRapid.test_location_type === 'LAINNYA'">
              {{ $t('label.complete_address_place_testing') }}
            </label>
            <v-textarea
              v-if="formRapid.test_location_type === 'LAINNYA'"
              v-model="formRapid.test_address_detail"
              solo
            />
            <label>{{ $t('label.additional_information') }}</label>
            <v-textarea
              v-model="formRapid.test_note"
              solo
            />
          </v-col>
        </v-row>
        <v-container fluid>
          <v-row>
            <v-col class="text-right">
              <v-btn
                :loading="loading"
                bottom
                @click="handleBack"
              >
                {{ $t('label.cancel') }}
              </v-btn>
              <v-btn
                :loading="loading"
                class="ml-2"
                color="success"
                bottom
                @click="handleSave"
              >
                {{ $t('label.save') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </ValidationObserver>
  </v-container>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { mapGetters } from 'vuex'
export default {
  name: 'UpdateResultForm',
  components: {
    ValidationProvider,
    ValidationObserver
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    idResult: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      formatDate: 'YYYY/MM/DD',
      formRapid: {
        tool_tester: '',
        test_location_type: ''
      },
      listLab: [],
      isInitialState: true,
      districtCode: null,
      districtName: null,
      testDate: null
    }
  },
  computed: {
    ...mapGetters('region', [
      'hospitalList'
    ]),
    // TODO: ubah getters name district_user to camel case, rubah juga di komponen lainnya
    ...mapGetters('user', [
      'district_user'
    ])
  },
  watch: {
    'formRapid.tool_tester'(value) {
      if (this.formRapid) {
        if (value === 'PCR') this.formRapid.sampling_type = null
      }
    },
    idResult(value) {
      this.idResult = value
      this.getResultTest()
    }
  },
  created() {
    this.getResultTest()
  },
  methods: {
    async getResultTest() {
      const response = await this.$store.dispatch('rdt/detailParticipant', this.idResult)
      Object.assign(this.formRapid, response.data)
      this.testDate = this.formRapid.test_date
      const listQuery = {
        city_code: this.district_user
      }
      await this.$store.dispatch('region/getListHospital', listQuery)
      const responseLab = await this.$store.dispatch('rdt/getLabList')
      this.listLab = responseLab.data
      const paramHospitalWestJava = { 'rs_jabar': true }
      await this.$store.dispatch('region/getListHospital', paramHospitalWestJava)
      this.districtCode = this.formRapid.test_address_district_code
      this.districtName = this.formRapid.test_address_district_name
    },
    handleBack() {
      this.formRapid.tool_tester = ''
      this.formRapid.test_result = ''
      this.$emit('closeDialog', true)
    },
    async handleSave() {
      const valid = await this.$refs.observer.validate()
      if (!valid) {
        return
      }
      this.loading = true
      delete this.formRapid._id
      if (this.formRapid.tool_tester === 'PCR') {
        this.formRapid.rdt_to = null
      } else {
        this.formRapid.swab_to = null
      }
      const updateFinalRDT = {
        id: this.idResult,
        data: this.formRapid
      }

      const response = await this.$store.dispatch('rdt/updateRDT', updateFinalRDT)
      this.loading = false
      if (response && (response.status === 200 || response.status === 201)) {
        await this.$store.dispatch('toast/successToast', this.$t('success.data_success_edit'))
      } else {
        await this.$store.dispatch('toast/errorToast', this.$t('error.data_failed_edit'))
      }
      this.formRapid.tool_tester = ''
      this.formRapid.test_result = ''
      this.$emit('closeDialog', true)
    },
    handleChangeLocationNow(value) {
      if (value === 'LAINNYA') {
        this.formRapid.test_location = null
        this.formRapid.lab = null
        this.formRapid.test_address_district_code = this.districtCode
        this.formRapid.test_address_district_name = this.districtName
      } else {
        if (value !== 'LAB') this.formRapid.lab = null
        this.formRapid.test_address_district_code = ''
        this.formRapid.test_address_district_name = ''
        this.formRapid.test_address_subdistrict_code = ''
        this.formRapid.test_address_subdistrict_name = ''
        this.formRapid.test_address_village_code = ''
        this.formRapid.test_address_village_name = ''
        this.formRapid.test_address_detail = ''
        this.formRapid.test_other_location = ''
        this.formRapid.test_location = null
      }
    },
    onSelectHospital(value) {
      this.formRapid.test_location = value
    },
    handleChangeDate(value) {
      this.testDate = value
      this.formRapid.test_date = value
    }
  }
}
</script>
<style scoped>
.section-title {
  color: #43A047;
}
</style>
