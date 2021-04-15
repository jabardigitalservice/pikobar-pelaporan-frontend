<template>
  <v-dialog
    v-model="show"
    :fullscreen="$vuetify.breakpoint.xs"
    max-width="40%"
  >
    <v-card>
      <v-card-title class="pb-0">
        {{ $t('label.export') }}
        <v-spacer />
        <v-icon @click="show = false">mdi-close</v-icon>
      </v-card-title>
      <v-divider class="py-0" />
      <v-container v-if="!isSuccess" fluid class="pb-0 px-6">
        <p class="text--primary">
          {{ $t('label.queue_case_label_1') }}
        </p>
        <ValidationObserver ref="observer">
          <v-form ref="form" lazy-validation>
            <v-row align="center">
              <v-col cols="12" md="2" sm="12" :class="{'mb-6': !$vuetify.breakpoint. smAndDown}">
                <label class="required">{{ $t('label.email') }}</label>
              </v-col>
              <v-col cols="12" md="10" sm="12" :class="{'py-0 pb-3': $vuetify.breakpoint. smAndDown}">
                <ValidationProvider v-slot="{ errors }" rules="required|email">
                  <v-text-field
                    v-model="form.email"
                    :label="$t('label.email')"
                    :error-messages="errors"
                    type="text"
                    solo-inverted
                    required
                  />
                </ValidationProvider>
              </v-col>
            </v-row>
            <v-row class="pt-1 pb-4">
              <v-col class="text-right">
                <v-btn :loading="loading" bottom class="ml-2 btn-small text-capitalize" @click="show = false">
                  {{ $t('label.cancel') }}
                </v-btn>
                <v-btn color="success" :loading="loading" bottom class="ml-2 btn-small text-capitalize" @click="sendData">
                  {{ $t('label.submit') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </ValidationObserver>
      </v-container>
      <v-container v-else fluid class="pb-0 px-6">
        <p class="text--primary">
          {{ $t('label.queue_case_label_2', { email: form.email }) }}
        </p>
        <v-row class="pt-1 pb-4">
          <v-col class="text-right">
            <v-btn v-if="!isResend" :loading="loading" bottom class="ml-2 btn-small text-capitalize" @click="handleToListQueue">
              {{ $t('label.see_delivery_process') }}
            </v-btn>
            <v-btn color="success" :loading="loading" bottom class="ml-2 btn-small text-capitalize" @click="show = false">
              {{ $t('label.done') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>
<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'

export default {
  name: 'DialogExportForm',
  components: {
    ValidationObserver,
    ValidationProvider
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    listQuery: {
      type: Object,
      default: null
    },
    isResend: {
      type: Boolean,
      default: false
    },
    isHistoryCase: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      show: this.showDialog,
      isSuccess: false,
      loading: false
    }
  },
  watch: {
    showDialog(value) {
      this.show = value
      this.isSuccess = !value
    },
    show(value) {
      if (!value) this.form.email = ''
      this.$emit('update:show', value)
    }
  },
  methods: {
    async sendData() {
      const valid = await this.$refs.observer.validate()
      this.loading = true
      if (!valid) {
        this.loading = false
        return
      }
      let resp
      if (this.isResend) {
        const data = {
          jobID: this.form.job_id,
          body: this.form
        }
        resp = await this.$store.dispatch('exportReports/resendEmailQueue', data)
      } else {
        this.listQuery.email = this.form.email
        if (this.isHistoryCase) {
          resp = await this.$store.dispatch('exportReports/exportHistoryCaseQueue', this.listQuery)
        } else {
          resp = await this.$store.dispatch('exportReports/exportCaseQueue', this.listQuery)
        }
        delete this.listQuery['email']
      }
      this.loading = false
      if (resp.data.status !== 422) this.isSuccess = true
      if (this.$refs.observer) this.$refs.observer.reset()
    },
    handleToListQueue() {
      this.$router.push('/laporan/queue-list-all')
    }
  }
}
</script>
