<template>
  <div>
    <v-row>
      <v-col>
        <v-btn
          :color="singleEntry ? 'success':''"
          style="text-transform: none;height: 46px;min-width: 100px;margin-right: 4px;"
          @click="singleEntry = true"
        >
          {{ $t('label.single_entry') }}
        </v-btn>
        <!-- Sementara tombol multiple entry di hide -->
        <!-- <v-btn
          :color="singleEntry ? '':'success'"
          style="text-transform: none;height: 46px;min-width: 100px;"
          @click="singleEntry = false"
        >
          {{ $t('label.multiple_entry') }}
        </v-btn> -->
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card
          outlined
        >
          <v-container>
            <div
              v-if="singleEntry"
            >
              <form-rapid />
            </div>
            <div
              v-else
            >
              <multiple-form-rdt
                :form-result="formResult"
                :result-form.sync="formResult"
              />
            </div>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import FormRapid from './formRapid'
export default {
  name: 'NewInput',
  components: {
    FormRapid
  },
  data() {
    return {
      title: 'Input RDT',
      singleEntry: true,
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
        tool_tester: 'RAPID TEST',
        test_method: null,
        test_date: null,
        test_note: null
      }
    }
  }
}
</script>
