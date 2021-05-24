<template>
  <v-container>
    <v-row class="mt-n6">
      <v-col cols="12" md="12" sm="12">
        <v-row>
          <v-col cols="12" md="6" sm="12">
            <div class="title">{{ $t('label.case_id') }}</div>
          </v-col>
          <v-col auto />
        </v-row>
        <v-row>
          <v-col cols="12" md="3" sm="12">
            <label>{{ $t('label.results_test_code') }}</label>
          </v-col>
          <v-col auto>
            <v-text-field v-model="detailTest.code_test" disabled hide-details solo-inverted />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="3" sm="12">
            <label>{{ $t('label.case_id') }}</label>
          </v-col>
          <v-col auto>
            <v-text-field v-model="detailTest.id_case" disabled hide-details solo-inverted />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6" sm="12">
            <div class="title">{{ $t('label.category_or_target') }}</div>
          </v-col>
          <v-col auto />
        </v-row>
        <v-row>
          <v-col cols="12" md="3" sm="12">
            <label>{{ $t('label.goals') }}</label>
          </v-col>
          <v-col auto>
            <v-text-field v-model="detailTest.target" disabled hide-details solo-inverted />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12" sm="12">
        <v-row>
          <v-col cols="12" md="6" sm="12">
            <div class="title">{{ $t('label.identity') }}</div>
          </v-col>
          <v-col auto />
        </v-row>
        <v-row>
          <v-col cols="12" md="3" sm="12">
            <label>{{ $t('label.nik') }}</label>
          </v-col>
          <v-col auto>
            <v-text-field v-model="detailTest.nik" disabled hide-details solo-inverted />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="3" sm="12">
            <label>{{ $t('label.participant_name') }}</label>
          </v-col>
          <v-col auto>
            <v-text-field v-model="detailTest.name" disabled hide-details solo-inverted />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="3" sm="12">
            <label>{{ $t('label.birth_date') }}</label>
          </v-col>
          <v-col auto>
            <v-text-field v-model="birthDate" disabled hide-details solo-inverted />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="3" sm="12">
            <label>{{ $t('label.age') }}</label>
          </v-col>
          <v-col auto>
            <v-text-field v-model="detailTest.age" disabled hide-details solo-inverted />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="3" sm="12">
            <label>{{ $t('label.gender') }}</label>
          </v-col>
          <v-col auto>
            <v-text-field v-model="detailGender" disabled hide-details solo-inverted />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="3" sm="12">
            <label>{{ $t('label.phone_number') }}</label>
          </v-col>
          <v-col auto>
            <v-text-field v-model="detailTest.phone_number" disabled hide-details solo-inverted />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="3" sm="12">
            <label>{{ $t('label.address') }}</label>
          </v-col>
          <v-col auto>
            <v-textarea v-model="detailAddres" disabled hide-details solo-inverted />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="3" sm="12">
            <label>{{ $t('label.citizenship') }}</label>
          </v-col>
          <v-col auto>
            <v-text-field v-model="detailTest.nationality" disabled hide-details solo-inverted />
          </v-col>
        </v-row>
        <v-row v-if="detailTest.nationality === 'WNA'">
          <v-col cols="12" md="3" sm="12">
            <label>{{ $t('label.country') }}</label>
          </v-col>
          <v-col auto>
            <v-text-field
              v-model="detailTest.nationality_name"
              disabled
              hide-details
              solo-inverted
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: 'DetailTest',
  props: {
    detailTest: {
      type: Object,
      default: null
    },
    birthDate: {
      type: String,
      default: ''
    },
    testDate: {
      type: String,
      default: ''
    },
    detailGender: {
      type: String,
      default: ''
    },
    detailCase: {
      type: String,
      default: ''
    },
    detailAddres: {
      type: String,
      default: ''
    },
    testAddres: {
      type: String,
      default: ''
    }
  }
}
</script>

