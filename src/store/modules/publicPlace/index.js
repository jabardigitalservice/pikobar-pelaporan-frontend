import actions from './actions'
import getters from './getters'
const getDefaultState = () => {
  return {
    formPublicPlace: {
      public_place_category: '',
      public_place_name: '',
      public_place_address: '',
      public_place_date_visited: '',
      public_place_duration_visited: ''
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
