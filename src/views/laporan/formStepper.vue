<template>
  <div>
    <v-stepper
      v-model="step"
      :alt-labels="altLabels"
    >
      <v-stepper-items>
        <v-stepper-content
          v-for="n in steps"
          :key="`${n}-content`"
          :step="n"
        >
          <template v-if="step == 1">
            <!-- <form-information-patient
              :form-pasien="formPasien"
              :steps="n"
            /> -->
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
                  v-model="historyCasePanel"
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
            <v-row>
              <v-col auto>
                <v-expansion-panels
                  v-model="multipleSupportingInvestigationPanel"
                  multiple
                >
                  <v-expansion-panel>
                    <v-expansion-panel-header class="font-weight-bold text-lg">
                      {{ $t('label.supporting_investigation') }}
                    </v-expansion-panel-header>
                    <v-divider />
                    <v-expansion-panel-content>
                      <form-multiple-supporting-investigation :form-pasien="formPasien" />
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
            </v-row>
            <v-row>
              <v-col auto>
                <v-expansion-panels
                  v-model="travelHistoryFactorPanel"
                  multiple
                >
                  <v-expansion-panel>
                    <v-expansion-panel-header class="font-weight-bold text-lg">
                      {{ $t('label.travel_history_factor') }}
                    </v-expansion-panel-header>
                    <v-divider />
                    <v-expansion-panel-content>
                      <form-multiple-travel-history-factor :form-pasien="formPasien" />
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
            </v-row>
            <v-row>
              <v-col auto>
                <v-expansion-panels
                  v-model="historySocioeconomicPanel"
                  multiple
                >
                  <v-expansion-panel>
                    <v-expansion-panel-header class="font-weight-bold text-lg">
                      {{ $t('label.form_socioeconomic_title') }}
                    </v-expansion-panel-header>
                    <v-divider />
                    <v-expansion-panel-content>
                      <form-socioeconomic-history :form-pasien="formPasien" />
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
            </v-row>
            <v-container fluid>
              <v-row
                class="survey-bottom-form ma-0 pa-0"
              >
                <v-col cols="12" :class="{'text-right': $vuetify.breakpoint.mdAndUp}" class="ma-0 pa-0">
                  <v-btn
                    color="success"
                    bottom
                    @click="onNext"
                  >
                    {{ $t('label.continue') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </template>
          <template v-else-if="step == 2">
            <v-row>
              <v-col auto>
                <v-expansion-panels
                  v-model="contactFactorPanel"
                  multiple
                >
                  <v-expansion-panel>
                    <v-expansion-panel-header class="font-weight-bold text-lg">
                      {{ $t('label.form_eposure_factor_title') }}
                    </v-expansion-panel-header>
                    <v-divider />
                    <v-expansion-panel-content>
                      <form-multiple-contact-factor :form-pasien="formPasien" />
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
            </v-row>
            <v-row>
              <v-col auto>
                <v-expansion-panels
                  v-model="multipleCloseContactPanel"
                  multiple
                >
                  <v-expansion-panel>
                    <v-expansion-panel-header class="font-weight-bold text-lg">
                      {{ $t('label.exposure_contact') }}
                    </v-expansion-panel-header>
                    <v-divider />
                    <v-expansion-panel-content>
                      <form-multiple-close-contact :form-pasien="formPasien" />
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
            </v-row>
            <v-container fluid>
              <v-row
                class="survey-bottom-form"
                justify="space-between"
              >
                <v-col cols="12" md="6" sm="12" :class="{'mb-2': $vuetify.breakpoint.smAndDown}" class="ma-0 pa-0">
                  <v-btn
                    :loading="loading"
                    bottom
                    outlined
                    @click="backStep"
                  >
                    {{ $t('label.back') }}
                  </v-btn>
                </v-col>
                <v-col cols="12" md="6" sm="12" :class="{'text-right': $vuetify.breakpoint.mdAndUp}" class="ma-0 pa-0">
                  <v-btn
                    color="success"
                    :loading="loading"
                    bottom
                    @click="handleSave"
                  >
                    {{ $t('label.save') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </template>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script>
import EventBus from '@/utils/eventBus'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      step: 1,
      steps: 2,
      volunteerPanel: [0],
      patientPanel: [0],
      historyCasePanel: [0],
      historySocioeconomicPanel: [0],
      travelHistoryFactorPanel: [0],
      multipleSupportingInvestigationPanel: [0],
      contactFactorPanel: [0],
      multipleCloseContactPanel: [0],
      altLabels: false,
      editable: false
    }
  },
  computed: {
    ...mapGetters('reports', [
      'formPasien'
    ]),
    ...mapGetters('user', [
      'district_user'
    ])
  },
  async created() {
    // on steps change
    this.formPasien.address_district_code = this.district_user
    EventBus.$on('nextSurveySteps', (value) => {
      this.step = value + 1
    })
    EventBus.$on('backSurveySteps', (value) => {
      this.step = value - 1
    })
  },
  methods: {
    onInput(val) {
      this.steps = parseInt(val)
    },
    onCancel() {
      this.$router.push('/survey/index')
    },
    backStep() {
      this.step = 1
    },
    onNext() {
      this.step = 2
    },
    handleSave() {
      this.$router.push('/laporan/list')
    }
  }
}
</script>
