<template>
  <v-dialog v-model="show" persistent max-width="32%">
    <v-card class="pa-7">
      <v-row class="mx-0 mb-8" justify="center" align="center">
        <img src="@/static/hospital_referral_succses.svg" alt="hospital-referral-succses">
      </v-row>
      <v-row class="mx-0 mb-5 text-center" justify="center">
        {{ message }}
      </v-row>
      <v-row class="mx-0" justify="center">
        <v-btn
          color="primary"
          block
          @click="show = false"
        >
          {{ $t('label.back') }}
        </v-btn>
      </v-row>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'DialogReferral',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      show: this.showDialog
    }
  },
  watch: {
    showDialog(value) {
      this.show = value
    },
    show(value) {
      this.$emit('update:show', value)
    }
  }
}
</script>
<style></style>
