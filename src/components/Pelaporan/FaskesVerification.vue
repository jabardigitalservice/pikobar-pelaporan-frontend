<template>
  <v-dialog v-model="show" :max-width="maxWidthDialog">
    <v-card class="pa-7">
      <v-row class="mx-0 mb-6" justify="center">
        <img src="@/static/confirmation-logo.svg" alt="confirmation-logo">
      </v-row>
      <v-row class="mx-0 mb-6 text-center" justify="center">
        {{ content }}
      </v-row>
      <v-row class="mx-0">
        <v-col class="pa-0">
          <v-btn
            color="#2ead64"
            width="100%"
            min-width="0px"
            @click="onSubmit(true)"
          >
            <span class="text-capitalize verify">{{ $t('label.continue') }}</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'FaskesVerification',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      default: ''
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
    },
    show(value) {
      this.$emit('update:show', value)
    }
  },
  methods: {
    async onSubmit(isVerified) {
      this.$emit('update:query', this.query)
      this.$emit('update:submitData', isVerified)
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
