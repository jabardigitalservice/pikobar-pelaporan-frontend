<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialogPopup"
      persistent
      max-width="30%"
    >
      <ValidationObserver ref="observer">
        <v-form
          ref="form"
          lazy-validation
        >
          <v-card>
            <v-card-title class="justify-center">
              <img src="@/static/hospital-reference-1.svg">
            </v-card-title>
            <v-card-title class="justify-center">
              <div class="font-weight-bold" style="font-size: 16px">
                {{ $t('label.patient_rejection_verification') }}
              </div>
            </v-card-title>
            <v-container>
              <v-row>
                <v-col>
                  <label class="require">{{ $t('label.give_reason_for_rejection') }}</label>
                  <ValidationProvider
                    v-slot="{ errors }"
                    rules="required"
                  >
                    <v-textarea
                      v-model="formReferral.transfer_comment"
                      :placeholder="$t('label.reference_rejected_because')"
                      :error-messages="errors"
                      solo
                    />
                  </ValidationProvider>
                </v-col>
              </v-row>
            </v-container>
            <v-card-actions>
              <v-col>
                <v-btn
                  class="mr-5"
                  block
                  @click="closeData"
                >
                  {{ $t('label.canceled') }}
                </v-btn>
              </v-col>
              <v-col>
                <v-btn
                  color="#EB5757"
                  block
                  @click="onHandleSave"
                >
                  {{ $t('label.decline').toUpperCase() }}
                </v-btn>
              </v-col>
            </v-card-actions>
          </v-card>
        </v-form>
      </ValidationObserver>
    </v-dialog>
  </v-row>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import EventBus from '@/utils/eventBus'
import { mapGetters } from 'vuex'
export default {
  name: 'DialogReferralDecline',
  components: {
    ValidationObserver,
    ValidationProvider
  },
  props: {
    dialogDecline: {
      type: Boolean,
      default: false
    },
    detailTransfer: {
      type: Object,
      default: null
    },
    detailCase: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      dialogReferral: false,
      formReferral: {}
    }
  },
  computed: {
    dialogPopup: {
      get() {
        return this.dialogDecline
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
      await this.$emit('update:showDecline', false)
      this.formReferral = {}
    },
    async onHandleSave() {
      const valid = await this.$refs.observer.validate()
      if (!valid) {
        return
      }
      const data = {
        idCase: this.detailCase._id,
        idTransfer: this.detailTransfer._id,
        actions: 'decline',
        body: this.formReferral
      }
      const response = await this.$store.dispatch('hospitalRefferal/actionHospitalReferral', data)
      if (response) {
        this.$emit('update:showDecline', false)
        EventBus.$emit('refreshPageListReferral', true)
        await this.$store.dispatch('toast/successToast', this.$t('label.reference_rejected'))
      }
      this.formReferral = {}
    }
  }
}
</script>

<style scoped>

</style>
