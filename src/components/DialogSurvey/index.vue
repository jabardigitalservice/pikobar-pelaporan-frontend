<template>
  <v-dialog v-model="show" persistent max-width="50%">
    <v-card class="pa-7">
      <v-card-title>
        <v-spacer />
        <v-icon @click="show = false">mdi-close</v-icon>
      </v-card-title>
      <v-row class="mx-0 mb-5 text-center" justify="center">
        <img src="../../static/survey-img.svg" alt="survey-img">
      </v-row>
      <v-row class="mx-10" justify="center">
        <p class="font-weight-bold text-center">{{ $t('label.hello') }}, {{ fullName }}</p>
      </v-row>
      <v-row class="mx-10" justify="center">
        <p class="text-center">{{ $t('label.survei_label') }}</p>
      </v-row>
      <v-row class="mx-0 mt-5" justify="center">
        <v-btn
          color="primary"
          style="height: 45px;min-width: 145px;"
          @click="handleSurvey"
        >
          {{ $t('label.take_survey') }}
        </v-btn>
      </v-row>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  setUserSurvey
} from '@/utils/cookies'

export default {
  name: 'DialogSurvey',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: this.showDialog
    }
  },
  computed: {
    ...mapGetters('user', [
      'fullName'
    ])
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
    handleSurvey() {
      setUserSurvey(false)
      this.show = false
      window.open(process.env.VUE_APP_SURVEY_API, '_blank')
    }
  }
}
</script>
