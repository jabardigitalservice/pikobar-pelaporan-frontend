<template>
  <v-skeleton-loader
    :loading="loading"
    type="article"
  >
    <v-card
      class="statistic mx-auto"
      outlined
    >
      <v-card-title class="title ml-0">
        {{ $t('label.positive') }} {{ $t('label.covid19') }}
      </v-card-title>
      <v-card-subtitle class="sub-title pb-3">
        {{ $t('label.positive_confirmed_covid19') }}
      </v-card-subtitle>
      <v-card-text class="mt-2">
        <span class="total font-weight-bold">
          {{ totalConfirmed | number }} {{ $t('label.people') | capitalize }}
        </span>
      </v-card-text>
    </v-card>
  </v-skeleton-loader>
</template>

<script>
export default {
  name: 'StatisticTotalConfirmed',
  props: {
    loading: {
      type: Boolean,
      default: true
    },
    totalConfirmed: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style scoped>
.statistic {
  background-color: #fdeded !important;
  border: 1px solid #eb5757 !important;
}
.statistic .title {
  color: #eb5757 !important;
}
.statistic .sub-title {
  height: 69px;
  max-height: 69px;
  color: #eb5757 !important;
}
.statistic .total {
  font-size: 2em;
  color: #eb5757 !important;
}
</style>
