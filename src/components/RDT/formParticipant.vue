<template>
  <div>
    <ValidationObserver ref="observer">
      <v-form
        ref="form"
        lazy-validation
      >
        <v-row>
          <v-col>
            <label>{{ $t('label.search_patient_by_name_nik') }}</label>
            <autocomplete-cases
              :on-select-case="onSelectCase"
              @handle-source-data-info="handleSourceDataInfo"
            />
          </v-col>
        </v-row>
        <h4 class="font-weight-bold" style="color:#43A047">
          {{ $t('label.patient_personal_data') }}
        </h4>
        <v-divider />
        <v-alert
          v-if="isSearchParticipant"
          dense
          type="info"
        >
          {{ $t('label.rdt_source_data_participant') }} <strong>{{ sourceData }}</strong>
        </v-alert>
        <v-row>
          <v-col
            cols="12"
            md="6"
            sm="12"
          >
            <ValidationProvider
              v-slot="{ errors }"
              rules="required|isHtml"
            >
              <label class="required">{{ $t('label.patient_name') }}</label>
              <v-text-field
                v-model="formRapid.name"
                :error-messages="errors"
                solo-inverted
              />
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors }"
              :rules="isNikNull ? 'numeric' : 'required|numeric|sixteenDigits'"
            >
              <label :class="!isNikNull ? 'required' : ''">{{ $t('label.nik') }}</label>
              <v-text-field
                v-model="formRapid.nik"
                :error-messages="errors"
                solo-inverted
              />
            </ValidationProvider>
            <v-checkbox
              v-model="isNikNull"
              :label="$t('label.do_not_have_nik')"
              class="mt-0 pt-0"
            />
            <ValidationProvider
              v-if="isNikNull"
              v-slot="{ errors }"
              rules="required"
            >
              <label class="required">{{ $t('label.reason_do_not_have_nik') }}</label>
              <v-text-field
                v-model="formRapid.note_nik"
                :error-messages="errors"
                solo-inverted
              />
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors }"
              rules="required"
            >
              <label class="required">{{ $t('label.gender') }}</label>
              <v-radio-group
                v-model="formRapid.gender"
                :error-messages="errors"
                row
              >
                <v-radio
                  :label="$t('label.male')"
                  value="L"
                />
                <v-radio
                  :label="$t('label.female')"
                  value="P"
                />
              </v-radio-group>
            </ValidationProvider>
            <label>{{ $t('label.birth_date') }}</label>
            <select-datetime
              :datetime="formRapid.birth_date"
              :date-time.sync="formRapid.birth_date"
              :formate-date="formatDate"
            />
            <ValidationProvider
              v-slot="{ errors }"
              rules="required|isHtml"
            >
              <label class="required">{{ $t('label.age') }}</label>
              <v-text-field
                v-model="formRapid.age"
                :error-messages="errors"
                min="0"
                solo-inverted
                type="number"
              />
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors }"
              rules="required"
            >
              <label class="required">{{ $t('label.goals') }}</label>
              <v-select
                v-model="formRapid.target"
                :error-messages="errors"
                :return-object="false"
                :items="targetOptions"
                item-text="label"
                item-value="targets"
                solo
              />
            </ValidationProvider>
          </v-col>
          <v-col
            cols="12"
            md="6"
            sm="12"
          >
            <ValidationProvider
              v-slot="{ errors }"
              :rules="isPhoneNumberNull ? 'isPhoneNumber' : 'required|isPhoneNumber'"
            >
              <label :class="!isPhoneNumberNull ? 'required' : ''">{{ $t('label.phone_number') }}</label>
              <v-text-field
                v-model="formRapid.phone_number"
                :error-messages="errors"
                placeholder="08xxxxxxxxx"
                solo-inverted
                type="number"
              />
            </ValidationProvider>
            <v-checkbox
              v-model="isPhoneNumberNull"
              :label="$t('label.do_not_have_phone_number')"
              class="mt-0 pt-0"
            />
            <ValidationProvider
              v-if="isPhoneNumberNull"
              v-slot="{ errors }"
              rules="required"
            >
              <label class="required">{{ $t('label.reason_do_not_have_phone_number') }}</label>
              <v-text-field
                v-model="formRapid.note_phone_number"
                :error-messages="errors"
                solo-inverted
              />
            </ValidationProvider>
            <label class="required">{{ $t('label.address_home') }}</label>
            <address-region
              v-model="formRapid.address_district_name"
              :district-code="formRapid.address_district_code"
              :district-name="formRapid.address_district_name"
              :code-district.sync="formRapid.address_district_code"
              :name-district.sync="formRapid.address_district_name"
              :sub-district-code="formRapid.address_subdistrict_code"
              :sub-district-name="formRapid.address_subdistrict_name"
              :code-sub-district.sync="formRapid.address_subdistrict_code"
              :name-sub-district.sync="formRapid.address_subdistrict_name"
              :village-code="formRapid.address_village_code"
              :village-name="formRapid.address_village_name"
              :code-village.sync="formRapid.address_village_code"
              :name-village.sync="formRapid.address_village_name"
              :disabled-address="false"
              :required-address="true"
            />
            <ValidationProvider>
              <label>{{ $t('label.address_complete_home') }}</label>
              <v-textarea
                v-model="formRapid.address_street"
                solo
              />
            </ValidationProvider>
            <v-row class="mx-0">
              <ValidationProvider
                v-slot="{ errors }"
                rules="required"
              >
                <label class="required">{{ $t('label.citizenship') }}</label>
                <v-radio-group
                  v-model="formRapid.nationality"
                  :error-messages="errors"
                  row
                  @change="handleChangeNationality"
                >
                  <v-radio
                    :label="$t('label.wni')"
                    value="WNI"
                  />
                  <v-radio
                    :label="$t('label.wna')"
                    value="WNA"
                  />
                </v-radio-group>
              </ValidationProvider>
              <ValidationProvider
                v-if="formRapid.nationality === 'WNA'"
                v-slot="{ errors }"
                rules="required"
              >
                <br>
                <v-autocomplete
                  v-model="formRapid.nationality_name"
                  :items="listCountry"
                  item-text="name"
                  item-value="name"
                  :error-messages="errors"
                  :placeholder="$t('label.country_origin')"
                  clearable
                  solo-inverted
                />
              </ValidationProvider>
            </v-row>
          </v-col>
        </v-row>
      </v-form>
    </ValidationObserver>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { mapGetters } from 'vuex'

export default {
  name: 'FormParticipant',
  components: {
    ValidationProvider,
    ValidationObserver
  },
  props: {
    formRapid: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      listCountry: [],
      formatDate: 'YYYY/MM/DD',
      targetOptions: [],
      mechanismOptions: [
        'Door to door',
        'Faskes',
        'Drive-Thru'
      ],
      categoryItems: [
        {
          label: 'Kategori A',
          value: 'A'
        },
        {
          label: 'Kategori B',
          value: 'B'
        },
        {
          label: 'Kategori C',
          value: 'C'
        }
      ],
      isNikNull: false,
      isPhoneNumberNull: false,
      isSearchParticipant: false,
      sourceData: null
    }
  },
  computed: {
    ...mapGetters('user', [
      'district_user'
    ])
  },
  async mounted() {
    const response = await this.$store.dispatch('region/listCountry')
    this.listCountry = response.data
    const responseTarget = await this.$store.dispatch('rdt/getTargetList')
    this.targetOptions = responseTarget.data
  },
  methods: {
    async onChangeCategory(value, isODP) {
      const response = await this.$store.dispatch('rdt/getListTarget', value)
      this.targetOptions = response.data
      if (isODP === 'ODP') {
        this.formRapid.target = this.targetOptions[0].targets
      }
    },
    handleChangeNationality(value) {
      if (value === 'WNI') {
        this.formRapid.nationality_name = ''
      }
    },
    async onSelectCase(value) {
      if (value) {
        const getEndSearch = value.indexOf('/')
        const getName = value.slice(0, getEndSearch)
        const listQuery = {
          address_district_code: this.district_user,
          search: getName
        }
        const response = await this.$store.dispatch('rdt/getDetailRegister', listQuery)
        this.formRapid.target = (response.data.source_data === 'internal') ? response.data.status : null
        this.isSearchParticipant = true
        this.sourceData = response.data.source_data === 'internal' ? this.$t('label.rdt_case_report') : response.data.source_data === 'external' ? this.$t('label.rdt_pikobar_registration') : ''
        await Object.assign(this.formRapid, response.data)
        this.formRapid.address_street = response.data.address_detail
      }
    },
    handleSourceDataInfo(value) {
      this.isSearchParticipant = value
    }
  }
}
</script>

