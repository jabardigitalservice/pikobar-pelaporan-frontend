<template>
  <v-row justify="center">
    <v-dialog v-model="show" :fullscreen="$vuetify.breakpoint.xs" max-width="90%">
      <v-card>
        <v-card-title class="title">
          {{ $t('label.update_case_history') }}
          <v-spacer />
          <v-icon @click="show = false">mdi-close</v-icon>
        </v-card-title>
        <v-divider />
        <v-container fluid>
          <ValidationObserver ref="observer">
            <v-form
              ref="form"
              lazy-validation
            >
              <v-row>
                <v-col auto>
                  <v-expansion-panels
                    v-model="panelRiwayat"
                    multiple
                  >
                    <v-expansion-panel>
                      <v-expansion-panel-header class="font-weight-bold text-lg">
                        {{ $t('label.form_case_history_title') }}
                      </v-expansion-panel-header>
                      <v-divider />
                      <v-expansion-panel-content>
                        <form-case-history :form-pasien.sync="formRiwayatPasien" />
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-col>
              </v-row>
              <v-container fluid>
                <v-row>
                  <v-col>
                    <v-btn
                      :loading="loading"
                      bottom
                      block
                      @click="handleCancel"
                    >
                      {{ $t('label.cancel') }}
                    </v-btn>
                  </v-col>
                  <v-col>
                    <v-btn
                      :loading="loading"
                      class="ml-2"
                      color="success"
                      bottom
                      block
                      @click="handleSaveHistory"
                    >
                      {{ $t('label.update_history') }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </ValidationObserver>
        </v-container>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { ValidationObserver } from 'vee-validate'
import { ResponseRequest } from '@/utils/constantVariable'
import {
  symptomOptions,
  answerList,
  yesOrNoAnswer,
  additionalConditionOptions
} from '@/utils/constantOption'
import { validateScrollUp } from '@/utils/utilsFunction'
import { mapGetters } from 'vuex'
import EventBus from '@/utils/eventBus'

export default {
  name: 'DialogUpdateHistoryCase',
  components: {
    ValidationObserver
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    formRiwayatPasien: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      show: this.showDialog,
      hospitalWestJavaList: [],
      hospitalNonWestJavaList: [],
      formatDate: 'YYYY/MM/DD',
      panelRiwayat: [0],
      panelListRiwayat: [0],
      disabledReportResource: false,
      arrayRegion: null,
      symptomOptions,
      additionalConditionOptions,
      answerList,
      yesOrNoAnswer
    }
  },
  computed: {
    ...mapGetters('region', [
      'hospitalList'
    ]),
    ...mapGetters('user', [
      'roles',
      'fullName'
    ])
  },
  watch: {
    showDialog(value) {
      this.show = value
    },
    show(value) {
      this.$emit('update:show', value)
    }
  },
  async mounted() {
    const paramHospitalWestJava = { 'rs_jabar': true }
    const paramHospitalNonWestJava = { 'rs_jabar': false }
    const responseWestJava = await this.$store.dispatch('region/getListHospital', paramHospitalWestJava)
    const responseNonWestJava = await this.$store.dispatch('region/getListHospital', paramHospitalNonWestJava)
    this.hospitalWestJavaList = responseWestJava.data ? responseWestJava.data : []
    this.hospitalNonWestJavaList = responseNonWestJava.data ? responseNonWestJava.data : []

    if (this.roles[0] === 'faskes') {
      this.formRiwayatPasien.report_source = this.fullName
      this.disabledReportResource = true
    }
  },
  methods: {
    validateScrollUp,
    async handleSaveHistory() {
      const valid = await this.$refs.observer.validate()
      if (!valid) {
        this.validateScrollUp()
        return
      }
      this.loading = true
      let response
      const historyID = this.formRiwayatPasien._id
      delete this.formRiwayatPasien['_id']
      delete this.formRiwayatPasien['delete_status']
      delete this.formRiwayatPasien['deletedAt']
      delete this.formRiwayatPasien['deletedBy']
      if (!this.isEdit) {
        this.formRiwayatPasien.case = this.formRiwayatPasien.case._id
        response = await this.$store.dispatch('reports/createHistoryCase', this.formRiwayatPasien)
      } else {
        delete this.formRiwayatPasien['case']
        delete this.formRiwayatPasien['createdAt']
        delete this.formRiwayatPasien['updatedAt']
        const body = {
          idHistory: historyID,
          data: this.formRiwayatPasien
        }
        response = await this.$store.dispatch('reports/updateHistoryCase', body)
      }
      if (response.status !== ResponseRequest.UNPROCESSABLE) {
        await this.$store.dispatch('toast/successToast', this.$t('success.case_history_data_successfully_updated'))
        await this.$store.dispatch('reports/resetFormPasien')
        await this.$store.dispatch('reports/resetRiwayatFormPasien')
        this.loading = false
        delete this.formRiwayatPasien['address_district_code']
        delete this.formRiwayatPasien['address_subdistrict_code']
        delete this.formRiwayatPasien['address_village_code']
        delete this.formRiwayatPasien['address_village_name']
        delete this.formRiwayatPasien['address_street']
        this.$emit('update:show', false)
        EventBus.$emit('refreshPageListReport', true)
      } else {
        this.loading = false
        await this.$store.dispatch('toast/errorToast', this.$t('errors.data_failed_to_save'))
      }
    },
    async handleCancel() {
      await this.$store.dispatch('reports/resetFormPasien')
      await this.$store.dispatch('reports/resetRiwayatFormPasien')
      this.$emit('update:show', false)
    }
  }
}
</script>
