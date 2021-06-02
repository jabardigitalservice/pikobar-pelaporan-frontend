<template>
  <div>
    <v-chip
      v-if="status === 'CaseCreated'"
      color="#1AAFE6"
      :style="`width: {{ widthChip }}`"
      label
      small
    >
      {{ $t('route.dashboard_case_new') }}
    </v-chip>
    <v-chip
      v-else-if="status === 'CasePending'"
      color="#F49916"
      label
      small
    >
      {{ $t('label.waiting_for_verification') }}
    </v-chip>
    <v-chip
      v-else-if="status === 'CaseVerified'"
      color="#27AE60"
      label
      small
    >
      {{ $t('label.verification_expired_title') }}
    </v-chip>
    <v-chip
      v-else-if="status === 'CaseDeclined'"
      color="#EB5757"
      label
      small
    >
      {{ $t('label.case_rejected') }}
    </v-chip>
    <v-chip
      v-else-if="status === 'ClosecContactFinishedQuarantine'"
      color="#F49916"
      label
      small
    >
      {{ $t('label.close_contact_finished_quarantine') }}
    </v-chip>
    <v-chip
      v-else-if="status === 'CreateCaseIntegrationLabkes'"
      color="#263238"
      class="text--white"
      label
      small
    >
      {{ $t('label.positive_health_laboratory_results') }}
    </v-chip>
    <v-chip
      v-else
      color="#27AE60"
      label
      small
    >
      {{ $t('label.no_status') }}
    </v-chip>
    <span
      v-if="date"
    >
      {{ timeRemain(date) }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'NotificationStatus',
  props: {
    status: {
      type: String,
      default: ''
    },
    date: {
      type: String,
      default: ''
    },
    widthChip: {
      type: String,
      default: '40%'
    }
  },
  methods: {
    timeRemain(value) {
      const now = this.$moment()
      const maxVerifiedDate = this.$moment(value)
      // .add(1, 'days')

      return now.to(maxVerifiedDate)
    }
  }
}
</script>
