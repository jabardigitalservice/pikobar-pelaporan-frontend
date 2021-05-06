<template>
  <div>
    <v-card class="d-block pa-1 mx-auto header-application-logistic">
      <v-row class="mt-2">
        <v-col auto>
          <v-card-text>
            <div class="header-user-title">{{ $t('label.make_referrals_for_patients') }}</div>
            <div class="header-user-text">{{ $t('label.choose_one_below') }}</div>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
    <v-row class="mt-2">
      <v-col
        cols="12"
        sm="6"
        @click="handleReferralCaseRegistered"
      >
        <v-card
          outlined
          class="card-action"
        >
          <div class="d-flex">
            <v-avatar
              class="ma-2"
              size="125"
              tile
            >
              <v-img src="@/static/hospital-reference-1.svg" />
            </v-avatar>
            <v-list-item-content class="flex-wrap pos-center">
              <v-list-item-title class="font-weight-bold" style="font-size: 16px">
                {{ $t('label.patients_recorded_at') }} {{ fullName }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ $t('label.click_here_if_patient_has_already_recorded') }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <div class="pos-center">
              <v-icon style="font-size: 3rem;color: #27AE60;">
                mdi-chevron-right
              </v-icon>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        sm="6"
        @click="handleReferralCaseUnegistered"
      >
        <v-card
          outlined
          class="card-action"
        >
          <div class="d-flex">
            <v-avatar
              class="ma-2"
              size="125"
              tile
            >
              <v-img src="@/static/hospital-reference-2.svg" />
            </v-avatar>
            <v-list-item-content class="pos-center">
              <v-list-item-title class="flex-nowrap font-weight-bold" style="font-size: 16px">
                {{ $t('label.patients_not_yet_recorded_in') }} {{ fullName }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ $t('label.click_here_if_patient_has_not_been_recorded') }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <div class="pos-center">
              <v-icon style="font-size: 3rem;color: #27AE60;">
                mdi-chevron-right
              </v-icon>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <dialog-hospital-referral
      :dialog="dialog"
      :dialog-popup.sync="dialog"
      :form-referral="formReferral"
      :patient-registered="patientRegistered"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'FormHospitalReferral',
  data() {
    return {
      dialog: false,
      patientRegistered: false,
      formReferral: {}
    }
  },
  computed: {
    ...mapGetters('reports', [
      'formPasien'
    ]),
    ...mapGetters('user', [
      'fullName',
      'district_user',
      'district_name_user'
    ])
  },
  methods: {
    async handleReferralCaseRegistered() {
      this.formReferral = {}
      this.dialog = true
      this.patientRegistered = true
    },
    async handleReferralCaseUnegistered() {
      this.formReferral = this.formPasien
      this.formReferral.address_district_code = this.district_user
      this.formReferral.address_district_name = this.district_name_user
      this.dialog = true
      this.patientRegistered = false
    }
  }
}
</script>

<style scoped type="scss">
  .header-application-logistic {
    background: linear-gradient(82.33deg, #27AE60 0%, #58DA8F 100%);
  }
  .header-user-text {
    font-size: 14px;
    color: #FFFFFF;
  }
  .header-user-title {
    font-size: 26px;
    color: #FFFFFF;
    margin-bottom: 10px;
  }
  .card-action {
    cursor: grab;
  }
</style>
