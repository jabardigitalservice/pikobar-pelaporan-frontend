import actions from './actions'
import getters from './getters'
const getDefaultState = () => {
  return {
    formLocalTransmissionArea: {
      visited_local_area_province: '',
      visited_local_area_city: ''
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
