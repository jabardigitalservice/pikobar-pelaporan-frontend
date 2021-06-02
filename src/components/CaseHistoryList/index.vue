<template>
  <v-simple-table fixed-header height="500px">
    <template v-slot:default>
      <thead>
        <tr>
          <th scope="col" class="text-left">#</th>
          <th scope="col" class="text-left">{{ $t('label.criteria').toUpperCase() }}</th>
          <th scope="col" class="text-left">{{ $t('label.results').toUpperCase() }}</th>
          <th scope="col" class="text-left">{{ $t('label.current_location').toUpperCase() }}</th>
          <th scope="col" class="text-left">{{ $t('label.update_date').toUpperCase() }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in listHistoryCase" :key="index">
          <td>{{ getTableRowNumbering(index) }}</td>
          <td><status :status="item.status" /></td>
          <td><final-result :final-result="item.final_result" /></td>
          <td>
            <div v-if="item.current_location_type === 'RUMAH'">
              {{ item.homeAddress }}
            </div>
            <div v-else>
              {{ item.current_location_address }}
            </div>
          </td>
          <td>{{ formatDatetime(item.last_changed, "DD MMMM YYYY") }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>
<script>
import { formatDatetime } from '@/utils/parseDatetime'

export default {
  name: 'CaseHistoryList',
  props: {
    listHistoryCase: {
      type: Array,
      default: null
    }
  },
  methods: {
    formatDatetime,
    getTableRowNumbering(index) {
      return (index + 1)
    }
  }
}
</script>
