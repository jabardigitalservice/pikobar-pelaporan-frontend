<template>
  <div>
    <ValidationObserver ref="observer">
      <v-form
        ref="form"
        lazy-validation
      >
        <v-row>
          <v-col>
            <label>{{ $t('label.search_participant_by_name_nik') }}</label>
            <autocomplete-cases
              :on-select-case="onSelectCase"
            />
          </v-col>
        </v-row>
        <h4 class="font-weight-bold" style="color:#43A047">
          {{ $t('label.participant_personal_data') }}
        </h4>
        <v-divider />
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
              <label class="required">{{ $t('label.category') }}</label>
              <v-select
                v-model="formRapid.category"
                :error-messages="errors"
                :items="categoryItems"
                item-text="label"
                item-value="value"
                solo
                @change="onChangeCategory"
              />
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors }"
              rules="required"
            >
              <label class="required">{{ $t('label.mechanism') }}</label>
              <v-select
                v-model="formRapid.mechanism"
                :error-messages="errors"
                :items="mechanismOptions"
                solo
              />
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors }"
              rules="numeric"
            >
              <label>{{ $t('label.nik') }}</label>
              <v-text-field
                v-model="formRapid.nik"
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
              <label class="required">{{ $t('label.citizenship') }}</label>
              <v-radio-group
                v-model="formRapid.nationality"
                :error-messages="errors"
                row
                @change="handleChangeNationality"
              >
                <v-radio label="WNI" value="WNI" />
                <v-radio label="WNA" value="WNA" />
              </v-radio-group>
            </ValidationProvider>
            <ValidationProvider
              v-if="formRapid.nationality === 'WNA'"
              v-slot="{ errors }"
              rules="required"
            >
              <v-text-field
                v-model="formRapid.nationality_name"
                :error-messages="errors"
                placeholder="Negara Asal"
                solo-inverted
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
              rules="required"
            >
              <label class="required">{{ $t('label.goals') }}</label>
              <v-select
                v-model="formRapid.target"
                :error-messages="errors"
                :return-object="false"
                :items="targetOptions"
                item-text="targets"
                item-value="targets"
                solo
              />
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors }"
              rules="required|isHtml"
            >
              <label class="required">{{ $t('label.participant_name') }}</label>
              <v-text-field
                v-model="formRapid.name"
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
            <ValidationProvider
              v-slot="{ errors }"
              rules="required|isPhoneNumber"
            >
              <label class="required">{{ $t('label.phone_number') }}</label>
              <v-text-field
                v-model="formRapid.phone_number"
                :error-messages="errors"
                placeholder="08xxxxxxxxx"
                solo-inverted
                type="number"
              />
            </ValidationProvider>
          </v-col>
        </v-row>
      </v-form>
    </ValidationObserver>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'

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
      ]
    }
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
      const getEndSearch = value.indexOf('/')
      const getName = value.slice(0, getEndSearch)
      const listQuery = {
        address_district_code: this.district_user,
        search: getName
      }
      const response = await this.$store.dispatch('rdt/getDetailRegister', listQuery)
      await Object.assign(this.formRapid, response.data)
      this.formRapid.address_street = response.data.address_detail
      if (this.formRapid.id_case) {
        this.formRapid.category = 'A'
        this.onChangeCategory(this.formRapid.category, 'ODP')
      } else {
        this.onChangeCategory(this.formRapid.category)
      }
    }
  }
}
</script>
