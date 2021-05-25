<template>
  <div>
    <v-form
      ref="form"
      lazy-validation
    >
      <v-container>
        <v-row class="filter-row" style="margin-top: -40px;">
          <v-col cols="12" sm="12">
            <br>
            <v-text-field
              v-model="listQuery.search"
              :label="$t('label.search')"
              solo
              prepend-inner-icon="search"
            />
          </v-col>
        </v-row>
        <v-row class="filter-row">
          <v-col cols="12" sm="6">
            <v-label class="title">{{ $t('label.test_result') }}:</v-label>
            <v-select
              v-model="listQuery.final_result"
              :items="resultCheckList"
              solo
              item-text="label"
              item-value="value"
            />
          </v-col>
          <!-- Sementara field mekanisme di hide -->
          <!-- <v-col cols="12" sm="4">
            <v-label class="title">{{ $t('label.mechanism') }}:</v-label>
            <v-select
              v-model="listQuery.mechanism"
              :items="mechanismOptions"
              solo
            />
          </v-col> -->
          <v-col cols="12" sm="6">
            <v-label class="title">{{ $t('label.method_used') }}:</v-label>
            <v-select
              v-model="listQuery.tool_tester"
              :items="methodsOptions"
              solo
              item-text="label"
              item-value="value"
            />
          </v-col>
          <v-col v-if="roles[0] === 'dinkesprov'" cols="12" sm="3">
            <v-label class="title">{{ $t('label.test_place') }}:</v-label>
            <select-area-district-city
              :district-city="districtCity"
              :city-district.sync="districtCity"
              :on-select-district="onSelectDistrict"
            />
          </v-col>
        </v-row>
        <v-row>
          <!-- Sementara field kategori di hide -->
          <!-- <v-col cols="12" sm="3">
            <v-label class="title">{{ $t('label.goal_category') }}:</v-label>
            <v-select
              v-model="listQuery.category"
              :items="categoryList"
              solo
              item-text="label"
              item-value="value"
            />
          </v-col> -->
          <v-col cols="12" sm="4">
            <v-label class="title">{{ $t('label.inspection_date') }}:</v-label>
            <input-date-picker
              :format-date="formatDate"
              :label="$t('label.start_date')"
              :date-value="listQuery.start_date"
              :value-date.sync="listQuery.start_date"
              @changeDate="listQuery.start_date = $event"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <br>
            <input-date-picker
              :format-date="formatDate"
              :label="$t('label.end_date')"
              :date-value="listQuery.end_date"
              :value-date.sync="listQuery.end_date"
              @changeDate="listQuery.end_date = $event"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <br>
            <v-row>
              <v-col class="pt-0">
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
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'FilterTestResult',
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
      formatDate: 'YYYY/MM/DD',
      districtCity: {
        kota_kode: ''
      },
      methodsOptions: [
        'RDT',
        'PCR'
      ],
      mechanismOptions: [
        'Door to door',
        'Faskes',
        'Drive-Thru'
      ],
      categoryList: [
        { label: 'Kategori A', value: 'A' },
        { label: 'Kategori B', value: 'B' },
        { label: 'Kategori C', value: 'C' }
      ],
      resultCheckList: [
        { label: 'Negatif', value: 'NEGATIF' },
        { label: 'Positif', value: 'POSITIF' },
        { label: 'Invalid', value: 'INVALID' },
        { label: 'Inkonklusif', value: 'INKONKLUSIF' },
        { label: 'Reaktif', value: 'REAKTIF' },
        { label: 'Non Reaktif', value: 'NON REAKTIF' }
      ]
    }
  },
  computed: {
    ...mapGetters('user', [
      'roles'
    ])
  },
  methods: {
    onSelectDistrict(value) {
      this.listQuery.address_district_code = value.kota_kode
    },
    onReset() {
      this.listQuery.search = ''
      this.listQuery.final_result = ''
      this.listQuery.mechanism = ''
      this.listQuery.tool_tester = ''
      this.listQuery.category = ''
      this.listQuery.address_district_code = ''
      this.listQuery.start_date = ''
      this.listQuery.end_date = ''
      this.$refs.form.reset()
      this.$store.dispatch('rdt/getListRDT', this.listQuery)
    }
  }
}
</script>
<style scoped>
  .filter-row {
    margin-bottom: -20px;
  }
  .btn-reset {
    height: 46px !important;
    color: white !important;
  }
  .btn-search {
    height: 46px !important;
  }
</style>
