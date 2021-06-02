
<template>
  <div>
    <v-skeleton-loader
      :loading="loading"
      type="article"
    >
      <v-card class="d-block pa-1 mx-auto header-survey-list">
        <v-container>
          <v-row justify="space-between">
            <v-col>
              <v-card-text class="font-weight-bold">
                <v-card-title class="text-header-close-contact">
                  {{ $t('label.closer_contact_identification_list') }}
                </v-card-title>
                <v-card-subtitle class="text-sub-header-close-contact">
                  {{ $t('label.tight_contact_total_list') }} {{ totalCloseContact }} {{ $t('label.people') }}
                </v-card-subtitle>
              </v-card-text>
            </v-col>
            <v-col>
              <img class="float-right" src="@/static/survey-list-icon.svg" alt="survey-list-icon">
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-skeleton-loader>
    <v-card
      outlined
      class="mt-2"
    >
      <v-card-title>
        {{ $t('label.closer_contact_identification_list') }}
      </v-card-title>
      <v-divider />
      <v-row>
        <v-col class="ml-4">
          <search
            :list-query="listQuery"
            :handle-search="handleSearch"
          />
        </v-col>
        <v-col class="pb-4" />
      </v-row>
      <hr class="table-divider">
      <v-row>
        <v-col auto>
          <v-data-table
            :headers="headers"
            :items="listCloseContact"
            :mobile-breakpoint="0"
            :no-data-text="$t('label.data_empty')"
            :items-per-page="listQuery.limit"
            :loading="loadingTable"
            hide-default-footer
          >
            <template v-slot:item="{ item, index }">
              <tr>
                <td>{{ getTableRowNumbering(index) }}</td>
                <td>{{ item.name }}</td>
                <td>
                  <div v-if="item.gender =='P'">
                    {{ $t('label.female_initials') }}
                  </div>
                  <div v-else>
                    {{ $t('label.male_initials') }}
                  </div>
                </td>
                <td>{{ item.age }} Th</td>
                <td>{{ item.phone_number }}</td>
                <td>{{ item.createdBy.username }}</td>
                <td>{{ item.createdAt ? formatDatetime(item.createdAt, 'DD MMMM YYYY') : '-' }}</td>
                <td>
                  <label v-if="item.is_reported" style="color: green;">{{ $t('label.interviewed') }}</label>
                  <label v-else style="color: red;">{{ $t('label.not_interviewed') }}</label>
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
                          class="ma-1"
                          color="#828282"
                          style="text-transform: none;height: 30px;min-width: 80px;"
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
                        <!-- <v-list-item @click="handleDetail(item, item._id)">
                          {{ $t('label.view_detail') }}
                        </v-list-item> -->
                        <div>
                          <v-list-item @click="handleUpdate(item._id)">
                            {{ $t('label.edit_tight_contacts') }}
                          </v-list-item>
                          <v-divider class="mt-0 mb-0" />
                          <v-list-item
                            style="color: #EB5757 !important;"
                            @click="handleDelete(item)"
                          >
                            {{ $t('label.delete_contact') }}
                          </v-list-item>
                        </div>
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
      :total="totalPages"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      :on-next="onNext"
    />
    <dialog-close-contact-case
      :show-dialog-add-close-contact="showCloseContact"
      :show-form-add-close-contact.sync="showCloseContact"
      :title-detail="$t('label.edit_contact_data')"
      :form-close-contact="formBody"
      :parent-case="parentCase"
      :is-edit.sync="isEdit"
      :id-case="idCase"
    />
    <dialog-delete
      :dialog="dialog"
      :data-deleted="dataDelete"
      :dialog-delete.sync="dialog"
      :delete-date.sync="dataDelete"
      :store-path-delete="`closeContactCase/deleteCloseContact`"
      :list-query="listQuery"
    />
  </div>
</template>

<script>
import { formatDatetime } from '@/utils/parseDatetime'
import { completeAddress } from '@/utils/utilsFunction'
import { getAgeWithMonth } from '@/utils/constantVariable'
import EventBus from '@/utils/eventBus'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'ListCloseContact',
  data() {
    return {
      headers: [
        { text: '#', value: '_id', sortable: false },
        { text: this.$t('label.name').toUpperCase(), value: 'name' },
        { text: this.$t('label.gender_abbreviation').toUpperCase(), value: 'gender' },
        { text: this.$t('label.age').toUpperCase(), value: 'age' },
        { text: this.$t('label.short_phone_number').toUpperCase(), value: 'phone_number' },
        { text: this.$t('label.author').toUpperCase(), value: 'author' },
        { text: this.$t('label.input_date').toUpperCase(), value: 'createdAt' },
        { text: this.$t('label.status').toUpperCase(), value: 'is_reported' },
        { text: this.$t('label.action').toUpperCase(), value: 'actions', sortable: false }
      ],
      loading: true,
      dialog: false,
      dataDelete: null,
      listCloseContact: [],
      formatDate: 'YYYY/MM/DD',
      totalPages: 0,
      showCloseContact: false,
      loadingTable: false,
      totalCloseContact: 0,
      isEdit: false,
      idCase: '',
      formBody: {},
      parentCase: {},
      listQuery: {
        is_reported: true,
        page: 0,
        limit: 100,
        search: ''
      }
    }
  },
  computed: {
    ...mapGetters('user', [
      'fullName'
    ]),
    ...mapState('closeContactCase', [
      'formCloseContact'
    ])
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
    async dialog(value) {
      if (!value) {
        await this.handleSearch()
      }
    },
    async showCloseContact(value) {
      if (!value) {
        await this.handleSearch()
      }
    }
  },
  async mounted() {
    EventBus.$on('refreshPageListCloseContact', (value) => {
      this.handleSearch()
    })
    await this.handleSearch()
  },
  methods: {
    formatDatetime,
    completeAddress,
    async handleSearch() {
      this.listQuery.page = 1
      const response = await this.$store.dispatch('closeContactCase/getListCloseContact', this.listQuery)
      this.listCloseContact = response.data?.itemsList || []
      this.totalPages = response.data?._meta?.totalPages || 0
      this.totalCloseContact = response.data?._meta?.itemCount || 0
      this.loading = false
    },
    async onNext() {
      await this.handleSearch()
    },
    async handleUpdate(id) {
      this.formBody = this.formCloseContact
      const data = {
        idCloseContact: id
      }
      const response = await this.$store.dispatch('closeContactCase/getDetailCloseContactByCase', data)
      const responseReportCase = await this.$store.dispatch('reports/detailReportCase', response.data.case._id)
      this.parentCase = responseReportCase.data
      if (response.data !== null) {
        this.formBody = response.data
        if (this.formBody.birth_date !== null) {
          this.formBody.birth_date = await formatDatetime(this.formBody.birth_date, this.formatDate)
          const age = getAgeWithMonth(this.formBody.birth_date)
          this.formBody.yearsOld = age.year
          this.formBody.month = age.month
        } else {
          this.formBody.birth_date = ''
        }
        if (this.formBody.age !== null) {
          this.formBody.yearsOld = Math.floor(this.formBody.age)
          this.formBody.month = Math.ceil((this.formBody.age - Math.floor(this.formBody.age)) * 12)
        }
        this.isEdit = true
        this.showCloseContact = true
      }
    },
    async handleDelete(item) {
      this.dialog = true
      this.dataDelete = item
    },
    getTableRowNumbering(index) {
      return ((this.listQuery.page - 1) * this.listQuery.limit) + (index + 1)
    }
  }
}
</script>
<style scoped>
  .text-header-close-contact {
    color: #FFFF !important;
    font-size: 1.4rem;
  }
  .text-sub-header-close-contact {
    color: #FFFF !important;
    font-size: 1.3rem;
  }
</style>
