<template>
  <div>
    <ValidationObserver ref="observer">
      <v-form
        ref="form"
        lazy-validation
      >
        <v-container>
          <h4 style="color: #219653;">{{ $t('label.rdt_multiple_redaction1') }}</h4>
          <h4 color="succses">{{ $t('label.rdt_multiple_redaction2') }}</h4>
          <v-row>
            <v-col cols="12" sm="4">
              <v-label class="title">{{ $t('label.test_implementation_date') }}:</v-label>
              <input-date-picker
                :format-date="formatDate"
                :label="$t('label.test_implementation_date')"
                :date-value="listQuery.test_date"
                :value-date.sync="listQuery.test_date"
                @changeDate="listQuery.test_date = $event"
              />
            </v-col>
            <v-col cols="12" sm="4">
              <v-label class="title">{{ $t('label.placed_date') }}:</v-label>
              <br>
              <div>
                <v-autocomplete
                  v-model="listQuery.test_location"
                  :items="listLocationTest"
                  :label="$t('label.placed_date')"
                  menu-props="auto"
                  item-text="name"
                  item-value="slug"
                  single-line
                  solo
                  autocomplete
                />
              </div>
            </v-col>
            <v-col cols="12" sm="4">
              <br>
              <div>
                <v-btn
                  color="success"
                  style="height: 46px;"
                  @click="handleSearchParticipant"
                >
                  {{ $t('label.look_for_it') }}
                </v-btn>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              sm="4"
            >
              <ValidationProvider
                v-slot="{ errors }"
                rules="required"
              >
                <label class="required">{{ $t('label.method') }}</label>
                <v-radio-group
                  v-model="formResult.tool_tester"
                  :error-messages="errors"
                  row
                >
                  <v-radio
                    :label="$t('label.rapid_test')"
                    value="RAPID TEST"
                  />
                  <v-radio
                    :label="$t('label.pcr')"
                    value="PCR"
                  />
                </v-radio-group>
              </ValidationProvider>
            </v-col>
            <v-col
              cols="12"
              sm="4"
            >
              <ValidationProvider
                v-if="formResult.tool_tester === 'RAPID TEST'"
                v-slot="{ errors }"
                rules="required"
              >
                <label class="required">{{ $t('label.sampling') }}</label>
                <v-radio-group
                  v-model="formResult.test_method"
                  :error-messages="errors"
                  row
                >
                  <v-radio
                    :label="$t('label.vena')"
                    value="Vena"
                  />
                  <v-radio
                    :label="$t('label.kapiler')"
                    value="Kapiler"
                  />
                </v-radio-group>
              </ValidationProvider>
            </v-col>
          </v-row>
          <v-row>
            <v-col auto>
              <v-data-table
                :headers="headers"
                :items="listParticpant"
                :mobile-breakpoint="0"
                :no-data-text="$t('label.data_empty')"
                :items-per-page="1000"
                hide-default-footer
              >
                <template v-slot:item="{ item, index }">
                  <tr>
                    <td>{{ getTableRowNumbering(index) }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.nik }}</td>
                    <td>{{ item.age }}</td>
                    <td>{{ item.birth_date }}</td>
                    <td>{{ item.gender }}</td>
                    <td>{{ item.phone_number }}</td>
                    <td>{{ item.category }}</td>
                    <td>
                      <ValidationProvider
                        v-slot="{ errors }"
                        rules="required"
                      >
                        <v-radio-group
                          v-model="item.final_result"
                          :error-messages="errors"
                          row
                        >
                          <div
                            v-if="formResult.tool_tester === 'PCR'"
                          >
                            <v-radio
                              :label="$t('label.negatif')"
                              value="NEGATIF"
                            />
                            <v-radio
                              :label="$t('label.positif')"
                              value="POSITIF"
                            />
                            <v-radio
                              :label="$t('label.inkonklusif')"
                              value="INKONKLUSIF"
                            />

                          </div>
                          <div
                            v-else
                            style="margin-top: 1rem;"
                          >
                            <v-radio
                              :label="$t('label.reaktif')"
                              value="REAKTIF"
                            />
                            <v-radio
                              :label="$t('label.non_reaktif')"
                              value="NON REAKTIF"
                            />
                            <v-radio
                              :label="$t('label.invalid')"
                              value="INVALID"
                            />
                          </div>
                        </v-radio-group>
                      </ValidationProvider>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-container>
        <v-container fluid>
          <v-row>
            <v-col>
              <br>
              <div>
                <v-btn
                  color="#828282"
                  bottom
                  style="float: right; height: 46px;color: white"
                  @click="handleSave"
                >
                  {{ $t('label.save') }}
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </ValidationObserver>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { ValidationObserver, ValidationProvider } from 'vee-validate'

export default {
  name: 'MultipleFormRdt',
  components: {
    ValidationObserver,
    ValidationProvider
  },
  props: {
    formResult: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      formatDate: 'YYYY/MM/DD',
      districtCity: {
        kota_kode: ''
      },
      listLocationTest: [],
      listParticpant: [],
      headers: [
        { text: 'NO', value: '_id', sortable: false },
        { text: 'NAMA', value: 'name', sortable: false },
        { text: 'NIK', value: 'nik', sortable: false },
        { text: 'USIA', value: 'age', sortable: false },
        { text: 'TANGGAL LAHIR', value: 'birth_date', sortable: false },
        { text: 'JK', value: 'gender', sortable: false },
        { text: 'NO TELEPON', value: 'phone_number', sortable: false },
        { text: 'KATEGORI', value: 'category', sortable: false },
        { text: 'HASIL TES', value: 'final_result', sortable: false }
      ],
      listQuery: {
        test_date: '',
        test_location: ''
      }
    }
  },
  computed: {
    ...mapGetters('user', [
      'roles'
    ]),
    ...mapGetters('region', [
      'hospitalList'
    ])
  },
  async mounted() {
    await this.$store.dispatch('region/getListHospital')
    const response = await this.$store.dispatch('rdt/listLocationTest')
    this.listLocationTest = response.data
  },
  methods: {
    onSelectDistrict(value) {
      this.districtCity = value.kota_kode
    },
    getTableRowNumbering(index) {
      return (index + 1)
    },
    async handleSearchParticipant() {
      const response = await this.$store.dispatch('rdt/listParticipantTest', this.listQuery)
      this.listParticpant = response.data
    },
    async handleSave() {
      const valid = await this.$refs.observer.validate()
      if (!valid) {
        return
      }

      const toolTester = this.formResult.tool_tester
      const testMethod = this.formResult.test_method
      await this.listParticpant.map(function(el) {
        el['tool_tester'] = toolTester
        el['test_method'] = testMethod
      })
      const response = await this.$store.dispatch('rdt/createMultipleRDT', this.listParticpant)
      if (response) {
        await this.$store.dispatch('toast/successToast', this.$t('success.create_data_success'))
        this.$router.push('/rdt/list')
      }
    }
  }
}
</script>
