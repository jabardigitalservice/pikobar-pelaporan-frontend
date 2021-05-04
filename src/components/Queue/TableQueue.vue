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
                  <v-list-item :disabled="item.job_progress < 100" @click="handleResend(item)">
                    Resend Ekspor File
                  </v-list-item>
                  <v-divider class="mx-4 my-1" />
                  <v-list-item @click="handleListEmailRecipient(item.job_id)">
                    Lihat Riwayat Email
                  </v-list-item>
                </v-card>
              </v-menu>
            </v-card-actions>
          </td>
        </tr>
      </template>
    </v-data-table>
    <dialog-export-form
      :show-dialog="dialogExportCase"
      :show.sync="dialogExportCase"
      :is-resend="isResend"
      :form="formResend"
    />
    <list-email-recipient
      :show-dialog="dialogListEmailRecipient"
      :show.sync="dialogListEmailRecipient"
      :is-loading="loadingListEmailRecipient"
      :list-email-recipient="listEmailRecipient"
    />
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
      dialogExportCase: false,
      dialogListEmailRecipient: false,
      loadingListEmailRecipient: false,
      listEmailRecipient: [],
      isResend: false,
      formResend: {},
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
    },
    handleResend(val) {
      val.name = val.job_name

      // delete value not use on form resend email
      delete val['job_name']
      delete val['email']
      delete val['_id']
      delete val['job_status']
      delete val['job_progress']
      delete val['createdAt']

      this.formResend = val
      this.dialogExportCase = true
      this.isResend = true
    },
    async handleListEmailRecipient(jobID) {
      this.dialogListEmailRecipient = true
      this.loadingListEmailRecipient = true
      const resp = await this.$store.dispatch('exportReports/getListEmailRecipientQueue', jobID)
      this.listEmailRecipient = resp?.data?.history || []
      this.loadingListEmailRecipient = false
    }
  }
}
</script>
