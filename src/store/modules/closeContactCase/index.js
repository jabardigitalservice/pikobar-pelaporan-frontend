import actions from './actions'
import getters from './getters'
const getDefaultState = () => {
  return {
    formCloseContact: {
      interviewer_name: '',
      contact_tracing_date: '',
      nik: '',
      name: '',
      is_nik_exists: false,
      is_phone_number_exists: false,
      phone_number: '',
      birth_date: '',
      age: '',
      yearsOld: '',
      month: '',
      gender: '',
      is_patient_address_same: false,
      address_province_code: '32',
      address_province_name: 'Jawa Barat',
      address_district_code: '',
      address_district_name: '',
      address_subdistrict_code: '',
      address_subdistrict_name: '',
      address_village_code: '',
      address_village_name: '',
      rw: '',
      rt: '',
      address_street: '',
      relation: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      emergency_contact_relationship: '',
      travel_is_went_abroad: false,
      travel_visited_country: '',
      travel_country_depart_date: '',
      travel_country_return_date: '',
      travel_is_went_other_city: false,
      travel_visited_city: '',
      travel_city_depart_date: '',
      travel_city_return_date: '',
      travel_occupation: '',
      travel_address_office: '',
      travel_transportations: [],
      contact_type: '',
      contact_place: '',
      contact_date: '',
      contact_durations: '',
      home_contact_date: '',
      home_contact_days: '',
      home_contact_activities: [],
      officer_is_contact: true,
      officer_protection_tools: [],
      activity: [],
      activity_other: '',
      relation_others: '',
      first_contact_date: '',
      last_contact_date: '',
      latest_history: {
        symptoms: [],
        symptoms_date: '',
        symptoms_other: '',
        diseases: [],
        diseases_other: '',
        vaccination_influenza_vaccine: false,
        vaccination_influenza_vaccine_date: '',
        vaccination_pvc_vaccine: false,
        vaccination_pvc_vaccine_date: '',
        test_nasal_swab: false,
        test_nasal_swab_date: '',
        test_nasal_swab_result: '',
        test_throat_swab: false,
        test_throat_swab_date: '',
        test_throat_swab_result: '',
        test_nasopharyngeal_swab: false,
        test_nasopharyngeal_swab_date: '',
        test_nasopharyngeal_swab_result: '',
        test_orofaringeal_swab: false,
        test_orofaringeal_swab_date: '',
        test_orofaringeal_swab_result: '',
        test_serum: false
      }
    }
  }
}

const mutations = {
  resetState(state) {
    Object.assign(state, getDefaultState())
  }
}

export default {
  namespaced: true,
  state: getDefaultState(),
  mutations,
  actions,
  getters
}
