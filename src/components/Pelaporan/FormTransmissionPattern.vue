<template>
  <v-container fluid>
    <v-form ref="form" lazy-validation>
      <v-row align="center">
        <v-col cols="12" md="3" sm="12" :class="{'py-0 pb-3': $vuetify.breakpoint. smAndDown}">
          <label>{{ $t('label.type_transmission') }}</label>
        </v-col>
        <v-col cols="12" md="9" sm="12" :class="{'py-0 pb-3': $vuetify.breakpoint. smAndDown}">
          <ValidationProvider v-slot="{ errors }">
            <v-select
              v-model="formPasien.transmission_type"
              :items="transmissionTypes"
              :error-messages="errors"
              solo
              item-text="text"
              item-value="value"
            />
          </ValidationProvider>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col cols="12" md="3" sm="12" :class="{'py-0 pb-3': $vuetify.breakpoint. smAndDown}">
          <label>{{ $t('label.cluster_type') }}</label>
        </v-col>
        <v-col cols="12" md="9" sm="12" :class="{'py-0 pb-3': $vuetify.breakpoint. smAndDown}">
          <ValidationProvider v-slot="{ errors }">
            <v-radio-group v-model="formPasien.cluster_type" :error-messages="errors" row>
              <v-col v-for="item in clusterType" :key="item.value" cols="12" sm="4" md="4">
                <v-radio :label="item.text" :value="Number(item.value)" />
              </v-col>
            </v-radio-group>
            <span v-if="errors.length" class="v-messages error--text">{{ errors[0] }}</span>
          </ValidationProvider>
        </v-col>
      </v-row>
      <v-row
        v-if="formPasien.cluster_type === 1"
        align="start"
        class="mt-4"
      >
        <v-col cols="12" md="3" sm="12" :class="{'py-0': $vuetify.breakpoint. smAndDown}" />
        <v-col cols="12" md="9" sm="12" :class="{'py-0 pb-3': $vuetify.breakpoint. smAndDown}">
          <ValidationProvider>
            <v-text-field v-model="formPasien.cluster_other" :placeholder="$t('label.please_specify_other_types_if_any')" solo-inverted />
          </ValidationProvider>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
<script>
import { ValidationProvider } from 'vee-validate'
import { clusterType, transmissionTypes } from '@/utils/constantOption'
export default {
  name: 'FormTransmissionPattern',
  components: {
    ValidationProvider
  },
  props: {
    formPasien: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      transmissionTypes: transmissionTypes,
      clusterType: clusterType
    }
  },
  methods: {
    //
  }
}
</script>
