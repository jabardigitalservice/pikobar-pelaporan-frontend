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
          <v-tabs
            v-model="tab"
            background-color="#F5F5F5"
            centered
            hide-slider
            class="tab-detail-case"
          >
            <v-tab href="#tab-1">
              <v-icon class="mr-2">mdi-account</v-icon>
              {{ $t('label.rdt_participant_detail') }}
            </v-tab>

            <v-tab href="#tab-2">
              <v-icon class="mr-2">library_books</v-icon>
              {{ $t('label.rdt_history_test') }}
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item v-for="i in 2" :key="i" :value="'tab-' + i" class="tab-item">
              <v-card v-if="tab === 'tab-1'">
                <v-container>
                  <detail-test
                    :detail-test="detailTest"
                    :birth-date.sync="birthDate"
                    :test-date.sync="testDate"
                    :detail-gender.sync="detailGender"
                    :detail-case.sync="detailCase"
                    :detail-addres.sync="detailAddres"
                    :test-addres.sync="testAddres"
                  />
                </v-container>
              </v-card>
              <v-card v-if="tab === 'tab-2'">
                <v-container>
                  <stepper-history-list :list-history-test="listHistoryTest" />
                </v-container>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { formatDatetime } from '@/utils/parseDatetime'
import { completeAddress } from '@/utils/utilsFunction'

export default {
  name: 'DialogDetailHistoryTest',
  props: {
    showDialogDetailTest: {
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
    listHistoryTest: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      title: this.$t('label.rdt_participant'),
      tab: null,
      show: this.showDialogDetailTest,
      step: 0,
      altLabels: false,
      editable: false,
      birthDate: '',
      testDate: '',
      detailGender: '',
      detailCase: '',
      detailAddres: '',
      testAddres: ''
    }
  },
  watch: {
    showDialogDetailTest(value) {
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
    }
  },
  methods: {
    formatDatetime,
    completeAddress
  }
}
</script>
<style scoped>
.v-stepper__wrapper {
  height: auto !important;
}
.v-window.v-item-group.v-tabs-items {
  min-width: 100%;
}
.tab-detail-case {
  margin-left: 1.5rem;
  margin-right: 1.5rem;
  border-radius: 8px;
}
.v-tab {
  width: 50% !important;
  color: #828282 !important;
  max-width: 100% !important;
}
.v-tab--active {
  background: #27ae60 !important;
  border-radius: 8px !important;
  color: #ffffff !important;
}
.tab-item {
  min-width: 100%;
}
</style>
