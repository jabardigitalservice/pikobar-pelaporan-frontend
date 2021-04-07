<template>
  <div>
    <v-skeleton-loader
      v-show="false"
      :loading="loading"
      type="article"
    >
      <v-card class="d-block pa-1 mx-auto header-survey-list">
        <v-container>
          <v-row justify="space-between">
            <v-col cols="auto">
              <v-card-text class="header-survey-text">
                <div>{{ $t('label.total_case_data') }} : {{ totalData }}</div>
                <div>{{ fullName }}</div>
              </v-card-text>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-skeleton-loader>
    <v-card
      outlined
      class="mt-2"
    >
      <v-row>
        <v-col cols="12" md="4" sm="4" class="ma-1">
          <search
            :list-query="listQuery"
            :handle-search="handleSearch"
          />
        </v-col>
        <v-col cols="12" md="2" sm="2" class="mr-4">
          <v-btn
            color="primary"
            block
            outlined
            :disabled="multipleSelect"
            @click="multipleSelect = !multipleSelect"
          >
            <v-icon left>
              mdi-table-edit
            </v-icon>
            {{ $t('label.multiple_update') }}
          </v-btn>
        </v-col>
        <v-col cols="12" md="2" sm="2" class="pr-0">
          <v-btn
            v-if="roles[0] !== 'faskes'"
            color="#27AE60"
            block
            outlined
            @click="showImportForm = true"
          >
            <v-icon left>
              mdi-download
            </v-icon>
            {{ $t('label.import') }}
          </v-btn>
        </v-col>
        <v-col cols="12" md="2" sm="2" class="px-0">
          <v-card-actions class="py-0">
            <v-menu
              :close-on-content-click="false"
              offset-y
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  color="#27AE60"
                  block
                  tile
                  outlined
                  v-on="on"
                >
                  <v-icon left>mdi-upload</v-icon>
                  {{ $t('label.export') }}
                </v-btn>
              </template>
              <v-card>
                <v-list-item @click="onExportCase">
                  {{ $t('label.export_patient_data') }}
                </v-list-item>
                <v-list-item @click="onExportHistoryCase">
                  {{ $t('label.export_clinical_history') }}
                </v-list-item>
                <v-list-item @click="handleToListQueue">
                  {{ $t('label.export_history') }}
                </v-list-item>
              </v-card>
            </v-menu>
          </v-card-actions>
        </v-col>
        <v-col cols="12" md="1" sm="1" class="px-0">
          <v-btn
            color="primary"
            block
            @click="handleFilter"
          >
            {{ $t('label.filter') }}
            <v-icon v-if="!showFilter">mdi-chevron-right</v-icon>
            <v-icon v-else>mdi-chevron-down</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <div
        v-if="showFilter"
        class="ma-2"
      >
        <case-filter
          :list-query="listQuery"
          :query-list.sync="listQuery"
          :reset-statistic.sync="resetStatistic"
          :on-search="handleSearch"
        />
      </div>
      <hr>
      <v-row align="center" justify="space-between">
        <v-col>
          <div class="title">
            {{ $t('label.case_data') }}
          </div>
        </v-col>
      </v-row>
      <hr class="table-divider">
      <v-row>
        <table-case
          :list-kasus="listKasus"
          :roles-widget="rolesWidget"
          :loading-table="loadingTable"
          :multiple-select="multipleSelect"
          :handle-detail="handleDetail"
          :handle-print-p-e-form="handlePrintPEForm"
          :handle-delete-case="handleDeleteCase"
          :selected="selected"
          :selected-case.sync="selected"
          :list-query="listQuery"
          :options-table="optionsDataTable"
          :options-data-table.sync="optionsDataTable"
        />
      </v-row>
    </v-card>
    <v-toolbar
      v-if="multipleSelect"
      color="primary"
      class="multiple-action"
      style="border-radius: 15px;"
      dark
    >
      <v-row
        class="mx-auto my-12 center"
        align="center"
        justify="center"
      >
        <v-col cols="4" class="px-0">
          <v-toolbar-title class="text-wrap subtitle-1">
            {{ selected.length + ` ` + $t('label.choose_patient') }}
          </v-toolbar-title>
        </v-col>
        <v-col cols="1">
          <v-divider
            style="border: 1px solid white; height: 40px;"
            inset
            vertical
          />
        </v-col>
        <v-col cols="5" class="px-0">
          <v-toolbar-title
            class="text-wrap subtitle-1"
            style="cursor: pointer;"
            @click="handleUpdateMultipleStatusCase"
          >
            <v-icon left>mdi-pencil-box-outline</v-icon>
            {{ $t('label.status_update') }}
          </v-toolbar-title>
        </v-col>
        <v-col cols="1">
          <v-divider
            style="border: 1px solid white; height: 40px;"
            inset
            vertical
          />
        </v-col>
        <v-col cols="1" class="pl-0">
          <v-icon @click="cancelMultiple">
            mdi-close-circle-outline
          </v-icon>
        </v-col>
      </v-row>
    </v-toolbar>
    <pagination
      :total="totalList"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      :on-next="onNext"
    />
    <dialog-delete
      :dialog="dialog"
      :data-deleted="dataDelete"
      :dialog-delete.sync="dialog"
      :delete-date.sync="dataDelete"
      :store-path-delete="`reports/deleteReportCase`"
      :store-path-get-list="`reports/listReportCase`"
      :list-query="listQuery"
    />
    <dialog-detail-case
      :show-dialog="dialogDetailCase"
      :show.sync="dialogDetailCase"
      :detail-case="detailCase"
      :close-contact-case="closeContactCase"
      :case-detail.sync="detailCase"
      :list-history-case="listHistoryCase"
      :referral-history-case="referralHistoryCase"
      :title-detail="$t('label.detail_case')"
    />
    <dialog-update-case
      :show-dialog="dialogUpdateCase"
      :show.sync="dialogUpdateCase"
      :form-pasien="formPasien"
    />
    <dialog-update-history-case
      :show-dialog="dialogHistoryCase"
      :show.sync="dialogHistoryCase"
      :form-riwayat-pasien="formRiwayatPasien"
      :form-pasien="formPasien"
    />
    <dialog-export-form
      :show-dialog="dialogExportCase"
      :show.sync="dialogExportCase"
      :list-query="listQuery"
      :form="{}"
    />
    <dialog-failed
      :show-dialog="failedDialog"
      :show.sync="failedDialog"
      :title="$t('errors.file_failed_upload')"
      :message="errorMessage"
    />
    <dialog-succsess
      :show-dialog="successDialog"
      :show.sync="successDialog"
      :title="$t('label.congratulation')"
      :message="$t('label.import_success_message')"
    />
    <import-form
      :show-import-form="showImportForm"
      :refresh-page="handleSearch"
      :show.sync="showImportForm"
      :failed.sync="failedDialog"
      :success.sync="successDialog"
      :message.sync="errorMessage"
    />
    <dialog-update-status-case
      :show-dialog="dialogUpdateMultiple"
      :show.sync="dialogUpdateMultiple"
      :refresh-page.sync="refreshPage"
      :form-pasien="formStatusCase"
      :selected-case="selected"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import EventBus from '@/utils/eventBus'
import FileSaver from 'file-saver'
import { rolesWidget } from '@/utils/constantVariable'
import { formatDatetime } from '@/utils/parseDatetime'
export default {
  name: 'LaporanList',
  data() {
    return {
      selected: [],
      loading: true,
      resetStatistic: false,
      loadingTable: false,
      multipleSelect: false,
      dialogUpdateMultiple: false,
      refreshPage: false,
      totalConfirmation: 0,
      totalProbable: 0,
      totalSuspect: 0,
      totalCloseCase: 0,
      queryReportCase: {
        address_district_code: ''
      },
      rolesWidget,
      optionsDataTable: {},
      formStatusCase: {
        status: '',
        final_result: '',
        last_date_status_patient: ''
      },
      listQuery: {
        address_district_code: '',
        address_subdistrict_code: '',
        address_village_code: '',
        status: '',
        final_result: '',
        stage: '',
        page: 1,
        limit: 100,
        search: '',
        start_date: '',
        end_date: '',
        verified_status: 'verified',
        sort: 'updatedAt:asc'
      },
      countingReports: null,
      dialog: false,
      showFilter: false,
      dataDelete: null,
      formatDate: 'YYYY/MM/DD',
      failedDialog: false,
      showImportForm: false,
      errorMessage: null,
      successDialog: false,
      detailCase: {},
      closeContactCase: [],
      listCloseContact: [],
      listTransmissionArea: [],
      idCase: null,
      idUniqueCase: '',
      listHistoryCase: [],
      referralHistoryCase: [],
      dialogDetailCase: false,
      dialogHistoryCase: false,
      dialogUpdateCase: false,
      dialogCloseContact: false,
      dialogTransmissionArea: false,
      dialogHistoryTravel: false,
      dialogInspectionSupport: false,
      dialogPublicPlace: false,
      dialogExportCase: false
    }
  },
  computed: {
    ...mapGetters('reports', [
      'listKasus',
      'totalData',
      'totalList',
      'formPasien',
      'formRiwayatPasien'
    ]),
    ...mapGetters('user', [
      'roles',
      'fullName',
      'district_user'
    ])
  },
  watch: {
    'optionsDataTable': {
      handler: function(value) {
        if (value.sortBy !== undefined) {
          if ((value.sortBy[0] !== undefined) && (value.sortDesc[0])) {
            this.listQuery.sort = 'updatedAt:desc'
          } else if ((value.sortBy[0] !== undefined) && (!value.sortDesc[0])) {
            this.listQuery.sort = 'updatedAt:asc'
          } else {
            this.listQuery.sort = 'updatedAt:desc'
          }

          if (Object.keys(this.listQuery.sort).length > 0) {
            this.handleSearch()
          }
        }
      },
      immediate: true
    },
    refreshPage(value) {
      if (value) {
        this.multipleSelect = false
        this.refreshPage = false
        this.selected = []
        this.handleSearch()
      }
    },
    'resetStatistic'(value) {
      if (value) {
        this.getStatistic()
      }
    }
  },
  async mounted() {
    if (rolesWidget['dinkesKotaAndFaskes'].includes(this.roles[0])) this.listQuery.address_district_code = this.district_user
    this.queryReportCase.address_district_code = this.district_user
    EventBus.$on('refreshPageListReport', (value) => {
      this.handleSearch()
    })
  },
  methods: {
    formatDatetime,
    async handleDetail(item, id) {
      this.$router.push(`/laporan/detail-report/${id}`)
    },
    handleNewDetail(item, id) {
      this.$router.push(`/laporan/detail-report/${id}`)
    },
    handleFilter() {
      this.showFilter = !this.showFilter
    },
    async handlePrintPEForm(id, caseCode) {
      const response = await this.$store.dispatch('exportReports/printPEForm', id)
      const fileName = `${this.$t('label.pe_report')} - ${caseCode}.pdf`
      FileSaver.saveAs(response, fileName)
    },
    async handleDeleteCase(item) {
      this.dialog = true
      this.dataDelete = item
    },
    async handleSearch() {
      this.listQuery.page = 1
      this.loadingTable = true
      await this.$store.dispatch('reports/listReportCase', this.listQuery)
      await this.getStatistic()
      this.loadingTable = false
    },
    async getListCloseContactByCase(id) {
      const response = await this.$store.dispatch('closeContactCase/getListCloseContactByCase', id)
      this.listCloseContact = response.data
    },
    getTableRowNumbering(index) {
      return ((this.listQuery.page - 1) * this.listQuery.limit) + (index + 1)
    },
    async onNext() {
      await this.$store.dispatch('reports/listReportCase', this.listQuery)
    },
    async getStatistic() {
      const listQueryStatistic = {
        address_district_code: this.listQuery.address_district_code,
        address_subdistrict_code: this.listQuery.address_subdistrict_code,
        address_village_code: this.listQuery.address_village_code,
        status: this.listQuery.status,
        final_result: this.listQuery.final_result,
        min_date: this.listQuery.start_date,
        max_date: this.listQuery.end_date
      }

      const response = await this.$store.dispatch('reports/countReportCase', listQueryStatistic)
      if (response) this.loading = false
      const { data } = response || null
      this.totalConfirmation = data ? data.confirmed : 0
      this.totalProbable = data ? data.probable : 0
      this.totalSuspect = data ? data.suspect : 0
      this.totalCloseCase = data ? data.closeContact : 0
    },
    async onExportCase() {
      this.dialogExportCase = true
    },
    handleToListQueue() {
      this.$router.push('/laporan/queue-list-all')
    },
    async onExportHistoryCase() {
      const response = await this.$store.dispatch('exportReports/exportExcelHistory', this.listQuery)
      const dateNow = Date.now()
      const fileName = `Data Riwayat Klinis ${this.fullName} - ${formatDatetime(dateNow, 'DD/MM/YYYY HH:mm')} WIB.xlsx`
      FileSaver.saveAs(response, fileName)
    },
    handleUpdateMultipleStatusCase() {
      this.formStatusCase.status = ''
      this.formStatusCase.final_result = ''
      this.formStatusCase.last_date_status_patient = ''
      this.dialogUpdateMultiple = true
    },
    cancelMultiple() {
      this.formStatusCase.status = ''
      this.formStatusCase.final_result = ''
      this.formStatusCase.last_date_status_patient = ''
      this.multipleSelect = false
      this.selected = []
    }
  }
}
</script>
<style scoped>
  .title {
    font-size: 1.5rem;
    text-transform: uppercase;
    margin-left: 30px;
    color: #828282;
  }
  .align-right {
    text-align: right;
    padding-right: 50px;
  }
  .btn-import-export {
    width: 25%;
    height: 50px !important;
    min-width: 98px !important;
  }
  .margin-right {
    margin-right: 8px;
  }
  .margin-left {
    margin-left: 8px;
  }
  .table-divider {
    margin: 15px 0px 0px 0px;
  }
  .multiple-action {
    position: fixed;
    bottom: 3%;
    left: 40%;
  }
  @media (min-width: 320px) and (max-width: 540px){
    .multiple-action {
      left: 5vh;
      bottom: 10%;
    }
  }
  @media (min-width: 540px) and (max-width: 600px) {
    .multiple-action {
      left: 18vh;
    }
  }
  @media (min-width: 600px) and (max-width: 900px) {
    .multiple-action {
      left: 30vh;
    }
  }
</style>
