<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialogPopup"
      persistent
      :max-width="patientRegistered ? '380px':'980px'"
    >
      <v-card>
        <div
          v-if="!isEdit"
        >
          <v-card-title class="justify-center">
            <img src="@/static/hospital-reference-1.svg">
          </v-card-title>
          <v-card-title class="justify-center">
            <div class="font-weight-bold" style="font-size: 16px">
              {{ patientRegistered ? `${ $t('label.patients_recorded_at') } ${fullName}`:`${ $t('label.patients_not_yet_recorded_in') } ${fullName}` }}
            </div>
          </v-card-title>
        </div>
        <div v-else>
          <v-card
            color="#FDEDED"
            class="warning-background ma-4"
            outlined
            min-height="90px"
          >
            <div
              class="ml-10 mt-6"
              style="color: #EB5757;"
            >
              <div style="font-weight: bold;font-size: 16px;">
                {{ $t('label.rejection_note') }}
              </div>
              <div>
                {{ messageRejection }}
              </div>
            </div>
          </v-card>
        </div>
        <v-container>
          <ValidationObserver ref="observer">
            <v-form
              ref="form"
              lazy-validation
            >
              <div v-if="patientRegistered">
                <form-patient-registered
                  :form-referral="formReferral"
                />
              </div>
              <div v-else>
                <form-patient-unregistered
                  :form-referral="formReferral"
                />
              </div>
            </v-form>
          </ValidationObserver>
        </v-container>
        <v-card-actions>
          <v-col class="text-right">
            <v-btn
              class="mr-5"
              style="height: 40px;min-width: 120px;"
              @click="closeData"
            >
              {{ $t('label.canceled') }}
            </v-btn>
            <v-btn
              color="primary"
              style="height: 40px;min-width: 120px;"
              @click="onHandleSave"
            >
              {{ $t('label.short_reference').toUpperCase() }}
            </v-btn>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <dialog-referral
      :show-dialog="dialogReferral"
      :show.sync="dialogReferral"
      :message="$t('label.waiting_approve_dinkes')"
    />
  </v-row>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import { mapGetters } from 'vuex'
import EventBus from '@/utils/eventBus'
import { ResponseRequest } from '@/utils/constantVariable'

export default {
  name: 'DialogHospitalReferral',
  components: {
    ValidationObserver
  },
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    patientRegistered: {
      type: Boolean,
      default: false
    },
    formReferral: {
      type: Object,
      default: null
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    messageRejection: {
      type: String,
      default: null
    },
    idTransfer: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      dialogReferral: false
    }
  },
  computed: {
    dialogPopup: {
      get() {
        return this.dialog
      },
      set(val) {
        this.$emit('update:dialogPopup', val)
      }
    },
    ...mapGetters('user', [
      'fullName'
    ])
  },
  methods: {
    async closeData() {
      await this.$emit('update:dialogPopup', false)
    },
    async onHandleSave() {
      const valid = await this.$refs.observer.validate()
      if (!valid) {
        return
      }
      if (this.patientRegistered) {
        const rowData = {
          id: this.formReferral.case_id,
          data: {
            transfer_to_unit_id: this.formReferral.transfer_to_unit._id,
            transfer_to_unit_name: this.formReferral.transfer_to_unit.name
          }
        }
        const response = await this.$store.dispatch('hospitalRefferal/caseHospitalRefferal', rowData)
        if (response.response.data.status === ResponseRequest.UNPROCESSABLE) {
          await this.$emit('update:dialogPopup', false)
          await this.$emit('update:referralForm', {})
          await this.$store.dispatch('toast/errorToast', response.data.message)
        } else {
          await this.$emit('update:dialogPopup', false)
          await this.$emit('update:referralForm', {})
          await this.$store.dispatch('toast/successToast', this.$t('label.patient_successfully_referred'))
        }
      } else {
        let response, rowData
        rowData = {
          ...this.formReferral,
          transfer_to_unit_id: this.formReferral.transfer_to_unit._id,
          transfer_to_unit_name: this.formReferral.transfer_to_unit.name,
          transfer_comment: null
        }
        await delete rowData['transfer_to_unit']
        if (!this.isEdit) {
          response = await this.$store.dispatch('hospitalRefferal/hospitalRefferalNewCase', rowData)
        } else {
          rowData = {
            idCase: rowData.case,
            idTransfer: this.idTransfer,
            data: rowData
          }
          await delete rowData.data['case']
          await delete rowData.data['_id']
          response = await this.$store.dispatch('hospitalRefferal/caseHospitalRefferalRevise', rowData)
        }
        if (response.response.data.status === ResponseRequest.UNPROCESSABLE) {
          EventBus.$emit('refreshPageListReferral', true)
          await this.$emit('update:dialogPopup', false)
          await this.$store.dispatch('toast/errorToast', response.data.message)
        } else {
          EventBus.$emit('refreshPageListReferral', true)
          await this.$emit('update:dialogPopup', false)
          await this.$store.dispatch('toast/successToast', this.$t('label.patient_successfully_referred'))
        }
      }
    }
  }
}
</script>

<style scoped>
 .warning-background {
   background-image: url('../../static/icon-warning-red.svg')
 }
</style>
