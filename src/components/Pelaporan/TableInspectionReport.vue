<template>
  <v-col auto>
    <v-data-table
      :headers="headers"
      :items="listInspectionReport"
      :mobile-breakpoint="0"
      :no-data-text="$t('label.data_empty')"
      :items-per-page="listQuery.limit"
      :loading="isLoading"
      hide-default-footer
    >
      <template v-slot:item="{ item, index }">
        <tr>
          <td>{{ getTableRowNumbering(index) }}</td>
          <td class="pl-4 pr-0">{{ item.name }}</td>
          <td class="pl-4 pr-0">{{ item.address }}</td>
          <td class="pl-4 pr-0">{{ item.short_phone_number }}</td>
          <td class="px-0 text-center"><span>{{ formatDatetime(item.examination_result_date, 'DD MMMM YYYY') }}</span></td>
          <td class="pl-4 pr-0">{{ item.sender_instation }}</td>
          <td>
            <v-card-actions>
              <v-menu
                :close-on-content-click="false"
                :nudge-width="120"
                :nudge-left="200"
                offset-y
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    class="ma-1 action-btn"
                    color="#828282"
                    tile
                    outlined
                    v-on="on"
                  >
                    {{ $t('label.choose_action') }}
                    <v-icon class="action-icon" right>
                      mdi-menu-down
                    </v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-list-item>
                    {{ $t('label.details_examination_results') }}
                  </v-list-item>
                  <v-divider class="mx-4 my-1" />
                  <v-list-item>
                    {{ $t('label.create_pe_report') }}
                  </v-list-item>
                </v-card>
              </v-menu>
            </v-card-actions>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-col>
</template>

<script>
import { formatDatetime } from '@/utils/parseDatetime'
export default {
  name: 'TableInspectionReport',
  props: {
    listInspectionReport: {
      type: Array,
      default: function() { return [] }
    },
    listQuery: {
      type: Object,
      default: null
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      headers: [
        { text: '#', value: '_id', sortable: false, width: 50 },
        { text: this.$t('label.name'), value: 'name', width: 200 },
        { text: this.$t('label.address'), value: 'address', width: 200, align: 'center' },
        { text: this.$t('label.short_phone_number'), value: 'job_status', width: 120, align: 'center' },
        { text: this.$t('label.examination_result_date'), value: 'job_progress', align: 'center' },
        { text: this.$t('label.sender_instation'), value: 'job_progress', align: 'center' },
        { text: this.$t('label.action'), value: 'actions', sortable: false, width: 150, align: 'center' }
      ]
    }
  },
  watch: {
    //
  },
  methods: {
    formatDatetime,
    getTableRowNumbering(index) {
      return ((this.listQuery.page - 1) * this.listQuery.limit) + (index + 1)
    }
  }
}
</script>
