<template>
  <v-row justify="center">
    <v-dialog
      v-model="show"
      :fullscreen="$vuetify.breakpoint.xs"
      max-width="90%"
    >
      <v-skeleton-loader
        :loading="isLoading"
        type="table-tbody"
      >
        <v-card>
          <v-card-title>
            {{ titleDetail }}
            <v-spacer />
            <v-icon @click="show = false">mdi-close</v-icon>
          </v-card-title>
          <v-divider />
          <v-row class="ml-4 mr-4 mb-6">
            <v-col>
              <v-data-table
                :headers="headers"
                :items="closeContactList"
                :mobile-breakpoint="0"
                :no-data-text="$t('label.data_empty')"
                :items-per-page="10"
                hide-default-footer
              >
                <template v-slot:item="{ item, index }">
                  <tr>
                    <td>{{ getTableRowNumbering(index) }}</td>
                    <td>{{ item.name }}</td>
                    <td>
                      <div v-if="item.gender =='P'">
                        {{ $t('label.female') }}
                      </div>
                      <div v-else>
                        {{ $t('label.male') }}
                      </div>
                    </td>
                    <td>{{ item.age ? `${Math.floor(item.age)} Th`:'-' }} </td>
                    <td>{{ completeAddress(
                      item.address_district_name,
                      item.address_subdistrict_name,
                      item.address_village_name,
                      item.address_street
                    ) }}</td>
                    <td>
                      <v-btn
                        class="ma-1"
                        color="#828282"
                        style="text-transform: none;height: 30px;min-width: 80px;color: #EB5757 !important;"
                        tile
                        outlined
                        @click="handleDeleteCloseContact(item)"
                      >
                        {{ $t('label.deleted_contact') }}
                      </v-btn>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
          <v-card
            min-height="100"
            class="ml-6 mr-6 mt-2 border-card"
            @click="handleCreate"
          >
            <v-container
              fill-height
              fluid
            >
              <v-row
                align="center"
                justify="center"
              >
                <div align="center" class="mt-2">
                  <div>
                    <v-icon>mdi-plus-circle-outline</v-icon>
                  </div>
                  <div>{{ $t('label.add_contact_data') }}</div>
                </div>
              </v-row>
            </v-container>
          </v-card>
          <v-row class="ma-3">
            <v-col>
              <v-btn
                color="#FFFFFF"
                block
                @click="show = false"
              >
                {{ $t('label.back') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-skeleton-loader>
      <dialog-close-contact-case
        :show-dialog-add-close-contact="showCloseContact"
        :show-form-add-close-contact.sync="showCloseContact"
        :title-detail="isEditCloseContact ? $t('label.edit_contact_data'):$t('label.add_contact_data')"
        :form-close-contact="formCloseContact"
        :parent-case="parentCase"
        :is-edit.sync="isEditCloseContact"
        :id-case="idCase"
      />
      <dialog-report-close-contact
        :show-dialog="showReportCloseContact"
        :show-form.sync="showReportCloseContact"
        :title-detail="$t('label.create_closely_contact_reports')"
        :is-edit.sync="isEdit"
        :id-case.sync="idCase"
        :form-body.sync="formBody"
      />
    </v-dialog>
  </v-row>
</template>
<script>
import { formatDatetime } from '@/utils/parseDatetime'
import { getAgeWithMonth } from '@/utils/constantVariable'
import { completeAddress } from '@/utils/utilsFunction'
import EventBus from '@/utils/eventBus'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'DialogCloseContact',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    idCase: {
      type: String,
      default: ''
    },
    idUniqueCase: {
      type: String,
      default: ''
    },
    titleDetail: {
      type: String,
      default: ''
    },
    listCloseContact: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      show: this.showDialog,
      showReportCloseContact: false,
      isEdit: false,
      closeContactList: [],
      isEditCloseContact: false,
      isLoading: false,
      formBody: {},
      parentCase: {},
      headers: [
        { text: '#', value: '_id', sortable: false },
        { text: this.$t('label.name').toUpperCase(), value: 'name' },
        { text: this.$t('label.gender').toUpperCase(), value: 'gender' },
        { text: this.$t('label.age').toUpperCase(), value: 'age' },
        { text: this.$t('label.address').toUpperCase(), value: 'address_street' },
        { text: this.$t('label.action').toUpperCase(), value: 'actions' }
      ],
      dialogDecline: false,
      formatDate: 'YYYY/MM/DD',
      refreshPageList: false,
      showDialogUpdateCloseContact: false,
      showCloseContact: false,
      idCloseContact: null,
      dialogDelete: false,
      dataDelete: null
    }
  },
  computed: {
    ...mapGetters('user', [
      'roles',
      'fullName',
      'district_user',
      'district_name_user'
    ]),
    ...mapState('closeContactCase', [
      'formCloseContact'
    ])
  },
  watch: {
    showDialog(value) {
      this.show = value
    },
    show(value) {
      this.$emit('update:show', value)
      if (!value) {
        this.$emit('update:caseId', '')
        this.$emit('update:uniqueCaseId', '')
      }
    },
    showCloseContact(value) {
      if (!value) {
        this.getListCloseContactByCase(this.idCase)
      }
    },
    dialogDelete(value) {
      if (!value) {
        this.dataDelete = null
        EventBus.$emit('refreshPageListReport', true)
      }
    },
    listCloseContact(value) {
      this.closeContactList = value
    }
  },
  methods: {
    completeAddress,
    async handleCreate() {
      await this.$store.dispatch('closeContactCase/resetStateCloseContactCase')
      const response = await this.$store.dispatch('reports/detailReportCase', this.idCase)
      this.parentCase = response.data
      this.isEditCloseContact = false
      this.showCloseContact = true
    },
    async handleUpdateReport(id) {
      this.formBody = this.formCloseContact
      const latestHistory = this.formCloseContact.latest_history
      const data = {
        idCloseContact: id
      }
      this.isLoading = true
      const response = await this.$store.dispatch('closeContactCase/getDetailCloseContactByCase', data)
      if (response.data !== null) {
        this.formBody = response.data
        if (response.data.latest_history === null) {
          this.formBody.latest_history = latestHistory
        }
        if (response.data.address_district_code === null) {
          this.formBody.address_district_code = this.district_user
          this.formBody.address_district_name = this.district_name_user
        }
        if (response.data.interviewer_name === null) this.formBody.interviewer_name = this.fullName
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
        this.showReportCloseContact = true
        this.isLoading = false
      }
    },
    getTableRowNumbering(index) {
      return (index + 1)
    },
    async handleUpdateCloseContact(id) {
      const response = await this.$store.dispatch('reports/detailReportCase', id)
      Object.assign(this.formCloseContact, response.data)
      this.isEditCloseContact = true
      this.showCloseContact = true
    },
    async handleDeleteCloseContact(item) {
      this.isLoading = true
      const data = {
        idCase: this.idCase,
        idCloseContact: item._id
      }
      const response = await this.$store.dispatch('closeContactCase/deleteCloseContact', data)
      if (response.status === 200) {
        this.$store.dispatch('toast/successToast', this.$t('success.data_success_delete'))
        this.isLoading = false
      } else {
        this.$store.dispatch('toast/errorToast', response.message)
        this.isLoading = false
      }
      this.getListCloseContactByCase(this.idCase)
    },
    async getListCloseContactByCase(id) {
      const response = await this.$store.dispatch('closeContactCase/getListCloseContactByCase', id)
      this.closeContactList = response.data
    }
  }
}
</script>
<style scoped>
   .border-card {
      color: #828282;
      border: 1px dashed #E0E0E0 !important;
      box-sizing: border-box !important;
      border-radius: 8px !important;
   }
</style>
