<template>
  <v-container>
    <v-row class="mt-n6">
      <v-col cols="12" md="12" sm="12">
        <v-row>
          <v-col cols="12" md="6" sm="12">
            <div class="title">{{ $t('label.case_id') }}</div>
          </v-col>
          <v-col auto />
        </v-row>
        <v-row>
          <v-col cols="12" md="3" sm="12">
            <label>{{ $t('label.results_test_code') }}</label>
          </v-col>
          <v-col auto>
            <v-text-field v-model="detailData.code_test" disabled hide-details solo-inverted />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="3" sm="12">
            <label>{{ $t('label.case_id') }}</label>
          </v-col>
          <v-col auto>
            <v-text-field v-model="detailData.id_case" disabled hide-details solo-inverted />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6" sm="12">
            <div class="title">{{ $t('label.category_or_target') }}</div>
          </v-col>
          <v-col auto />
        </v-row>
        <v-row>
          <v-col cols="12" md="3" sm="12">
            <label>{{ $t('label.goals') }}</label>
          </v-col>
          <v-col auto>
            <v-text-field v-model="detailData.target" disabled hide-details solo-inverted />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12" sm="12">
        <v-row>
          <v-col cols="12" md="6" sm="12">
            <div class="title">{{ $t('label.identity') }}</div>
          </v-col>
          <v-col auto />
        </v-row>
        <v-row>
          <v-col cols="12" md="3" sm="12">
            <label>{{ $t('label.nik') }}</label>
          </v-col>
          <v-col auto>
            <v-text-field v-model="detailData.nik" disabled hide-details solo-inverted />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="3" sm="12">
            <label>{{ $t('label.participant_name') }}</label>
          </v-col>
          <v-col auto>
            <v-text-field v-model="detailData.name" disabled hide-details solo-inverted />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="3" sm="12">
            <label>{{ $t('label.birth_date') }}</label>
          </v-col>
          <v-col auto>
            <v-text-field v-model="birthDate" disabled hide-details solo-inverted />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="3" sm="12">
            <label>{{ $t('label.age') }}</label>
          </v-col>
          <v-col auto>
            <v-text-field v-model="detailData.age" disabled hide-details solo-inverted />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="3" sm="12">
            <label>{{ $t('label.gender') }}</label>
          </v-col>
          <v-col auto>
            <v-text-field v-model="detailGender" disabled hide-details solo-inverted />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="3" sm="12">
            <label>{{ $t('label.phone_number') }}</label>
          </v-col>
          <v-col auto>
            <v-text-field v-model="detailData.phone_number" disabled hide-details solo-inverted />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="3" sm="12">
            <label>{{ $t('label.address') }}</label>
          </v-col>
          <v-col auto>
            <v-textarea v-model="detailAddres" disabled hide-details solo-inverted />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="3" sm="12">
            <label>{{ $t('label.citizenship') }}</label>
          </v-col>
          <v-col auto>
            <v-text-field v-model="detailData.nationality" disabled hide-details solo-inverted />
          </v-col>
        </v-row>
        <v-row v-if="detailData.nationality === 'WNA'">
          <v-col cols="12" md="3" sm="12">
            <label>{{ $t('label.country') }}</label>
          </v-col>
          <v-col auto>
            <v-text-field
              v-model="detailData.nationality_name"
              disabled
              hide-details
              solo-inverted
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { formatDatetime } from '@/utils/parseDatetime'
import { completeAddress } from '@/utils/utilsFunction'

export default {
  name: 'ParticipantDetail',
  props: {
    titleDetail: {
      type: String,
      default: null
    },
    idData: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      panelListRiwayat: [0],
      birthDate: '',
      testDate: '',
      detailGender: '',
      detailCase: '',
      detailData: '',
      detailAddres: '',
      testAddres: ''
    }
  },
  watch: {
    idData(value) {
      this.idData = value
      this.getParticipantDetail()
    }
  },
  created() {
    this.getParticipantDetail()
  },
  methods: {
    async getParticipantDetail() {
      const response = await this.$store.dispatch(
        'rdt/detailParticipant',
        this.idData
      )
      this.detailData = await response.data
      this.detailCase = (await response.data.id_case)
        ? response.data.id_case.toUpperCase()
        : ''
      if (this.detailData) {
        if (this.detailData.birth_date) {
          this.birthDate = await formatDatetime(
            this.detailData.birth_date,
            'DD MMMM YYYY'
          )
        }
        if (this.detailData.test_date) {
          this.testDate = await formatDatetime(
            this.detailData.test_date,
            'DD MMMM YYYY'
          )
        }
        this.detailGender =
          (await this.detailData.gender) === 'L'
            ? this.$t('label.male')
            : this.$t('label.female')
        this.detailAddres = this.completeAddress(
          this.detailData.address_district_name,
          this.detailData.address_subdistrict_name,
          this.detailData.address_village_name,
          this.detailData.address_street
        )
        this.testAddres = this.completeAddress(
          this.detailData.test_address_district_name,
          this.detailData.test_address_subdistrict_name,
          this.detailData.test_address_village_name,
          this.detailData.test_address_detail
        )
      }
    },
    formatDatetime,
    completeAddress,
    getTableRowNumbering(index) {
      return index + 1
    },
    backList() {
      this.$router.push('/rdt/list')
    }
  }
}
</script>

<style scoped>
.row-detail {
  padding-left: 2rem;
  padding-right: 2rem;
}
.row-detail-label {
  margin: auto;
}
</style>
