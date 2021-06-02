import getters from './getters'
const getDefaultState = () => {
  return {
    primaryDrawer: {
      model: null,
      type: 'default (no property)',
      clipped: true,
      floating: false,
      mini: false
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
  getters
}
