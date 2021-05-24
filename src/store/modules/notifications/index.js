import getters from './getters'
import requestServer from '@/api'

const getDefaultState = () => {
  return {
    notificationTotalUnread: 0,
    totalPages: 0,
    notificationList: []
  }
}

const actions = {
  async setNotificationToken({ commit }, { user_id, data }) {
    try {
      const response = await requestServer(`/api/users/${user_id}/devices`, 'POST', data)
      return response
    } catch (error) {
      return error.response
    }
  },
  async getListNotifications({ commit }, params) {
    try {
      const response = await requestServer(`/api/notifications`, 'GET', params)
      const listNotification = response.data ? response.data.itemsList : []
      const totalPages = response.data ? response.data._meta.totalPages : 0
      commit('NOTIFICATION_LIST', listNotification)
      if (!params.onSideBar) commit('TOTAL_PAGES', totalPages)
      return response
    } catch (error) {
      return error.response
    }
  },
  async onReadNotification({ commit }, id) {
    try {
      const response = await requestServer(`/api/notifications/read?id=${id}`, 'PUT')
      commit('NOTIFICATION_READ', 1)
      return response
    } catch (error) {
      return error.response
    }
  },
  async summaryNotification({ commit }) {
    try {
      const response = await requestServer(`/api/notifications/summary?`, 'GET')
      const totalUnread = response.data ? response.data.unread : 0
      commit('NOTIFICATION_TOTAL_UNREAD', totalUnread)
      return response
    } catch (error) {
      return error.response
    }
  },
  notificationCountUnread({ commit }, data) {
    commit('NOTIFICATION_COUNT_UNREAD', data)
  }
}
const mutations = {
  NOTIFICATION_TOTAL_UNREAD: (state, data) => {
    state.notificationTotalUnread = data
  },
  NOTIFICATION_COUNT_UNREAD: (state, data) => {
    state.notificationTotalUnread += data
  },
  NOTIFICATION_READ: (state, data) => {
    if (state.notificationTotalUnread !== 0) state.notificationTotalUnread -= data
  },
  NOTIFICATION_LIST: (state, data) => {
    state.notificationList = data
  },
  TOTAL_PAGES: (state, data) => {
    state.totalPages = data
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
