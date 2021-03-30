<template>
  <v-col auto>
    <v-data-table
      :items="listNotification"
      :mobile-breakpoint="0"
      :no-data-text="$t('label.data_empty')"
      :items-per-page="listQuery.limit"
      :loading="isLoading"
      hide-default-footer
    >
      <template v-slot:item="{ item }">
        <tr
          :style="item.isRead ? '':'background: #C0EDFF 30%;'"
          @click="onRead(item)"
        >
          <td class="pl-4 pr-0"><v-badge class="pb-4" :value="item.isRead ? 0:1" dot overlap /></td>
          <td class="px-0" style="width:10%"><span>{{ timeRemain(item.createdAt) }}</span></td>
          <td class="px-0" style="width:20%"><notification-status :status="item.eventType" :width-chip="'50%'" /></td>
          <td class="px-0">{{ item.message }}</td>
        </tr>
      </template>
    </v-data-table>
    <verification-form
      :show-form="showVerificationForm"
      :show.sync="showVerificationForm"
      :show-confirmation.sync="showConfirmation"
      :case-data="caseDetail"
      :close-contact-case="closeContactCase"
      :query-data="verificationQuery"
      :query.sync="verificationQuery"
    />
    <verification-confirmation
      :show-dialog="showConfirmation"
      :show.sync="showConfirmation"
      :query-data="verificationQuery"
      :query.sync="verificationQuery"
      :submit-data.sync="isSubmit"
    />
    <dialog-failed
      :show-dialog="showFailedDialog"
      :show.sync="showFailedDialog"
      :title="titleDialogFailed"
      :message="''"
    />
  </v-col>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'TableNotification',
  props: {
    listNotification: {
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
      showVerificationForm: false,
      closeContactCase: [],
      showConfirmation: false,
      caseDetail: null,
      showFailedDialog: false,
      isSubmit: false,
      titleDialogFailed: '',
      verificationQuery: {
        'id': '',
        'data': {
          'verified_status': '',
          'verified_comment': ''
        }
      }
    }
  },
  computed: {
    ...mapGetters('user', [
      'roles'
    ])
  },
  watch: {
    async isSubmit(value) {
      if (value) {
        const response = await this.$store.dispatch('reports/verifyCase', this.verificationQuery)
        if (response.status === 200 || response.status === 201) {
          await this.$store.dispatch('toast/successToast', this.verificationQuery.data.verified_status === 'verified' ? this.$t('success.verification_success') : this.$t('success.rejection_success'))
          this.handleSearch()
        }
        this.isSubmit = false
      }
    }
  },
  methods: {
    timeRemain(value) {
      const now = this.$moment()
      const maxVerifiedDate = this.$moment(value)
      return now.to(maxVerifiedDate)
    },
    async onRead(item) {
      if (!item.isRead) {
        await this.$store.dispatch('notifications/onReadNotification', item._id)
        item.isRead = true
      }
      this.handleDetail(item.referenceId, item.eventType)
    },
    async handleDetail(id, eventType) {
      const response = await this.$store.dispatch('reports/detailReportCase', id)
      if (!response?.data) return this.showDialogFailed(true, this.$t('label.data_not_found'))
      if (eventType !== 'CaseCreated') {
        const path = `/laporan/detail-report/${id}`
        if (this.$route.path !== path) this.$router.push(path)
      } else {
        this.$store.commit('animationLottie/SET_LOADING', true)
        const path = `/laporan/detail-report/${id}`
        if (this.roles[0] === 'faskes' && response.data.verified_status === 'declined' && this.$route.path !== path) this.$router.push(path)
        const responseCloseContact = await this.$store.dispatch('closeContactCase/getListCloseContactByCase', id)
        if ((this.roles[0] !== 'faskes' && response.data.verified_status === 'declined')) {
          this.showDialogFailed(true, this.$t('label.case_has_been_rejected'))
        } else if (response.data.verified_status === 'verified') {
          this.showDialogFailed(true, this.$t('label.verification_expired_title'))
        } else {
          this.caseDetail = response.data
          this.closeContactDetail = responseCloseContact.data
          this.showVerificationForm = true
        }
        this.$store.commit('animationLottie/SET_LOADING', false)
      }
    },
    showDialogFailed(isShow, title) {
      this.showFailedDialog = isShow
      this.titleDialogFailed = title
    }
  }
}
</script>
