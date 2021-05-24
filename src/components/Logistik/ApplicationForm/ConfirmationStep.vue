<template>
  <div class="background-landing-page">
    <div class="negative-landing-page main-page-data-confirmation">
      <div v-if="isLoading" class="padding-100-data-confirmation">
        <v-row align="center" justify="center">
          <img height="200" src="../../../static/mengirim.svg" alt="mengirim">
        </v-row>
        <v-row align="center" justify="center" class="margin-wait-data-confirmation">
          {{ $t('label.wait') }}
        </v-row>
        <v-row align="center" justify="center" class="margin-top-10-data-confirmation">
          {{ $t('label.loading_step_one') }}
        </v-row>
        <v-row align="center" justify="center">
          {{ $t('label.loading_step_two') }}
        </v-row>
      </div>
      <div v-else-if="isDone" class="padding-100-data-confirmation">
        <v-row align="center" justify="center">
          <img height="200" src="../../../static/berhasil.svg" alt="berhasil">
        </v-row>
        <v-row align="center" justify="center">
          <div class="save-style-data-confirmation">{{ $t('label.save_success') }}</div>
        </v-row>
        <v-row align="center" justify="center" class="margin-top-10-data-confirmation">
          {{ $t('label.loading_done_one') }}
        </v-row>
        <v-row align="center" justify="center">
          {{ $t('label.loading_done_two') }}
        </v-row>
        <v-row align="center" justify="center">
          {{ $t('label.loading_done_three') }}
        </v-row>
        <br>
        <v-row align="center" justify="center">
          <v-btn href="/#/landing-page">{{ $t('label.back') }}</v-btn>
        </v-row>
      </div>
      <div v-else>
        <div class="data-confirmation-text">{{ $t('label.confirm_data') }}</div>
        <hr>
        <div class="main-color-data-confirmation">{{ $t('label.instance_identity') }}</div>
        <v-container>
          <v-row>
            <v-col>
              <v-row>
                <v-col>
                  <v-row class="main-color-data-confirmation">{{ $t('label.instance_type') }}</v-row>
                  <v-row>{{ formApplicant.instanceTypeName }}</v-row>
                  <v-row class="main-color-data-confirmation">{{ $t('label.instance_name') }}</v-row>
                  <v-row>{{ formApplicant.instanceName }}</v-row>
                  <v-row class="main-color-data-confirmation">{{ $t('label.phone_number') }}</v-row>
                  <v-row>{{ formApplicant.instancePhoneNumber }}</v-row>
                </v-col>
                <v-col>
                  <v-row class="main-color-data-confirmation">{{ $t('label.district_city') }}</v-row>
                  <v-row>{{ formApplicant.cityNameId ? formApplicant.cityNameId.name:'' }}</v-row>
                  <v-row class="main-color-data-confirmation">{{ $t('label.subdistrict') }}</v-row>
                  <v-row>{{ formApplicant.districtNameId ? formApplicant.districtNameId.name:'' }}</v-row>
                  <v-row class="main-color-data-confirmation">{{ $t('label.village') }}</v-row>
                  <v-row>{{ formApplicant.villageNameId ? formApplicant.villageNameId.name:'' }}</v-row>
                </v-col>
              </v-row>
            </v-col>
            <v-col>
              <v-row class="main-color-data-confirmation">{{ $t('label.complete_address') }}</v-row>
              <v-row>{{ formApplicant.fullAddress }}</v-row>
            </v-col>
          </v-row>
        </v-container>
        <hr>
        <div class="main-color-data-confirmation">{{ $t('label.step_title_2') }}</div>
        <v-container>
          <v-row>
            <v-col>
              <v-row>
                <v-col>
                  <v-row class="main-color-data-confirmation">{{ $t('label.contact_person') }}</v-row>
                  <v-row>{{ formIdentityApplicant.applicantName }}</v-row>
                  <v-row class="main-color-data-confirmation">{{ $t('label.applicant_position_identity') }}</v-row>
                  <v-row>{{ formIdentityApplicant.applicantPosition }}</v-row>
                </v-col>
                <v-col>
                  <v-row class="main-color-data-confirmation">{{ $t('label.email') }}</v-row>
                  <v-row>{{ formIdentityApplicant.applicantEmail }}</v-row>
                  <v-row class="main-color-data-confirmation">{{ $t('label.applicant_phone') }}</v-row>
                  <v-row>{{ formIdentityApplicant.applicantPhoneNumber }}</v-row>
                  <v-row class="main-color-data-confirmation">{{ $t('label.applicant_phone_sub') }}</v-row>
                  <v-row>{{ formIdentityApplicant.applicantPhoneNumber2 }}</v-row>
                </v-col>
              </v-row>
            </v-col>
            <v-col>
              <v-row class="main-color-data-confirmation">{{ $t('label.applicant_ktp') }}</v-row>
              <v-row>
                <img class="image-style-data-confirmation" :src="url" alt="data-confirmation">
              </v-row>
            </v-col>
          </v-row>
        </v-container>
        <hr>
        <div class="main-color-data-confirmation">{{ $t('label.list_logistic_need') }}</div>
        <v-card outlined>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th scope="col" class="text-left">{{ $t('label.number').toUpperCase() }}</th>
                  <th scope="col" class="text-left">{{ $t('label.apd_name_specification') }}</th>
                  <th scope="col" class="text-left">{{ $t('label.brand') }}</th>
                  <th scope="col" class="text-left">{{ $t('label.total') }}</th>
                  <th scope="col" class="text-left">{{ $t('label.unit') }}</th>
                  <th scope="col" class="text-left">{{ $t('label.purpose') }}</th>
                  <th scope="col" class="text-left">{{ $t('label.urgency_level') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="logisticNeeds.length === 0">
                  <td class="text-center-data-confirmation" :colspan="7">{{ $t('label.no_data') }}</td>
                </tr>
                <tr v-for="(item, index) in dataShow" v-else :key="item.index">
                  <td>{{ getTableRowNumbering(index) }}</td>
                  <td>{{ item.apdName }}</td>
                  <td>{{ item.brand }}</td>
                  <td>{{ item.total }}</td>
                  <td>{{ item.unitName }}</td>
                  <td>{{ item.purpose }}</td>
                  <td>{{ item.urgency }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
        <v-pagination
          v-model="listQuery.page"
          :length="total"
          :total-visible="3"
          @input="onNext"
        />
        <hr>
        <div class="main-color-data-confirmation">{{ $t('label.step_title_4') }}</div>
        <a :href="urlLetter" target="_blank">{{ letterName }}</a>
        <hr>
        <v-row justify="end">
          <v-col cols="12" sm="3" md="3">
            <v-btn
              block
              outlined
              text
              @click="onPrev"
            >
              {{ $t('label.back') }}
            </v-btn>
          </v-col>
          <v-col cols="12" sm="3" md="3">
            <v-btn
              block
              color="primary"
              @click="submitData"
            >
              {{ $t('label.save') }}
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>
<script>
import EventBus from '@/utils/eventBus'

export default {
  name: 'TahapKonfirmasi',
  props: {
    formApplicant: {
      type: Object,
      default: null
    },
    formIdentityApplicant: {
      type: Object,
      default: null
    },
    logisticNeeds: {
      type: Array,
      default: null
    },
    applicantLetter: {
      type: File,
      default: null
    }
  },
  data() {
    return {
      step: 5,
      dataShow: [],
      listQuery: {
        page: 1,
        limit: 3
      },
      total: 0,
      url: null,
      urlLetter: null,
      letterName: '',
      isLoading: false,
      isDone: false
    }
  },
  mounted() {
    // this.letterName = this.applicantLetter.name
    if (this.formIdentityApplicant.dataFile) {
      this.url = URL.createObjectURL(this.formIdentityApplicant.dataFile)
    }
    // this.urlLetter = URL.createObjectURL(this.applicantLetter)
    this.total = Math.ceil(this.logisticNeeds.length / 3)
    if (this.logisticNeeds.length > 0) {
      if (this.total === 1) {
        for (let index = 0; index < this.logisticNeeds.length; index++) {
          this.dataShow.push(this.logisticNeeds[index])
        }
      } else {
        for (let index = 0; index < 3; index++) {
          this.dataShow.push(this.logisticNeeds[index])
        }
      }
    }
  },
  methods: {
    getTableRowNumbering(index) {
      return ((parseInt(this.listQuery.page) - 1) * parseInt(this.listQuery.limit)) + (parseInt(index) + 1)
    },
    onNext() {
      this.dataShow = []
      const x = (this.listQuery.page - 1) * 3
      for (let index = x; index < this.logisticNeeds.length; index++) {
        if (this.dataShow.length > 2) {
          return
        } else {
          this.dataShow.push(this.logisticNeeds[index])
        }
      }
    },
    onPrev() {
      EventBus.$emit('prevStep', this.step)
    },
    async submitData() {
      this.isLoading = true
      const dataLogistics = []
      this.logisticNeeds.forEach(element => {
        dataLogistics.push({
          usage: element.purpose,
          priority: element.urgency,
          product_id: element.apd,
          brand: element.brand,
          quantity: element.total,
          unit: element.unitId
        })
      })

      const formData = new FormData()
      formData.append('master_faskes_id', this.formApplicant.instance)
      formData.append('logistic_request', JSON.stringify(dataLogistics))
      formData.append('agency_type', this.formApplicant.instanceType)
      formData.append('agency_name', this.formApplicant.instanceName)
      if (this.formApplicant.instancePhoneNumber != null) {
        formData.append('phone_number', this.formApplicant.instancePhoneNumber)
      }
      formData.append('location_district_code', this.formApplicant.cityNameId.id)
      formData.append('location_subdistrict_code', this.formApplicant.districtNameId.id)
      formData.append('location_village_code', this.formApplicant.villageNameId.id)
      formData.append('location_address', this.formApplicant.fullAddress)
      formData.append('applicant_name', this.formIdentityApplicant.applicantName)
      formData.append('applicants_office', this.formIdentityApplicant.applicantPosition)
      formData.append('email', this.formIdentityApplicant.applicantEmail)
      formData.append('primary_phone_number', this.formIdentityApplicant.applicantPhoneNumber)
      formData.append('secondary_phone_number', this.formIdentityApplicant.applicantPhoneNumber2)
      formData.append('letter_file', this.applicantLetter)
      formData.append('applicant_file', this.formIdentityApplicant.dataFile)
      await this.$store.dispatch('logistic/createSubmissionLogistic', formData)
      this.isDone = true
      await this.$router.push({ path: '/submission-logistik/list' })
      this.isLoading = false
    },
    onDone() {
      this.isDone = false
    },
    onLoading() {
      this.isDone = true
      this.isLoading = false
    },
    refreshPage() {
      window.location.reload()
    }
  }
}
</script>
<style>
  .data-confirmation-text {
    font-size: 20px;
    font-weight: bold;
  }
  .main-color-data-confirmation {
    color: #27ae60;
    font-weight: bold;
    margin-top: 20px !important;
  }
  .image-style-data-confirmation {
    max-width: 100%;
    max-height: 500px;
  }
  .main-page-data-confirmation {
    display: block;
  }
  .padding-100-data-confirmation {
    padding: 100px 100px;
  }
  .margin-wait-data-confirmation {
    margin-top: 20px;
    font-size: 20px;
    font-weight: bold;
  }
  .margin-top-10-data-confirmation {
    margin-top: 10px;
  }
  .save-style-data-confirmation {
    margin-top: 20px;
    font-size: 20px;
    font-weight: bold;
  }
  .text-center-data-confirmation {
    text-align: center;
  }
</style>
