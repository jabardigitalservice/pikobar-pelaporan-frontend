<template>
  <div>
    <v-row class="pa-2" @click="backPage">
      <v-icon>mdi-arrow-left</v-icon>
      {{ $t('label.back') }}
    </v-row>
    <v-card class="pa-1 mt-2 mx-auto header-detail-case">
      <v-row justify="space-between">
        <v-col cols="12" md="7" sm="7">
          <v-card-text class="font-weight-bold">
            <v-card-title class="py-0 text-header-detail-case" style="font-size:1em;">
              {{ $t('label.part_two_of_two') }}
            </v-card-title>
            <v-card-title class="py-0 text-header-detail-case">
              {{ detail.id_case ? detail.id_case.toUpperCase() : '' }}
            </v-card-title>
            <v-card-title class="pt-0 text-header-detail-case">
              {{ detailNameCase(detail.name, detail.nik) }}
            </v-card-title>
            <v-card-subtitle class="text-sub-header-detail-case">
              {{ roles[0] === 'faskes' && detail.verified_status !== 'verified' ? $t('label.redaction_detail_faskes'):$t('label.complete_history_and_patient_information_below') }}
            </v-card-subtitle>
          </v-card-text>
        </v-col>
        <v-col cols="12" md="4" sm="4">
          <div v-if="detail.verified_status === 'pending' & roles[0] != 'faskes'" class="d-flex align-center justify-center pa-5 mx-auto">
            <v-btn class="primary--text" @click="handleVerificationCase">
              {{ $t('label.case_report_verification') }}
            </v-btn>
          </div>
          <div v-else-if="roles[0] === 'faskes' & detail.verified_status === 'draft' || detail.verified_status === 'declined' " class="d-flex align-center justify-center pa-5 mx-auto">
            <v-btn class="warning--text mr-2" @click="handleSendCase('draft')">
              <v-icon class="warning--text">mdi-content-save</v-icon>&nbsp;
              {{ $t('label.save_as_draft') }}
            </v-btn>
            <v-btn class="primary--text" @click="handleSendCase('pending')">
              <v-icon class="primary--text">mdi-check-circle-outline</v-icon>&nbsp;
              {{ $t('label.finish_and_submit') }}
            </v-btn>
          </div>
          <div
            v-else
            class="background-card-survey-list-icon ml-12 ml-10"
          />
        </v-col>
        <v-col />
      </v-row>
    </v-card>
    <v-row v-if="detail.verified_status === 'declined' & roles[0] === 'faskes'" class="mx-0 mt-2 mb-2">
      <div class="rejection py-4 px-7">
        <v-row justify="space-between">
          <v-col cols="12" sm="1">
            <v-icon x-large color="#FFFF">mdi-alert-circle</v-icon>
          </v-col>
          <v-col cols="12" sm="11" class="float-left white--text">
            <v-row>
              <span class="font-weight-bold">{{ $t('label.rejection_note') }}</span>
            </v-row>
            <v-row class="mt-1">
              <span>"{{ detail.verified_comment }}"</span>
            </v-row>
          </v-col>
        </v-row>
      </div>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        md="3"
        sm="3"
      >
        <v-card
          class="mx-auto"
          outlined
          @click="handleUpdateCase"
        >
          <v-list-item three-line>
            <v-list-item-content>
              <div>
                <v-list-item-title class="h6 font-weight-bold text-wrap mb-1 d-flex justify-center">
                  {{ $t('label.form_patient_title') }}
                </v-list-item-title>
                <v-icon color="primary" class="float-right detail-icon-case">mdi-pencil</v-icon>
              </div>
              <v-list-item-subtitle class="text-wrap text-center">
                {{ $t('label.medical_personnel_data_patient_identity_patient_criteria') }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-row class="justify-center ma-1">
            <v-chip
              class="ma-2"
              :color="statusCase.status_identity === 1 ? '#6FCF97':'#E53935'"
            >
              {{ statusCase.status_identity === 1 ? $t('label.complete'):$t('label.incomplete') }}
            </v-chip>
          </v-row>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="3"
        sm="3"
      >
        <v-card
          class="mx-auto"
          outlined
          @click="handleUpdateHistoryCase"
        >
          <v-list-item three-line>
            <v-list-item-content>
              <div>
                <v-list-item-title class="h6 font-weight-bold text-wrap mb-1 d-flex justify-center">
                  {{ $t('label.clinical_information') }}
                </v-list-item-title>
                <v-icon color="primary" class="float-right detail-icon-case">mdi-pencil</v-icon>
              </div>
              <v-list-item-subtitle width="100" class="text-wrap text-center">
                {{ $t('label.case_history_data_and_patient_clinical_info') }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-row class="justify-center ma-1">
            <v-chip
              class="ma-2"
              color="#6FCF97"
            >
              {{ summaryReportCase.clinicalInformationTotal || 0 }}
              {{ $t('label.clinical_info') }}
            </v-chip>
          </v-row>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="3"
        sm="3"
      >
        <v-card
          class="mx-auto"
          outlined
          @click="handleInspectionSupport"
        >
          <v-list-item three-line>
            <v-list-item-content>
              <div>
                <v-list-item-title class="h6 font-weight-bold text-wrap mb-1 d-flex justify-center">
                  {{ $t('label.supporting_investigation') }}
                </v-list-item-title>
                <v-icon color="primary" class="float-right detail-icon-case">mdi-pencil</v-icon>
              </div>
              <v-list-item-subtitle class="text-wrap text-center">
                {{ $t('label.supporting_information_data_and_patient_test_results') }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-row class="justify-center ma-1">
            <v-chip
              class="ma-2"
              color="#6FCF97"
            >
              {{ summaryReportCase.pcrTotal || 0 }}
              {{ $t('label.pcr') }}
            </v-chip>
            <v-chip
              class="ma-2"
              color="#6FCF97"
            >
              {{ summaryReportCase.rapidTotal || 0 }}
              {{ $t('label.rapid') }}
            </v-chip>
          </v-row>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="3"
        sm="3"
      >
        <v-card
          class="mx-auto"
          outlined
          @click="handleHistoryTravel"
        >
          <v-list-item three-line>
            <v-list-item-content>
              <div>
                <v-list-item-title class="h6 font-weight-bold text-wrap mb-1 d-flex justify-center">
                  {{ $t('label.travel_history') }}
                </v-list-item-title>
                <v-icon color="primary" class="float-right detail-icon-case">mdi-pencil</v-icon>
              </div>
              <v-list-item-subtitle class="text-wrap text-center">
                {{ $t('label.history_of_patient_travel_abroad_out_of_town') }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-row class="justify-center ma-1">
            <v-chip
              class="ma-2"
              style="font-size: 0.75em;"
              color="#6FCF97"
            >
              {{ summaryReportCase.travelAbroadTotal || 0 }}
              {{ $t('label.abroad') }}
            </v-chip>
            <v-chip
              class="ma-2"
              style="font-size: 0.75em;"
              color="#6FCF97"
            >
              {{ summaryReportCase.travelDomesticTotal || 0 }}
              {{ $t('label.out_of_city') }}
            </v-chip>
            <v-chip
              class="ma-2"
              style="font-size: 0.75em;"
              color="#6FCF97"
            >
              {{ summaryReportCase.visitedLocalAreaTotal || 0 }}
              {{ $t('label.local_transmission') }}
            </v-chip>
            <v-chip
              class="ma-2"
              style="font-size: 0.75em;"
              color="#6FCF97"
            >
              {{ summaryReportCase.visitedPublicPlaceTotal || 0 }}
              {{ $t('label.public_place') }}
            </v-chip>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        md="3"
        sm="3"
      >
        <v-card
          class="mx-auto"
          outlined
          @click="handleTransmissionPattern"
        >
          <v-list-item three-line>
            <v-list-item-content>
              <div>
                <v-list-item-title class="h6 font-weight-bold text-wrap mb-1 d-flex justify-center">
                  {{ $t('label.transmission_pattern') }}
                </v-list-item-title>
                <v-icon color="primary" class="float-right detail-icon-case">mdi-pencil</v-icon>
              </div>
              <v-list-item-subtitle class="text-wrap text-center">
                {{ $t('label.data_transmission_type_and_cluster_type') }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-row class="justify-center ma-1">
            <v-chip
              class="ma-2"
              :color="statusCase.status_transmission === 1 ? '#6FCF97':'#E53935'"
            >
              {{ statusCase.status_transmission === 1 ? $t('label.complete'):$t('label.incomplete') }}
            </v-chip>
          </v-row>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="3"
        sm="3"
      >
        <v-card
          class="mx-auto"
          outlined
          @click="handleContactFactor"
        >
          <v-list-item three-line>
            <v-list-item-content>
              <div>
                <v-list-item-title class="h6 font-weight-bold text-wrap mb-1 d-flex justify-center">
                  {{ $t('label.exposure_factor') }}
                </v-list-item-title>
                <v-icon color="primary" class="float-right detail-icon-case">mdi-pencil</v-icon>
              </div>
              <v-list-item-subtitle class="text-wrap text-center">
                {{ $t('label.patient_external_exposure_factor_information_data') }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-row class="justify-center ma-1">
            <v-chip
              class="ma-2"
              :color="statusCase.status_exposurecontact === 1 ? '#6FCF97':'#E53935'"
            >
              {{ statusCase.status_exposurecontact === 1 ? $t('label.complete'):$t('label.incomplete') }}
            </v-chip>
          </v-row>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="3"
        sm="3"
      >
        <v-card
          class="mx-auto"
          outlined
          @click="handleCloseContact"
        >
          <v-list-item three-line>
            <v-list-item-content>
              <div>
                <v-list-item-title class="h6 font-weight-bold text-wrap mb-1 d-flex justify-center">
                  {{ $t('label.related_contacts') }}
                </v-list-item-title>
                <v-icon color="primary" class="float-right detail-icon-case">mdi-pencil</v-icon>
              </div>
              <v-list-item-subtitle class="text-wrap text-center">
                {{ $t('label.patient_related_contact_information_data') }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-row class="justify-center ma-1">
            <v-chip
              class="ma-2"
              color="#6FCF97"
            >
              {{ summaryReportCase.relatedCasesTotal || 0 }}
              {{ $t('label.related_contacts') }}
            </v-chip>
          </v-row>
        </v-card>
      </v-col>
      <v-col />
    </v-row>
    <dialog-new-update-case
      :show-dialog="dialogUpdateCase"
      :show.sync="dialogUpdateCase"
      :id-case="this.$route.params.id"
      :form-pasien="formPasienV2"
    />
    <dialog-list-history-case
      :show-dialog="dialogHistoryCase"
      :show.sync="dialogHistoryCase"
      :list-history-case="listHistoryCase"
      :refresh-list-history-case.sync="refreshListHistoryCase"
      :id-case="this.$route.params.id"
      :detail-case="detail"
      :title-detail="$t('label.case_history') +' & '+ $t('label.clinical_information')"
    />
    <dialog-close-contact
      :show-dialog="dialogCloseContact"
      :show.sync="dialogCloseContact"
      :list-close-contact.sync="listCloseContact"
      :id-case="this.$route.params.id"
      :case-id.sync="idCase"
      :id-unique-case="detail ? detail.id_case:''"
      :unique-case-id.sync="idUniqueCase"
      :title-detail="$t('label.distribution_case_network')"
    />
    <dialog-transmission-area-local
      :show-dialog="dialogTransmissionArea"
      :show.sync="dialogTransmissionArea"
      :id-case="this.$route.params.id"
      :case-id.sync="idCase"
      :title-detail="$t('label.local_transmission_area_history_list')"
    />
    <dialog-transmission-pattern
      :show-dialog="dialogTransmissionPattern"
      :show.sync="dialogTransmissionPattern"
      :id-case="this.$route.params.id"
      :form-pasien="detail"
    />
    <dialog-contact-factor
      :show-dialog="dialogContactFactor"
      :show.sync="dialogContactFactor"
      :id-case="this.$route.params.id"
      :form-pasien="detail"
    />
    <dialog-tab-history-travel
      :show-dialog="dialogHistoryTravel"
      :show.sync="dialogHistoryTravel"
      :id-case="this.$route.params.id"
      :case-id.sync="idCase"
      :form-pasien="detail"
      :title-detail="$t('label.travel_history')"
    />
    <dialog-public-place
      :show-dialog="dialogPublicPlace"
      :show.sync="dialogPublicPlace"
      :id-case="this.$route.params.id"
      :case-id.sync="idCase"
      :title-detail="$t('label.list_public_place_history')"
    />
    <dialog-inspection-support
      :show-dialog="dialogInspectionSupport"
      :show.sync="dialogInspectionSupport"
      :id-case="this.$route.params.id"
      :is-complete-data="true"
      :form-pasien="detail"
      :case-id.sync="idCase"
      :title-detail="$t('label.list_inspection_support')"
    />
    <verification-form
      :show-form="showVerificationForm"
      :show.sync="showVerificationForm"
      :show-confirmation.sync="showConfirmation"
      :case-data="detail"
      :last-case-data="lastHistoryCase"
      :close-contact-case="listCloseContact"
      :query-data="verificationQuery"
      :refresh-page.sync="isRefresh"
    />
    <verification-confirmation
      :show-dialog="showConfirmation"
      :show.sync="showConfirmation"
      :query-data="verificationQuery"
      :submit-data.sync="isSubmit"
    />
    <resend-confirmation
      :show-dialog="resendConfirmation"
      :show.sync="resendConfirmation"
      :label-text="resendText"
      :label-content="resendTextContent"
      :submit-data.sync="isResend"
    />
  </div>
</template>

<script>
import { formatDatetime } from '@/utils/parseDatetime'
import { setUpDataCase2 } from '@/utils/utilsFunction'
import { ResponseRequest } from '@/utils/constantVariable'

import { mapGetters } from 'vuex'
export default {
  name: 'DetailReportCase',
  data() {
    return {
      detail: {},
      lastHistoryCase: {},
      idCase: '',
      idUniqueCase: '',
      formatDate: 'YYYY/MM/DD',
      listCloseContact: [],
      summaryReportCase: 0,
      statusCase: {
        status_clinical: 0,
        status_closecontact: 0,
        status_exposurecontact: 0,
        status_identity: 0,
        status_inspection_support: 0,
        status_transmission: 0,
        status_travel_import: 0,
        status_travel_local: 0,
        status_travel_public: 0
      },
      verificationQuery: {
        'id': '',
        'data': {
          'verified_status': '',
          'verified_comment': ''
        }
      },
      resendText: '',
      resendTextContent: '',
      showVerificationForm: false,
      showConfirmation: false,
      isStatusHistoryTravel: false,
      dialogUpdateCase: false,
      dialogHistoryCase: false,
      dialogCloseContact: false,
      dialogTransmissionArea: false,
      dialogHistoryTravel: false,
      dialogInspectionSupport: false,
      dialogContactFactor: false,
      dialogPublicPlace: false,
      dialogTransmissionPattern: false,
      resendConfirmation: false,
      isRefresh: false,
      isResend: false,
      listHistoryCase: [],
      refreshListHistoryCase: false,
      isSubmit: false
    }
  },
  computed: {
    ...mapGetters('reports', [
      'formRiwayatPasien',
      'formPasienV2'
    ]),
    ...mapGetters('user', [
      'roles',
      'fullName',
      'district_user'
    ])
  },
  watch: {
    'dialogCloseContact': function(value) {
      if (!value) {
        this.getListCloseContactByCase(this.$route.params.id)
        this.getStatusCase(this.$route.params.id)
        this.getSummaryCase(this.$route.params.id)
      }
    },
    async isSubmit(value) {
      if (value) {
        const response = await this.$store.dispatch('reports/verifyCase', this.verificationQuery)
        if (response.status === 200 || response.status === 201) {
          this.detailCase()
          await this.$store.dispatch('toast/successToast', this.verificationQuery.data.verified_status === 'verified' ? this.$t('success.verification_success') : this.$t('success.rejection_success'))
        }
        this.isSubmit = false
      }
    },
    async isResend(value) {
      if (value) {
        this.resendVerificationCase()
        this.isResend = false
        this.resendConfirmation = false
      }
    },
    isRefresh(value) {
      if (value) {
        this.detailCase()
        this.isRefresh = false
      }
    },
    refreshListHistoryCase(value) {
      if (this.idCase) {
        this.getListHistoryCase(this.idCase)
        this.getSummaryCase(this.$route.params.id)
        this.refreshListHistoryCase = false
      }
    },
    'dialogUpdateCase': function(value) {
      if (!value) {
        this.detailCase()
        this.getStatusCase(this.$route.params.id)
        this.getSummaryCase(this.$route.params.id)
      }
    },
    'dialogHistoryCase': function(value) {
      if (!value) {
        this.getStatusCase(this.$route.params.id)
        this.getSummaryCase(this.$route.params.id)
      }
    },
    'dialogTransmissionPattern': function(value) {
      if (!value) {
        this.getStatusCase(this.$route.params.id)
        this.getSummaryCase(this.$route.params.id)
      }
    },
    'dialogHistoryTravel': function(value) {
      if (!value) {
        this.getStatusCase(this.$route.params.id)
        this.getSummaryCase(this.$route.params.id)
      }
    },
    'dialogPublicPlace': function(value) {
      if (!value) {
        this.getStatusCase(this.$route.params.id)
        this.getSummaryCase(this.$route.params.id)
      }
    },
    'dialogContactFactor': function(value) {
      if (!value) {
        this.getStatusCase(this.$route.params.id)
        this.getSummaryCase(this.$route.params.id)
      }
    },
    'dialogInspectionSupport': function(value) {
      if (!value) {
        this.getStatusCase(this.$route.params.id)
        this.getSummaryCase(this.$route.params.id)
      }
    }
  },
  async mounted() {
    await this.detailCase()
    await this.getStatusCase(this.$route.params.id)
    await this.getSummaryCase(this.$route.params.id)
  },
  methods: {
    formatDatetime,
    setUpDataCase2,
    async detailCase() {
      const response = await this.$store.dispatch('reports/detailReportCase', this.$route.params.id)
      if (response.data !== null) {
        this.detail = response.data
        if (response.data.birth_date !== null) {
          this.detail.birth_date = await this.formatDatetime(response.data.birth_date, this.formatDate)
        } else {
          this.detail.birth_date = ''
        }
        if (response.data.age !== null) {
          this.detail.yearsOld = Math.floor(response.data.age)
          this.detail.monthsOld = Math.ceil((response.data.age - Math.floor(response.data.age)) * 12)
        }
        this.lastHistoryCase = this.detail['last_history']
        if (this.detail._id) {
          delete this.detail['author']
          delete this.detail['createdAt']
          delete this.detail['updatedAt']
          delete this.detail['last_history']
        }
      }
    },
    backPage() {
      const path = '/laporan/list'
      if (this.$route.path !== path) this.$router.push(path)
    },
    detailNameCase(nameCase, nik) {
      let completeNameCase = ''
      completeNameCase += nameCase
      completeNameCase += nik ? ' • ' + nik : ''
      return completeNameCase
    },
    async handleUpdateCase() {
      this.$store.dispatch('reports/resetFormPasienV2')
      const data = this.setUpDataCase2(this.formPasienV2, this.detail)
      Object.assign(this.formPasienV2, data)
      this.dialogUpdateCase = true
    },
    async handleUpdateHistoryCase() {
      this.idCase = this.$route.params.id
      this.getListHistoryCase(this.idCase)
    },
    async handleCloseContact() {
      await this.getListCloseContactByCase(this.$route.params.id)
      this.dialogCloseContact = true
    },
    async getListHistoryCase(id) {
      const response = await this.$store.dispatch('reports/listHistoryCase', id)
      if (response !== undefined) {
        this.listHistoryCase = await response
        this.dialogHistoryCase = true
      }
    },
    async getListCloseContactByCase(id) {
      const response = await this.$store.dispatch('closeContactCase/getListCloseContactByCase', id)
      this.listCloseContact = response?.data || []
    },
    async getStatusCase(id) {
      const response = await this.$store.dispatch('reports/statusCase', id)
      const { data } = response || null
      if (data) {
        this.statusCase = data
        this.checkStatusHistoryTravel(data)
      }
    },
    async getSummaryCase(id) {
      const response = await this.$store.dispatch('reports/summaryReportCase', id)
      this.summaryReportCase = response.data
    },
    checkStatusHistoryTravel(data) {
      if (data.status_travel_public === 1 &&
          data.status_travel_local === 1 && data.status_travel_import === 1) {
        this.isStatusHistoryTravel = true
      } else if (data.status_travel_public === 1 && data.status_travel_import === 1) {
        this.isStatusHistoryTravel = true
      } else {
        this.isStatusHistoryTravel = false
      }
    },
    handleVerificationCase() {
      this.getListCloseContactByCase(this.$route.params.id)
      this.showVerificationForm = true
    },
    async handleResendVerificationCase() {
      this.resendConfirmation = true
    },
    async handleSendCase(value) {
      this.verificationQuery.id = this.$route.params.id
      this.verificationQuery.data.verified_status = value
      this.resendText = value === 'draft' ? this.$t('label.save_as_draft') : this.$t('label.finish_and_submit')
      this.resendTextContent = value === 'draft' ? this.$t('label.resend_case_redaction_2') : this.$t('label.resend_case_redaction_3')
      this.resendConfirmation = true
    },
    async resendVerificationCase() {
      const response = await this.$store.dispatch('reports/verifyCase', this.verificationQuery)
      if (response.status && response.status !== ResponseRequest.UNPROCESSABLE) {
        await this.$store.dispatch('toast/successToast', this.$t('success.send_data_success'))
        await this.$store.dispatch('reports/resetFormPasien')
        const path = '/laporan/verification'
        if (this.$route.path !== path) await this.$router.push(path)
      } else {
        await this.$store.dispatch('toast/errorToast', response.data.message)
      }
    },
    handleHistoryTravel() {
      this.idCase = this.$route.params.id
      this.dialogHistoryTravel = true
    },
    handleContactFactor() {
      this.idCase = this.$route.params.id
      this.dialogContactFactor = true
    },
    handleTransmissionArea() {
      this.idCase = this.$route.params.id
      this.dialogTransmissionArea = true
    },
    handleInspectionSupport() {
      this.idCase = this.$route.params.id
      this.dialogInspectionSupport = true
    },
    handlePublicPlace() {
      this.idCase = this.$route.params.id
      this.dialogPublicPlace = true
    },
    handleTransmissionPattern() {
      this.idCase = this.$route.params.id
      this.dialogTransmissionPattern = true
    }
  }
}
</script>
<style scoped>
  .rejection {
    background-image: linear-gradient(to right, #EB5757 , #fdeded);
    width: 100%;
    border-radius: 10px;
    color: #EB5757;
  }
  .detail-icon-case {
    font-size:1em;
    position: relative;
    top: -20px;
  }
</style>
