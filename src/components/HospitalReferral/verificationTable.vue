<template>
  <v-col auto>
    <v-data-table
      :key="listReferral.length"
      :headers="tableHeaders"
      :items="listReferral"
      :mobile-breakpoint="0"
      :no-data-text="$t('label.data_empty')"
      :items-per-page="listQuery.limit"
      hide-default-footer
    >
      <template v-slot:item="{ item, index }">
        <tr>
          <td>{{ getTableRowNumbering(index) }}</td>
          <td> {{ item.case.nik }} </td>
          <td> {{ item.case.name }} </td>
          <td> {{ item.case.age }} </td>
          <td> {{ item.case.gender }} </td>
          <td><status :status="item.case.status" /></td>
          <td>
            <div v-if=" item.case.stage === '0'">
              {{ $t('label.process') }}
            </div>
            <div v-else>
              {{ $t('label.done') }}
            </div>
          </td>
          <td>
            <div v-if="unitType === 'puskesmas'">
              {{ item.transfer_to_unit_name }}
            </div>
            <div v-else-if="typeReferral === 'out'">
              {{ item.transfer_to_unit_name }}
            </div>
            <div v-else>
              {{ item.transfer_from_unit_name }}
            </div>
          </td>
          <td><status-referral :status="item.transfer_status" /></td>
          <td>
            <v-card-actions
              v-if="unitType !== 'rumahsakit' || item.transfer_status !== 'declined'"
            >
              <v-menu
                :close-on-content-click="false"
                :nudge-width="100"
                :nudge-left="220"
                :nudge-top="40"
                offset-y
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    class="ma-1"
                    color="#828282"
                    style="text-transform: none;height: 30px;min-width: 30px;"
                    tile
                    outlined
                    v-on="on"
                  >
                    {{ $t('label.choose_action') }}
                    <v-icon style="color: #009D57;font-size: 2rem;" right>
                      mdi-menu-down
                    </v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <div>
                    <v-list-item @click="handleDetail(item, item.case._id)">
                      {{ $t('label.view_detail') }}
                    </v-list-item>
                    <div
                      v-if="unitType !== 'rumahsakit' && item.transfer_status === 'declined'"
                    >
                      <v-list-item
                        @click="handleRevise(item, item.case._id)"
                      >
                        {{ $t('label.fix_data') }}
                      </v-list-item>
                      <v-divider />
                      <v-list-item
                        style="color: #EB5757 !important;"
                        @click="handleDelete(item, item.case._id)"
                      >
                        {{ $t('label.remove_reference') }}
                      </v-list-item>
                    </div>
                  </div>
                </v-card>
              </v-menu>
            </v-card-actions>
          </td>
        </tr>
      </template>
    </v-data-table>
    <dialog-detail-case
      :show-dialog="dialogDetailCase"
      :show.sync="dialogDetailCase"
      :detail-case="detailTransfer.case"
      :case-detail.sync="detailTransfer.case"
      :detail-transfer="detailTransfer"
      :transfer-detail.sync="detailTransfer"
      :list-history-case="listHistoryCase"
      :referral-history-case="referralHistoryCase"
      :user-unit-type="unitType"
      :title-detail="$t('label.detail_case')"
    />
    <dialog-hospital-referral
      :dialog="dialog"
      :dialog-popup.sync="dialog"
      :form-referral="formReferral"
      :patient-registered="patientRegistered"
      :is-edit="isEdit"
      :message-rejection="messageRejection"
      :id-transfer="idTransfer"
    />
  </v-col>
</template>

<script>
import { mapGetters } from 'vuex'
import EventBus from '@/utils/eventBus'
import { formatDatetime } from '@/utils/parseDatetime'

export default {
  name: 'VerificationTableReferral',
  props: {
    listReferral: {
      type: Array,
      default: null
    },
    typeReferral: {
      type: String,
      default: ''
    },
    listQuery: {
      type: Object,
      default: null
    },
    tableHeaders: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      dialog: false,
      patientRegistered: false,
      isEdit: false,
      formatDate: 'YYYY/MM/DD',
      formReferral: {},
      dialogDetailCase: false,
      detailTransfer: {},
      listHistoryCase: [],
      referralHistoryCase: [],
      idTransfer: null,
      messageRejection: null
    }
  },
  computed: {
    ...mapGetters('user', [
      'unitType'
    ])
  },
  methods: {
    formatDatetime,
    getTableRowNumbering(index) {
      return ((this.listQuery.page - 1) * this.listQuery.limit) + (index + 1)
    },
    async handleDetail(tranferDetail, idCase) {
      this.detailTransfer = {}
      this.detailTransfer = tranferDetail
      const responseHistory = await this.$store.dispatch('reports/listHistoryCase', idCase)
      const responseReferralHistory = await this.$store.dispatch('hospitalRefferal/caseHospitalReferralHistory', idCase)
      this.listHistoryCase = responseHistory
      this.referralHistoryCase = responseReferralHistory.data
      this.dialogDetailCase = true
    },
    async handleRevise(tranferDetail, idCase) {
      const responseHistory = await this.$store.dispatch('reports/detailHistoryCase', idCase)
      this.formReferral = {
        ...tranferDetail.case,
        ...responseHistory,
        yearsOld: Math.floor(tranferDetail.case.age),
        monthsOld: Math.ceil((tranferDetail.case.age - Math.floor(tranferDetail.case.age)) * 12)
      }
      this.formReferral.birth_date = await this.formatDatetime(this.formReferral.birth_date, this.formatDate)
      this.formReferral.first_symptom_date = await this.formatDatetime(this.formReferral.first_symptom_date, this.formatDate)
      this.idTransfer = tranferDetail._id
      this.messageRejection = tranferDetail.transfer_comment
      this.isEdit = true
      this.dialog = true
    },
    async handleDelete(tranferDetail, idCase) {
      const data = {
        idCase: idCase,
        idTransfer: tranferDetail._id,
        actions: 'abort',
        body: {
          transfer_comment: null
        }
      }
      const response = await this.$store.dispatch('hospitalRefferal/actionHospitalReferral', data)
      if (response) {
        EventBus.$emit('refreshPageListReferral', true)
        await this.$store.dispatch('toast/successToast', this.$t('success.reference_successfully_deleted'))
      }
    }
  }
}
</script>
