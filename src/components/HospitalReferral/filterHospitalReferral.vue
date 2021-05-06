<template>
  <v-container>
    <v-form
      ref="form"
      lazy-validation
    >
      <v-row class="filter-row">
        <v-col
          v-if="unitType === 'rumahsakit' && typeReferral === 'in'"
          cols="12"
          sm="3"
        >
          <v-label class="title">{{ $t('label.origin_reference') }}:</v-label>
          <v-autocomplete
            v-model="listQuery.transfer_from_unit_id"
            :items="unitList"
            :loading="isUnitLoading"
            :search-input.sync="searchUnit"
            :return-object="false"
            menu-props="auto"
            item-text="name"
            item-value="_id"
            single-line
            solo
            autocomplete
          />
        </v-col>
        <v-col
          v-if="unitType === 'puskesmas' || typeReferral === 'out'"
          cols="12"
          sm="3"
        >
          <v-label class="title">{{ $t('label.reference_place') }}:</v-label>
          <v-autocomplete
            v-model="listQuery.transfer_to_unit_id"
            :items="unitList"
            :loading="isUnitLoading"
            :search-input.sync="searchUnit"
            :return-object="false"
            menu-props="auto"
            item-text="name"
            item-value="_id"
            single-line
            solo
            autocomplete
          />
        </v-col>
        <v-col cols="12" sm="3">
          <v-label class="title">{{ $t('label.criteria') }}:</v-label>
          <v-select
            v-model="listQuery.status"
            :items="stagesList"
            :placeholder="$t('label.choose_criteria')"
            solo
          />
        </v-col>
        <v-col cols="12" sm="3">
          <v-label class="title">{{ $t('label.results') }}:</v-label>
          <v-select
            v-model="listQuery.final_result"
            :items="resultList"
            :placeholder="$t('label.choose_results')"
            solo
            item-text="label"
            item-value="value"
          />
        </v-col>
        <v-col cols="12" sm="3">
          <v-label class="title">{{ $t('label.referral_date') }}:</v-label>
          <input-date-picker
            :format-date="formatDate"
            :label="$t('label.choose_date')"
            :date-value="listQuery.createdAt"
            :value-date.sync="listQuery.createdAt"
            @changeDate="listQuery.createdAt = $event"
          />
        </v-col>
      </v-row>
      <v-row class="filter-row">
        <v-col cols="12" sm="9" class="reduce-padding-top">
          <v-label>{{ $t('label.patient_residential_address') }}</v-label>
          <address-region
            :disabled-district="disabledDistrict"
            :district-code="listQuery.address_district_code"
            :district-name="district_name_user"
            :code-district.sync="listQuery.address_district_code"
            :sub-district-code="listQuery.address_subdistrict_code"
            :code-sub-district.sync="listQuery.address_subdistrict_code"
            :village-code="listQuery.address_village_code"
            :code-village.sync="listQuery.address_village_code"
            :village-name="nameVillage"
            :name-village.sync="nameVillage"
            :disabled-address="false"
            :required-address="false"
            :is-label="false"
          />
        </v-col>
        <v-col
          v-if="unitType === 'rumahsakit'"
          cols="12"
          sm="3"
        >
          <v-label class="title">{{ $t('label.reference_status') }}:</v-label>
          <v-select
            v-model="listQuery.transfer_status"
            :items="statusList"
            :placeholder="$t('label.reference_status')"
            solo
            item-text="label"
            item-value="value"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="8" />
        <v-col class="pt-0 float-right">
          <v-btn
            block
            color="#4f4f4f"
            class="btn-reset"
            @click="onReset"
          >
            {{ $t('label.reset') }}
          </v-btn>
        </v-col>
        <v-col class="pt-0">
          <v-btn
            block
            color="success"
            class="btn-search"
            @click="onSearch"
          >
            {{ $t('label.look_for_it') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import EventBus from '@/utils/eventBus'

export default {
  name: 'FilterHospitalReferral',
  props: {
    listQuery: {
      type: Object,
      default: null
    },
    typeReferral: {
      type: String,
      default: null
    },
    onSearch: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      formatDate: 'YYYY/MM/DD',
      disabledDistrict: false,
      codeDistrict: '',
      nameVillage: '',
      unitList: [],
      searchUnit: null,
      queryUnit: {
        search: ''
      },
      isUnitLoading: false,
      stagesList: [
        'OTG',
        'ODP',
        'PDP',
        'POSITIF'
      ],
      statusList: [
        {
          label: this.$t('label.received'),
          value: 'approved'
        },
        {
          label: this.$t('label.rejected'),
          value: 'declined'
        },
        {
          label: this.$t('label.waiting'),
          value: 'pending'
        }
      ],
      resultList: [
        {
          label: this.$t('label.negatif'),
          value: 0
        },
        {
          label: this.$t('label.recovery'),
          value: 1
        },
        {
          label: this.$t('label.dead'),
          value: 2
        }
      ]
    }
  },
  computed: {
    ...mapGetters('user', [
      'roles',
      'district_user',
      'district_name_user',
      'unitType'
    ])
  },
  watch: {
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
  },
  methods: {
    onReset() {
      this.listQuery.address_district_code = ''
      this.listQuery.address_subdistrict_code = ''
      this.listQuery.address_village_code = ''
      this.listQuery.search = ''
      this.listQuery.transfer_to_unit_id = ''
      this.listQuery.transfer_from_unit_id = ''
      this.listQuery.status = ''
      this.listQuery.final_result = ''
      this.listQuery.createdAt = ''
      this.$refs.form.reset()
      EventBus.$emit('refreshPageListReferral', true)
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
  .btn-reset {
    height: 46px !important;
    color: white !important;
  }
  .btn-search {
    height: 46px !important;
  }
</style>
