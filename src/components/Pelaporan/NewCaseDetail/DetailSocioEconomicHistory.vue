<template>
  <div>
    <v-row class="row-detail">
      <v-col
        cols="12"
        md="3"
        sm="12"
      >
        <p>{{ $t('label.physical_activity') }} </p>
      </v-col>
      <v-col>
        <p>{{ detail.last_history.pysichal_activity !== null ? listPhysicalActivity[detail.last_history.pysichal_activity].text:'-' }}</p>
      </v-col>
    </v-row>
    <v-row class="row-detail">
      <v-col
        cols="12"
        md="3"
        sm="12"
      >
        <p>{{ $t('label.smoking') }}</p>
      </v-col>
      <v-col>
        <p><answer-list :answer="detail.last_history.smoking" /></p>
      </v-col>
    </v-row>
    <v-row class="row-detail">
      <v-col
        cols="12"
        md="3"
        sm="12"
      >
        <p>{{ $t('label.consume_alcohol') }}</p>
      </v-col>
      <v-col>
        <p><answer-list :answer="detail.last_history.consume_alcohol" /></p>
      </v-col>
    </v-row>
    <v-row class="row-detail">
      <v-col
        cols="12"
        md="3"
        sm="12"
      >
        <p>{{ $t('label.income') }}</p>
      </v-col>
      <v-col>
        <p>{{ detail.income ? incomeList[detail.income].text:'-' }}</p>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { incomeList, listPhysicalActivity } from '@/utils/constantOption'
export default {
  name: 'DetailSocioEconomicHistory',
  props: {
    detail: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      incomeList: incomeList,
      listPhysicalActivity: listPhysicalActivity
    }
  }
}
</script>
