import getters from './getters'
const getDefaultState = () => {
  return {
    notifDrawer: null
  }
}

const actions = {
  notificationDrawer({ commit }, drawer) {
    commit('NOTIF_DRAWER', drawer)
  }
}
const mutations = {
  NOTIF_DRAWER: (state, drawer) => {
    state.notifDrawer = drawer
  },
  resetState(state) {
    Object.assign(state, getDefaultState())
  }
}

export default {
  namespaced: true,
  state: getDefaultState(),
  actions,
  mutations,
  getters
}
