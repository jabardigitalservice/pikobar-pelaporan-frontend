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
      <v-container fluid class="pb-0 px-6">
        <p class="text--primary">
          Data hasil ekspor, akan kami kirimkan ke email bawah ini
        </p>
        <v-form ref="form" lazy-validation>
          <v-row align="center">
            <v-col cols="12" md="2" sm="12" class="mb-6">
              <label>{{ $t('label.email') }}</label>
            </v-col>
            <v-col cols="12" md="10" sm="12" :class="{'py-0 pb-3': $vuetify.breakpoint. smAndDown}">
              <ValidationProvider rules="required">
                <v-text-field
                  :label="$t('label.email')"
                  name="username"
                  type="text"
                  solo-inverted
                  required
                />
              </ValidationProvider>
            </v-col>
          </v-row>
        </v-form>
      </v-container>
      <v-container fluid class="pt-0">
        <v-row>
          <v-col class="text-right">
            <v-btn :loading="loading" bottom class="ml-2 btn-small" @click="show = false">
              {{ $t('label.cancel') }}
            </v-btn>
            <v-btn color="success" :loading="loading" bottom class="ml-2 btn-small">
              {{ $t('label.save') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>
<script>
import { ValidationProvider } from 'vee-validate'

export default {
  name: 'DialogExportForm',
  components: {
    ValidationProvider
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: this.showDialog,
      loading: false
    }
  },
  computed: {
    //
  },
  watch: {
    showDialog(value) {
      this.show = value
    },
    show(value) {
      this.$emit('update:show', value)
    }
  },
  methods: {
    //
  }
}
</script>
