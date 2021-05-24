import actions from './actions'
import getters from './getters'
const getDefaultState = () => {
  return {
    formInspectionSupport: {
      inspection_type: '',
      specimens_type: '',
      inspection_date: '',
      inspection_location: '',
      is_other_location: true,
      other_inspection_location: '',
      get_specimens_to: '',
      inspection_result: ''
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
