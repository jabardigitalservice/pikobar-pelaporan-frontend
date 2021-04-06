<template>
  <v-col auto>
    <v-data-table
      :headers="headers"
      :items="listQueue"
      :mobile-breakpoint="0"
      :no-data-text="$t('label.data_empty')"
      :items-per-page="listQuery.limit"
      :loading="isLoading"
      hide-default-footer
    >
      <template v-slot:item="{ item, index }">
        <tr>
          <td>{{ getTableRowNumbering(index) }}</td>
          <td class="pl-4 pr-0">{{ item.file_name }}</td>
          <td class="px-0 text-center"><span>{{ formatDatetime(item.createdAt, 'DD MMMM YYYY') }}</span></td>
          <td class="px-0 text-center">{{ statusQueueJob(item.job_status) }}</td>
          <td class="px-0">
            <v-row>
              <v-col>
                <v-progress-linear
                  v-model="item.job_progress"
                  :color="colorProgressBar(item.job_progress)"
                  height="15"
                  rounded
                />
              </v-col>
              <v-col cols="1" class="px-0">
                <div>{{ Math.ceil(item.job_progress) }}%</div>
              </v-col>
            </v-row>
          </td>
          <td>
            <v-card-actions>
              <v-menu
                :close-on-content-click="false"
                :nudge-width="100"
                :nudge-left="220"
                :nudge-top="40"
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
  name: 'TableQueue',
  props: {
    listQueue: {
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
        { text: 'Nama File', value: 'file_name', width: 300 },
        { text: 'Tanggal Unduh', value: 'createdAt', width: 120, align: 'center' },
        { text: 'Status', value: 'job_status', width: 100, align: 'center' },
        { text: 'Progress', value: 'job_progress', align: 'center' },
        { text: 'AKSI', value: 'actions', sortable: false, width: 150, align: 'center' }
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
    },
    colorProgressBar(val) {
      if (val < 50) {
        return 'red'
      } else if (val < 75) {
        return 'orange'
      } else {
        return 'primary'
      }
    },
    statusQueueJob(val) {
      if (val === 'Error') {
        return this.$t('label.failed')
      } else if (val === 'Progress') {
        return this.$t('label.processed')
      } else {
        return this.$t('label.done')
      }
    }
  }
}
</script>
