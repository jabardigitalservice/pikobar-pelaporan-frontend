import actions from './actions'
import getters from './getters'
const getDefaultState = () => {
  return {
    formHistoryTravel: {
      travelling_type: '',
      travelling_visited: '',
      travelling_city: '',
      travelling_date: '',
      travelling_arrive: ''
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
