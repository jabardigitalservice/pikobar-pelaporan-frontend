<template>
  <v-simple-table fixed-header height="500px">
    <template v-slot:default>
      <thead>
        <tr>
          <th scope="col" class="text-left">{{ $t('label.results').toUpperCase() }}</th>
          <th scope="col" class="text-left">{{ $t('label.method').toUpperCase() }}</th>
          <th scope="col" class="text-left">{{ $t('label.sampling').toUpperCase() }}</th>
          <th scope="col" class="text-left">{{ $t('label.test_place').toUpperCase() }}</th>
          <th scope="col" class="text-left">{{ $t('label.test_date').toUpperCase() }}</th>
          <th scope="col" class="text-left">{{ $t('label.update_date').toUpperCase() }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in listHistoryTest" :key="index">
          <td><status :status="item.final_result" /></td>
          <td>{{ item.tool_tester }}</td>
          <td>{{ item.sampling_type }}</td>
          <td>{{ item.test_location ? item.test_location : item.test_other_location }}</td>
          <td>{{ formatDatetime(item.test_date, "DD MMMM YYYY") }}</td>
          <td>{{ formatDatetime(item.updatedAt, "DD MMMM YYYY") }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>
<script>
import { formatDatetime } from '@/utils/parseDatetime'

export default {
  name: 'TestHistoryList',
  props: {
    listHistoryTest: {
      type: Array,
      default: null
    }
  },
  methods: {
    formatDatetime
  }
}
</script>
