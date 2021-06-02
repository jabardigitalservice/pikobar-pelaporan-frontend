<template>
  <v-dialog v-model="show" :max-width="maxWidthDialog">
    <v-card class="pa-7">
      <v-row class="mx-0 mb-6" justify="center">
        <img src="@/static/confirmation-logo.svg" alt="confirmation-logo">
      </v-row>
      <v-row v-if="query && query.data.verified_status === 'verified'" class="mx-0 mb-6 text-center" justify="center">
        {{ $t('label.verification_confirmation_message') }}
      </v-row>
      <v-row v-else class="mx-0 mb-3 text-center" justify="center">
        {{ $t('label.rejection_confirmation_message') }}
      </v-row>
      <v-row v-if="query && query.data.verified_status === 'declined'" class="mx-0 mb-3">
        <ValidationObserver ref="observer" class="full-width">
          <ValidationProvider
            v-slot="{ errors }"
            rules="required"
          >
            <label class="required">{{ $t('label.reason_for_declined') }}</label>
            <v-textarea
              v-model="query.data.verified_comment"
              :error-messages="errors"
              :placeholder="$t('label.reason_for_declined_placeholder')"
              solo-inverted
            />
          </ValidationProvider>
        </ValidationObserver>
      </v-row>
      <v-row class="mx-0">
        <v-col class="pa-0 mr-6">
          <v-btn
            color="grey"
            width="100%"
            min-width="0px"
            outlined
            @click="show = false"
          >
            <span class="input-label text-capitalize decline">{{ $t('label.canceled') }}</span>
          </v-btn>
        </v-col>
        <v-col class="pa-0">
          <v-btn
            v-if="query && query.data.verified_status === 'verified'"
            color="#2ead64"
            width="100%"
            min-width="0px"
            @click="onSubmit(true)"
          >
            <span class="text-capitalize verify">{{ $t('label.verify_case') }}</span>
          </v-btn>
          <v-btn
            v-else
            color="#EB5757"
            width="100%"
            min-width="0px"
            @click="onSubmit(false)"
          >
            <span class="text-capitalize verify">{{ $t('label.decline_case') }}</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>
<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
export default {
  name: 'VerificationConfirmation',
  components: {
    ValidationProvider,
    ValidationObserver
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    queryData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      show: false,
      query: null
    }
  },
  computed: {
    maxWidthDialog() {
      return this.$vuetify.breakpoint.xl ? '20%' : '30%'
    }
  },
  watch: {
    showDialog(value) {
      this.show = value
      if (value) {
        this.query = this.queryData
      }
    },
    show(value) {
      this.$emit('update:show', value)
    }
  },
  methods: {
    async onSubmit(isVerified) {
      if (!isVerified) {
        const valid = await this.$refs.observer.validate()
        if (!valid) {
          return
        }
      }
      this.$emit('update:query', this.query)
      this.$emit('update:submitData', true)
      this.show = false
    }
  }
}
</script>
<style>
.input-label {
  color: #a0a0a0 !important;
  font-weight: 500 !important;
}
.verify {
  color: white;
  font-size: 16px;
}
.decline {
  font-size: 16px;
}
.full-width {
  width: 100%;
}
.required::after {
  content: " *";
  color: red;
}
</style>
