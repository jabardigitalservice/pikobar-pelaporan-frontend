<template>
  <v-dialog
    v-model="showForm"
    :fullscreen="$vuetify.breakpoint.xs"
    max-width="90%"
  >
    <v-card>
      <v-card-title>
        {{ titleDetail }}
        <v-spacer />
        <v-icon @click="showForm = false">mdi-close</v-icon>
      </v-card-title>
      <div>
        <v-card
          class="warning-background ma-4"
          outlined
          color="#6FCF97"
          min-height="90px"
        >
          <div
            class="ml-10 mt-6"
            style="color: #FFFFFF;"
          >
            <div class="font-weight-bold">
              {{ $t('label.primary_case_id_related_case') }}: {{ formBody.case ? formBody.case.id_case.toUpperCase():idUniqueCase.toUpperCase() }}
            </div>
            <div>
              {{ $t('label.redaction_create_related_case') }}
            </div>
          </div>
        </v-card>
      </div>
      <v-container>
        <ValidationObserver ref="observer">
          <v-row>
            <v-col auto>
              <v-expansion-panels
                v-model="interviewer"
                multiple
              >
                <v-expansion-panel>
                  <v-expansion-panel-header class="font-weight-bold text-lg">
                    {{ $t('label.medical_officer_paramedic_health_volunteer') }}
                  </v-expansion-panel-header>
                  <v-divider />
                  <v-expansion-panel-content>
                    <form-interviewer
                      :form-body.sync="formBody"
                    />
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
          <v-row>
            <v-col auto>
              <v-expansion-panels
                v-model="closeContactIdentity"
                multiple
              >
                <v-expansion-panel>
                  <v-expansion-panel-header class="font-weight-bold text-lg">
                    {{ $t('label.close_contact_identity') }}
                  </v-expansion-panel-header>
                  <v-divider />
                  <v-expansion-panel-content>
                    <information-form-close-contact
                      :form-body.sync="formBody"
                    />
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
          <v-row>
            <v-col auto>
              <v-expansion-panels
                v-model="travelHistory"
                multiple
              >
                <v-expansion-panel>
                  <v-expansion-panel-header class="font-weight-bold text-lg">
                    {{ $t('label.travel_history') }}
                  </v-expansion-panel-header>
                  <v-divider />
                  <v-expansion-panel-content>
                    <form-travel-history
                      :form-body.sync="formBody"
                    />
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
          <v-row>
            <v-col auto>
              <v-expansion-panels
                v-model="exposureInformation"
                multiple
              >
                <v-expansion-panel>
                  <v-expansion-panel-header class="font-weight-bold text-lg">
                    {{ $t('label.exposure_information') }}
                  </v-expansion-panel-header>
                  <v-divider />
                  <v-expansion-panel-content>
                    <form-exposure-information
                      :form-body.sync="formBody"
                    />
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
          <v-row v-if="formBody.contact_type === 0 || formBody.contact_type === 2">
            <v-col auto>
              <v-expansion-panels
                v-model="closelyContactHome"
                multiple
              >
                <v-expansion-panel>
                  <v-expansion-panel-header class="font-weight-bold text-lg">
                    {{ $t('label.closely_contact_home') }}
                  </v-expansion-panel-header>
                  <v-divider />
                  <v-expansion-panel-content>
                    <form-closely-contact-home
                      :form-body.sync="formBody"
                    />
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
          <v-row v-if="formBody.contact_type === 1">
            <v-col auto>
              <v-expansion-panels
                v-model="healthWorker"
                multiple
              >
                <v-expansion-panel>
                  <v-expansion-panel-header class="font-weight-bold text-lg">
                    {{ $t('label.health_workers') }}
                  </v-expansion-panel-header>
                  <v-divider />
                  <v-expansion-panel-content>
                    <form-health-worker
                      :form-body.sync="formBody"
                    />
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
          <v-row>
            <v-col auto>
              <v-expansion-panels
                v-model="symptom"
                multiple
              >
                <v-expansion-panel>
                  <v-expansion-panel-header class="font-weight-bold text-lg">
                    {{ $t('label.symptoms') }}
                  </v-expansion-panel-header>
                  <v-divider />
                  <v-expansion-panel-content>
                    <form-symptom
                      :form-body.sync="formBody"
                    />
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
          <v-row>
            <v-col auto>
              <v-expansion-panels
                v-model="vaccinationHistory"
                multiple
              >
                <v-expansion-panel>
                  <v-expansion-panel-header class="font-weight-bold text-lg">
                    {{ $t('label.vaccination_history') }}
                  </v-expansion-panel-header>
                  <v-divider />
                  <v-expansion-panel-content>
                    <form-vaccination-history
                      :form-body.sync="formBody"
                    />
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
          <v-row>
            <v-col auto>
              <v-expansion-panels
                v-model="supportingInvestigation"
                multiple
              >
                <v-expansion-panel>
                  <v-expansion-panel-header class="font-weight-bold text-lg">
                    {{ $t('label.supporting_investigation') }}
                  </v-expansion-panel-header>
                  <v-divider />
                  <v-expansion-panel-content>
                    <form-supporting-investigation
                      :form-body.sync="formBody"
                    />
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
          <v-row class="mb-3">
            <v-col>
              <v-btn
                color="#FFFFFF"
                block
                :loading="isLoading"
                @click="handleBack"
              >
                {{ $t('label.back') }}
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                color="primary"
                block
                :loading="isLoading"
                @click="handleSave"
              >
                {{ isEdit ? $t('label.edit'):$t('label.save') }}
              </v-btn>
            </v-col>
          </v-row>
        </ValidationObserver>
      </v-container>
    </v-card>
  </v-dialog>
</template>
<script>
import { ValidationObserver } from 'vee-validate'
import EventBus from '@/utils/eventBus'
import { mapState } from 'vuex'

export default {
  name: 'DialogReportCloseContact',
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
    titleDetail: {
      type: String,
      default: ''
    },
    formBody: {
      type: Object,
      default: null
    },
    idCase: {
      type: String,
      default: ''
    },
    idUniqueCase: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showForm: this.showDialog,
      interviewer: [0],
      closeContactIdentity: [0],
      travelHistory: [0],
      exposureInformation: [0],
      closelyContactHome: [0],
      healthWorker: [0],
      symptom: [0],
      vaccinationHistory: [0],
      supportingInvestigation: [0],
      dialogDecline: false,
      isLoading: false,
      refreshPageList: false
    }
  },
  computed: {
    ...mapState('closeContactCase', [
      'formCloseContact'
    ])
  },
  watch: {
    showDialog(value) {
      this.showForm = value
    },
    showForm(value) {
      this.$emit('update:showForm', value)
    }
  },
  methods: {
    async handleBack() {
      await this.$store.dispatch('closeContactCase/resetStateCloseContactCase')
      this.showForm = false
    },
    async handleSave() {
      const valid = await this.$refs.observer.validate()
      this.isLoading = true
      if (!valid) {
        this.isLoading = false
        return
      }
      delete this.formBody['yearsOld']
      if (this.isEdit) {
        const idCloseContact = this.formBody._id
        delete this.formBody['case']
        delete this.formBody['_id']
        const data = {
          idCloseContact: idCloseContact,
          body: this.formBody
        }
        const response = await this.$store.dispatch('closeContactCase/updateDetailCloseContactByCase', data)
        if (response.status === 200) {
          await this.$store.dispatch('toast/successToast', this.$t('success.data_success_edit'))
          await this.$store.dispatch('closeContactCase/resetStateCloseContactCase')
          this.showForm = false
          this.isLoading = false
          delete this.formBody['is_reported']
          EventBus.$emit('refreshPageListReport', true)
        } else {
          await this.$store.dispatch('toast/errorToast', response.message)
          this.isLoading = false
        }
      } else {
        const data = {
          idCase: this.idCase,
          body: this.formBody
        }
        const response = await this.$store.dispatch('closeContactCase/postListCloseContactByCase', data)
        if (response.status === 200) {
          await this.$store.dispatch('toast/successToast', this.$t('success.create_data_success'))
          await this.$store.dispatch('closeContactCase/resetStateCloseContactCase')
          this.showForm = false
          this.isLoading = false
          EventBus.$emit('refreshPageListReport', true)
        } else {
          await this.$store.dispatch('toast/errorToast', response.message)
          this.isLoading = false
        }
      }
      this.$refs.observer.reset()
    }
  }
}
</script>
