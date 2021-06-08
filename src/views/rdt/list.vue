<template>
  <div>
    <v-card class="d-block pa-1 mx-auto header-survey-list">
      <v-container>
        <v-row justify="space-between">
          <v-col cols="auto">
            <v-card-text class="header-survey-text">
              <div>{{ $t('label.total_COVID19_massive_test_results') }} : {{ totalDataRDT }}</div>
              <div>{{ fullName }}</div>
            </v-card-text>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <v-card outlined>
      <v-row>
        <v-col>
          <div class="title ml-4">{{ $t('label.results_test_data') }}</div>
        </v-col>
        <v-col />
      </v-row>
      <filter-test-result
        :list-query="listQuery"
        :query-list.sync="listQuery"
        :on-search="handleSearch"
      />
      <hr>
      <v-row>
        <v-col auto>
          <v-data-table
            :headers="headers"
            :items="rdtList"
            :options.sync="optionsDataTable"
            :mobile-breakpoint="0"
            :no-data-text="$t('label.data_empty')"
            :items-per-page="listQuery.limit"
            :loading="loadingTable"
            hide-default-footer
          >
            <template v-slot:item="{ item, index }">
              <tr>
                <td>{{ getTableRowNumbering(index) }}</td>
                <td>{{ item.id_case ? item.id_case.toUpperCase() : '-' }}</td>
                <td>{{ item.code_test }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.age }} Th</td>
                <td>
                  <div v-if="item.gender === 'P'">{{ $t('label.female_initials') }}</div>
                  <div v-else>{{ $t('label.male_initials') }}</div>
                </td>
                <td>{{ item.rdt_count }}x</td>
                <td>{{ item.pcr_count }}x</td>
                <td>{{ item.test_date ? formatDatetime(item.test_date, 'DD MMMM YYYY') : '-' }}</td>
                <td>{{ item.final_result }}</td>
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
                          class="ma-1 btn-choose-action"
                          color="#828282"
                          tile
                          outlined
                          v-on="on"
                        >
                          {{ $t('label.choose_action') }}
                          <v-icon medium color="#009D57" right>mdi-menu-down</v-icon>
                        </v-btn>
                      </template>
                      <v-card>
                        <v-list-item
                          v-if="roles[0] === 'dinkeskota' || 'dinkesprov'"
                          @click="handleDetail(item._id)"
                        >{{ $t('label.view_detail') }}</v-list-item>
                        <v-list-item
                          v-if="roles[0] === 'dinkeskota' && item.final_result && item.final_result.length > 0 "
                          @click="handleUpdateResults(item._id)"
                        >{{ $t('label.edit_latest_test_result') }}</v-list-item>
                        <v-list-item
                          v-if="roles[0] === 'dinkeskota'"
                          @click="handleDeleteRDT(item._id)"
                        >{{ $t('label.delete_data') }}</v-list-item>
                      </v-card>
                    </v-menu>
                  </v-card-actions>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card>
    <pagination
      :total="totalList "
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      :on-next="onNext"
    />
    <dialog-delete
      :dialog="dialog"
      :data-deleted="dataDelete"
      :dialog-delete.sync="dialog"
      :delete-date.sync="dataDelete"
      :store-path-delete="`rdt/deleteRDT`"
      :store-path-get-list="`rdt/getListRDT`"
      :list-query="listQuery"
    />
    <dialog-detail-history-test
      :show-dialog-detail-test="showDialogDetailTest"
      :show.sync="showDialogDetailTest"
      :detail-test="detailTest"
      :list-history-test="listHistoryTest"
      :title-detail="$t('label.rdt_detail')"
    />
    <dialog-update-history-test
      :show-dialog-update-test="showDialogUpdateTest"
      :show.sync="showDialogUpdateTest"
      :detail-test="detailTest"
      :form-history-test="formHistoryTest"
      :title-detail="$t('label.rdt_update_history_test')"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { formatDatetime } from '@/utils/parseDatetime'
import EventBus from '@/utils/eventBus'

export default {
  name: 'RDTList',
  data() {
    return {
      headers: [
        { text: '#', value: '_id', sortable: false },
        { text: this.$t('label.case_id').toUpperCase(), value: 'id_case' },
        { text: this.$t('label.test_id').toUpperCase(), value: 'code_test' },
        { text: this.$t('label.name').toUpperCase(), value: 'name' },
        { text: this.$t('label.age').toUpperCase(), value: 'age' },
        {
          text: this.$t('label.short_gender_abbreviation').toUpperCase(),
          value: 'gender'
        },
        { text: this.$t('label.rdt').toUpperCase(), value: 'rdt' },
        { text: this.$t('label.pcr').toUpperCase(), value: 'pcr' },
        {
          text: this.$t('label.latest_test_date').toUpperCase(),
          value: 'test_date'
        },
        {
          text: this.$t('label.latest_test_result').toUpperCase(),
          value: 'final_result'
        },
        { text: this.$t('label.action'), value: 'actions', sortable: false }
      ],
      loadingTable: false,
      totalODP: 0,
      totalPDP: 0,
      totalPositif: 0,
      optionsDataTable: {},
      listQuery: {
        address_district_code: '',
        start_date: '',
        end_date: '',
        mechanism: '',
        tool_tester: '',
        final_result: '',
        category: '',
        page: 1,
        limit: 30,
        search: '',
        sort: 'desc'
      },
      dialog: false,
      dataDelete: null,
      showDialogDetailTest: false,
      detailTest: {},
      listHistoryTest: [],
      showDialogUpdateTest: false
    }
  },
  computed: {
    ...mapGetters('rdt', ['rdtList', 'totalDataRDT', 'totalList', 'formHistoryTest']),
    // TODO: ubah getters name district_user to camel case, rubah juga di komponen lainnya
    ...mapGetters('user', ['roles', 'fullName', 'district_user'])
  },
  watch: {
    'listQuery.search': {
      handler: function(value) {
        if (value && value.length >= 2) {
          this.loadingTable = true
          this.listQuery.page = 1
          this.handleSearch()
          this.loadingTable = false
        } else if (value && value.length === 0) {
          this.loadingTable = true
          this.listQuery.page = 1
          this.handleSearch()
          this.loadingTable = false
        }
      },
      immediate: true
    },
    optionsDataTable: {
      handler: function(value) {
        if (value.sortBy !== undefined) {
          if (value.sortBy[0] !== undefined && value.sortDesc[0]) {
            this.listQuery.sort = 'desc'
          } else if (value.sortBy[0] !== undefined && !value.sortDesc[0]) {
            this.listQuery.sort = 'asc'
          } else {
            this.listQuery.sort = 'desc'
          }

          if (Object.keys(this.listQuery.sort).length > 0) {
            this.handleSearch()
          }
        }
      },
      immediate: true
    }
  },
  async mounted() {
    EventBus.$on('refreshPageListTest', value => {
      this.handleSearch()
    })
    this.listQuery.address_district_code = this.district_user
  },
  methods: {
    formatDatetime,
    async handleDetail(id) {
      const responseHistory = await this.$store.dispatch(
        'rdt/listHistoryRDT',
        id
      )
      const participant = await this.$store.dispatch(
        'rdt/detailParticipant',
        id
      )
      responseHistory.data.map(item => {
        item.sampling_type = item.tool_tester !== 'PCR' ? item.sampling_type : '-'
      })
      this.detailTest = participant.data
      this.listHistoryTest = responseHistory.data
      this.showDialogDetailTest = true
    },
    async handleEditRDT(id) {
      await this.$router.push(`/rdt/update/${id}`)
    },
    async handleDeleteRDT(id) {
      this.dialog = true
      this.dataDelete = await { _id: id }
    },
    async handleUpdateResults(id) {
      const participant = await this.$store.dispatch(
        'rdt/detailParticipant',
        id
      )
      Object.assign(this.formHistoryTest, participant.data)
      this.detailTest = participant.data
      this.showDialogUpdateTest = true
    },
    async handleSearch() {
      this.listQuery.page = 1
      await this.$store.dispatch('rdt/getListRDT', this.listQuery)
    },
    getTableRowNumbering(index) {
      return (this.listQuery.page - 1) * this.listQuery.limit + (index + 1)
    },
    async onNext() {
      await this.$store.dispatch('rdt/getListRDT', this.listQuery)
    }
  }
}
</script>
<style scoped>
th.active .arrow {
  opacity: 1;
}

.arrow {
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 0;
  margin-left: 5px;
  opacity: 0.66;
}

.arrow.asc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid #42b983;
}

.arrow.dsc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #42b983;
}

.btn-choose-action {
  text-transform: none !important;
  height: 30px !important;
  min-width: 80px !important;
}
</style>
