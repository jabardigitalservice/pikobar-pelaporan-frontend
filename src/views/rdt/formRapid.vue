<template>
  <div>
    <h4 class="font-weight-bold" style="color:#43A047">{{ $t('label.patient_search') }}</h4>
    <v-divider />
    <ValidationObserver ref="observer">
      <v-form
        ref="form"
        lazy-validation
      >
        <form-participant
          :form-rapid="formRapid"
          :rapid-form.sync="formRapid"
        />
        <form-result
          :form-result="formResult"
          :result-form.sync="formResult"
        />
        <v-container fluid>
          <v-row class="survey-bottom-form">
            <v-col cols="" md="4" sm="0" />
            <v-spacer />
            <v-col cols="12" md="5" sm="12">
              <v-btn
                color="success"
                :loading="loading"
                bottom
                style="float: right; color: white"
                @click="saveData"
              >
                {{ $t('label.save') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </ValidationObserver>
  </div>
</template>
<script>
import { ValidationObserver } from 'vee-validate'
import { getAge } from '@/utils/constantVariable'
import { validateScrollUp } from '@/utils/utilsFunction'
import { mapGetters } from 'vuex'

export default {
  components: {
    ValidationObserver
  },
  data() {
    return {
      loading: false,
      isODP: true,
      isEdit: false,
      idEdit: null,
      formRapid: {
        id: '',
        id_case: '',
        target: null,
        nik: null,
        name: null,
        birth_date: '',
        age: null,
        gender: null,
        address_district_code: '',
        address_district_name: '',
        address_subdistrict_code: '',
        address_subdistrict_name: '',
        address_village_code: '',
        address_villagenationality_name: '',
        address_street: null,
        phone_number: null,
        category: null,
        mechanism: null,
        nationality: null,
        nationality_name: null,
        note_nik: '',
        note_phone_number: '',
        source_data: 'manual'
      },
      formResult: {
        final_result: null,
        test_location: null,
        test_location_type: '',
        test_other_location: '',
        test_address_district_code: '',
        test_address_district_name: '',
        test_address_subdistrict_code: '',
        test_address_subdistrict_name: '',
        test_address_village_code: '',
        test_address_village_name: '',
        test_address_detail: '',
        tool_tester: null,
        sampling_type: '',
        test_method: null,
        test_date: null,
        test_note: null,
        swab_to: 1,
        rdt_to: 1
      }
    }
  },
  computed: {
    ...mapGetters('user', [
      'district_user'
    ])
  },
  watch: {
    'formRapid.birth_date': function(value) {
      if ((value !== '') && (value !== null) && (value !== 'Invalid date')) {
        this.formRapid.age = this.getAge(value)
      }
    }
  },
  async beforeMount() {
    await this.$store.dispatch('occupation/getListOccuption')
    const responseDetails = await this.$store.dispatch('region/getDetailDistrict', this.district_user)
    if (responseDetails.data[0]) {
      this.formRapid.address_district_name = responseDetails.data[0].kota_nama
    }
    this.formRapid.address_district_code = this.district_user
    this.idEdit = this.$route.params.id
    if (this.$route.params && this.idEdit) {
      this.isEdit = true
      const response = await this.$store.dispatch('rdt/detailParticipant', this.$route.params.id)
      await Object.assign(this.formRapid, response.data)
      await Object.assign(this.formResult, response.data)
    }
  },
  methods: {
    getAge,
    validateScrollUp,
    async saveData() {
      const valid = await this.$refs.observer.validate()
      if (!valid) {
        this.validateScrollUp()
        return
      } else if (this.formResult.test_date === null) {
        await this.$store.dispatch('toast/errorToast', 'Tanggal Harus Diisi')
        return
      }
      try {
        this.loading = true
        Object.assign(this.formRapid, this.formResult)
        delete this.formRapid._id
        if (this.formRapid.tool_tester === 'PCR') {
          this.formRapid.rdt_to = null
        } else {
          this.formRapid.swab_to = null
        }

        if (this.isEdit) {
          const id = this.$route.params && this.$route.params.id
          await this.$store.dispatch('rdt/updateRDT', id, this.formRapid)
        } else {
          await this.$store.dispatch('rdt/createRDT', this.formRapid)
        }

        await this.$store.dispatch('toast/successToast', this.$t('success.create_data_success'))
        this.$router.push('/rdt/list')
        await this.$refs.form.reset()
      } catch (error) {
        await this.$store.dispatch('toast/errorToast', 'Data gagal disimpan')
      } finally {
        this.loading = false
      }
    },
    async saveRdtAndCase() {
      const valid = await this.$refs.observer.validate()
      if (!valid) {
        return
      } else if (this.formResult.test_date === null) {
        await this.$store.dispatch('toast/errorToast', 'Tanggal Harus Diisi')
        return
      }

      try {
        this.loading = true
        Object.assign(this.formRapid, this.formResult)

        if (this.formRapid.final_result === 'POSITIF') {
          this.formRapid.status = 'PDP'
          this.formRapid.stage = '0'
          this.formRapid.is_test_masif = true
        }

        if (this.formRapid.id_case) {
          const updateCase = {
            case: this.formRapid.id,
            status: this.formRapid.status,
            stage: this.formRapid.stage,
            final_result: this.formRapid.final_result,
            is_test_masif: this.formRapid.is_test_masif
          }
          await this.$store.dispatch('reports/createHistoryCase', updateCase)
        } else {
          delete this.formRapid.id_case
          await this.$store.dispatch('reports/createReportCase', this.formRapid)
        }
        this.saveData()
      } catch (error) {
        await this.$store.dispatch('toast/errorToast', 'Data gagal disimpan')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
