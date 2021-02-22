<template>
  <v-dialog v-model="show" max-width="70%">
    <v-card>
      <v-container>
        <v-row>
          <v-col cols="12" md="6" sm="12">
            <div class="title ml-2">{{ titleDetail }}</div>
          </v-col>
        </v-row>
        <v-row>
          <v-card class="mt-5 pa-7 ml-5 mr-5" outlined width="100%">
            <h4 class="font-weight-bold section-title">{{ $t('label.rdt_participant_detail') }}</h4>
            <v-divider />
            <detail-test
              :detail-test="detailTest"
              :birth-date.sync="birthDate"
              :test-date.sync="testDate"
              :detail-gender.sync="detailGender"
              :detail-case.sync="detailCase"
              :detail-addres.sync="detailAddres"
              :test-addres.sync="testAddres"
            />
          </v-card>
          <v-card class="mt-5 pa-7 ml-5 mr-5" outlined width="100%">
            <h4 class="font-weight-bold section-title">{{ $t('label.test_results') }}</h4>
            <v-divider />
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
                          :key="formHistoryTest.tool_tester"
                          v-model="formHistoryTest.tool_tester"
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
                        v-if="formHistoryTest.tool_tester === 'RDT'"
                        v-slot="{ errors }"
                        rules="required"
                      >
                        <label class="required">{{ $t('label.sampling') }}</label>
                        <v-radio-group
                          v-model="formHistoryTest.sampling_type"
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
                          v-model="formHistoryTest.final_result"
                          :error-messages="errors"
                          class="ml-3"
                          row
                        >
                          <v-row
                            v-if="formHistoryTest.tool_tester === 'PCR'"
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
                        v-if="formHistoryTest.tool_tester"
                        v-slot="{ errors }"
                        rules="required|numeric"
                        class="full-width"
                      >
                        <label class="required">{{ formHistoryTest.tool_tester === 'PCR' ? $t('label.swab_count') : $t('label.rdt_count') }}</label>
                        <v-text-field
                          v-if="formHistoryTest.tool_tester === 'PCR'"
                          v-model="formHistoryTest.swab_to"
                          :error-messages="errors"
                          solo-inverted
                          type="number"
                        />
                        <v-text-field
                          v-else
                          v-model="formHistoryTest.rdt_to"
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
                          v-model="formHistoryTest.test_location_type"
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
                        v-if="formHistoryTest.test_location_type === 'RS'"
                        v-slot="{ errors }"
                        rules="required"
                      >
                        <v-autocomplete
                          v-model="formHistoryTest.test_location"
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
                        v-if="formHistoryTest.test_location_type === 'LAB'"
                        v-slot="{ errors }"
                        rules="required"
                      >
                        <v-autocomplete
                          v-model="formHistoryTest.lab"
                          :no-data-text="$t('label.data_not_available')"
                          :return-object="false"
                          :error-messages="errors"
                          :label="$t('label.choose_place_test')"
                          :items="listLab"
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
                        v-if="formHistoryTest.test_location_type === 'LAINNYA'"
                        v-slot="{ errors }"
                      >
                        <v-text-field
                          v-model="formHistoryTest.test_other_location"
                          :error-messages="errors"
                          :placeholder="$t('label.input_name_place')"
                          solo-inverted
                        />
                      </ValidationProvider>
                      <div v-if="formHistoryTest.test_location_type === 'LAINNYA'">
                        <address-region
                          v-model="formHistoryTest.test_address_district_name"
                          :district-code="formHistoryTest.test_address_district_code"
                          :district-name="formHistoryTest.test_address_district_name"
                          :code-district.sync="formHistoryTest.test_address_district_code"
                          :name-district.sync="formHistoryTest.test_address_district_name"
                          :sub-district-code="formHistoryTest.test_address_subdistrict_code"
                          :sub-district-name="formHistoryTest.test_address_subdistrict_name"
                          :code-sub-district.sync="formHistoryTest.test_address_subdistrict_code"
                          :name-sub-district.sync="formHistoryTest.test_address_subdistrict_name"
                          :village-code="formHistoryTest.test_address_village_code"
                          :village-name="formHistoryTest.test_address_village_name"
                          :code-village.sync="formHistoryTest.test_address_village_code"
                          :name-village.sync="formHistoryTest.test_address_village_name"
                          :disabled-address="false"
                          :required-address="true"
                        />
                      </div>
                      <label v-if="formHistoryTest.test_location_type === 'LAINNYA'">
                        {{ $t('label.complete_address_place_testing') }}
                      </label>
                      <v-textarea
                        v-if="formHistoryTest.test_location_type === 'LAINNYA'"
                        v-model="formHistoryTest.test_address_detail"
                        solo
                      />
                      <label>{{ $t('label.additional_information') }}</label>
                      <v-textarea
                        v-model="formHistoryTest.test_note"
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
          </v-card>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { formatDatetime } from '@/utils/parseDatetime'
import { completeAddress } from '@/utils/utilsFunction'
import EventBus from '@/utils/eventBus'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { mapGetters } from 'vuex'

export default {
  name: 'DialogUpdateHistoryTest',
  components: {
    ValidationProvider,
    ValidationObserver
  },
  props: {
    showDialogUpdateTest: {
      type: Boolean,
      default: false
    },
    titleDetail: {
      type: String,
      default: ''
    },
    detailTest: {
      type: Object,
      default: null
    },
    formHistoryTest: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      show: this.showDialogUpdateTest,
      birthDate: '',
      testDate: '',
      detailGender: '',
      detailCase: '',
      detailAddres: '',
      testAddres: '',
      loading: false,
      formatDate: 'YYYY-MM-DD',
      listLab: [],
      isInitialState: true,
      districtCode: null,
      districtName: null
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
    showDialogUpdateTest(value) {
      this.show = value
    },
    show(value) {
      this.$emit('update:show', value)
    },
    async detailTest(value) {
      this.detailCase = (await value.id_case)
        ? value.id_case.toUpperCase()
        : ''
      if (value.birth_date) {
        this.birthDate = await formatDatetime(
          value.birth_date,
          'DD MMMM YYYY'
        )
      }
      if (value.test_date) {
        this.testDate = await formatDatetime(
          value.test_date,
          'DD MMMM YYYY'
        )
      }
      this.detailGender =
        (await value.gender) === 'L'
          ? this.$t('label.male')
          : this.$t('label.female')
      this.detailAddres = this.completeAddress(
        value.address_district_name,
        value.address_subdistrict_name,
        value.address_village_name,
        value.address_street
      )
      this.testAddres = this.completeAddress(
        value.test_address_district_name,
        value.test_address_subdistrict_name,
        value.test_address_village_name,
        value.test_address_detail
      )
    },
    'formHistoryTest.tool_tester'(value) {
      if (this.formHistoryTest) {
        if (value === 'PCR') this.formHistoryTest.sampling_type = null
      }
    }
  },
  async mounted() {
    const listQuery = {
      city_code: this.district_user
    }
    await this.$store.dispatch('region/getListHospital', listQuery)
    const responseLab = await this.$store.dispatch('rdt/getLabList')
    this.listLab = responseLab.data
    const paramHospitalWestJava = { 'rs_jabar': true }
    await this.$store.dispatch('region/getListHospital', paramHospitalWestJava)
    this.districtCode = this.formHistoryTest.test_address_district_code
    this.districtName = this.formHistoryTest.test_address_district_name
  },
  methods: {
    formatDatetime,
    completeAddress,
    handleBack(value) {
      if (value) {
        this.$emit('update:show', false)
      }
    },
    async handleSave() {
      const valid = await this.$refs.observer.validate()
      if (!valid) {
        return
      }
      this.loading = true
      delete this.formHistoryTest._id
      if (this.formHistoryTest.tool_tester === 'PCR') {
        this.formHistoryTest.rdt_to = null
      } else {
        this.formHistoryTest.swab_to = null
      }
      const updateFinalRDT = {
        id: this.detailTest._id,
        data: this.formHistoryTest
      }

      const response = await this.$store.dispatch('rdt/updateRDT', updateFinalRDT)
      this.loading = false
      if (response && (response.status === 200 || response.status === 201)) {
        await this.$store.dispatch('toast/successToast', this.$t('success.data_success_edit'))
      } else {
        await this.$store.dispatch('toast/errorToast', this.$t('error.data_failed_edit'))
      }
      this.$emit('update:show', false)
      EventBus.$emit('refreshPageListTest', true)
    },
    handleChangeLocationNow(value) {
      if (value === 'LAINNYA') {
        this.formHistoryTest.test_location = null
        this.formHistoryTest.lab = null
        this.formHistoryTest.test_address_district_code = this.districtCode
        this.formHistoryTest.test_address_district_name = this.districtName
      } else {
        if (value !== 'LAB') this.formHistoryTest.lab = null
        this.formHistoryTest.test_address_district_code = ''
        this.formHistoryTest.test_address_district_name = ''
        this.formHistoryTest.test_address_subdistrict_code = ''
        this.formHistoryTest.test_address_subdistrict_name = ''
        this.formHistoryTest.test_address_village_code = ''
        this.formHistoryTest.test_address_village_name = ''
        this.formHistoryTest.test_address_detail = ''
        this.formHistoryTest.test_other_location = ''
        this.formHistoryTest.test_location = null
      }
    },
    onSelectHospital(value) {
      this.formHistoryTest.test_location = value
    },
    handleChangeDate(value) {
      this.testDate = value
      this.formHistoryTest.test_date = value
    }
  }
}
</script>
<style scoped>
.section-title {
  color: #43a047;
}
</style>
