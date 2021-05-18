<template>
  <div>
    <v-card class="pa-1 mt-1 mx-auto header-detail-case">
      <v-row justify="space-between">
        <v-col cols="12" md="8" sm="8">
          <v-card-text class="font-weight-bold">
            <v-card-title class="pt-0 text-header-detail-case">
              {{ $t('label.part_one_of_two') }}
            </v-card-title>
            <v-card-subtitle class="text-sub-header-detail-case">
              {{ $t('label.fill_in_identity_criteria_and_clinical_information') }}
            </v-card-subtitle>
          </v-card-text>
        </v-col>
        <v-col cols="12" md="4" sm="4">
          <div
            class="background-card-survey-list-icon ml-12 ml-10"
          />
        </v-col>
      </v-row>
    </v-card>
    <ValidationObserver ref="observer">
      <v-row>
        <v-col auto>
          <v-expansion-panels
            v-model="volunteerPanel"
            multiple
          >
            <v-expansion-panel>
              <v-expansion-panel-header class="font-weight-bold text-lg">
                {{ $t('label.form_volunteer_title') }}
              </v-expansion-panel-header>
              <v-divider />
              <v-expansion-panel-content>
                <form-volunteer :form-pasien="formPasien" />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
      <v-row>
        <v-col auto>
          <v-expansion-panels
            v-model="patientPanel"
            multiple
          >
            <v-expansion-panel>
              <v-expansion-panel-header class="font-weight-bold text-lg">
                {{ $t('label.form_patient_title') }}
              </v-expansion-panel-header>
              <v-divider />
              <v-expansion-panel-content>
                <form-patient :form-pasien="formPasien" />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
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
                <form-case-history :form-pasien="formPasien" />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </ValidationObserver>
    <v-container fluid>
      <v-row class="survey-bottom-form">
        <v-col class="text-right">
          <v-btn color="success" :loading="isLoading" bottom class="ml-2" @click="onSave">
            {{ isFixCase ? $t('label.fix_case'):$t('label.save') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <dialog-duplicated-nik
      :show-dialog="showDuplicatedNikDialog"
      :show.sync="showDuplicatedNikDialog"
      :content="nikDuplicateMessage"
    />
    <faskes-verification
      :show-dialog="showFaskesVerificationDialog"
      :show.sync="showFaskesVerificationDialog"
      :submit-data.sync="faskesSubmitData"
      :content="$t('label.label_verification_faskes')"
    />
  </div>
</template>
<script>
import { rolesPerm, ResponseRequest } from '@/utils/constantVariable'
import { validateScrollUp } from '@/utils/utilsFunction'
import { ValidationObserver } from 'vee-validate'
import { mapGetters } from 'vuex'

export default {
  components: {
    ValidationObserver
  },
  data() {
    return {
      isLoading: false,
      showDuplicatedNikDialog: false,
      showFaskesVerificationDialog: false,
      faskesSubmitData: false,
      nikDuplicateMessage: null,
      rolesPerm: rolesPerm,
      idCase: '',
      isFixCase: false,
      volunteerPanel: [0],
      panelRiwayat: [0],
      patientPanel: [0]
    }
  },
  computed: {
    ...mapGetters('reports', [
      'formPasien'
    ]),
    ...mapGetters('user', [
      'roles',
      'fullName',
      'phoneNumber',
      'district_user'
    ])
  },
  watch: {
    'faskesSubmitData'(value) {
      if (value) {
        this.$router.push(`/laporan/detail-report/${this.idCase}`)
      }
    }
  },
  async mounted() {
    this.$store.dispatch('reports/resetFormPasien')
    this.formPasien.interviewers_name = this.fullName
    this.formPasien.interviewers_phone_number = this.phoneNumber
    this.formPasien.interview_date = this.$moment().format()
    this.showDuplicatedNikDialog = false
  },
  methods: {
    validateScrollUp,
    async onSave() {
      const valid = await this.$refs.observer.validate()
      if (!valid) {
        this.validateScrollUp()
        return
      }
      delete this.formPasien['_id']
      delete this.formPasien['id_case']
      this.isLoading = true
      try {
        this.formPasien.input_source = 'form app'
        let response
        if (!this.isFixCase) {
          this.formPasien.status_identity = 1
          this.formPasien.status_clinical = 1
          response = await this.$store.dispatch('reports/createReportCaseV2', this.formPasien)
        } else {
          const data = {
            id: this.$route.params.id,
            data: this.formPasien
          }
          response = await this.$store.dispatch('reports/correctCaseReport', data)
        }
        if (response.status !== ResponseRequest.UNPROCESSABLE) {
          this.formPasien['status_identity']
          this.formPasien['status_clinical']
          await this.$store.dispatch('toast/successToast', this.$t('success.create_data_success'))
          await this.$store.dispatch('reports/resetFormPasien')
          if ((this.roles[0] === rolesPerm.FASKES) || (this.isFixCase)) {
            this.idCase = response.data._id
            this.showFaskesVerificationDialog = true
          } else {
            this.$router.push(`/laporan/detail-report/${response.data._id}`)
          }
        } else {
          if (response.data.data === 'nik_exists') {
            this.isLoading = false
            this.showDuplicatedNikDialog = true
            this.nikDuplicateMessage = response.data.message
          } else {
            await this.$store.dispatch('toast/errorToast', response.data.message)
          }
        }
      } catch (error) {
        await this.$store.dispatch('toast/errorToast', this.$t('errors.data_failed_to_save'))
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
<style scoped>
  .background-card-survey-list-icon {
    left: calc(100% - 250px);
  }
  .text-header-detail-case {
    font-size: 1.2em;
  }
  .text-sub-header-detail-case {
    font-size: 2em;
  }
</style>
