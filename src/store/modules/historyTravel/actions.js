import requestServer from '@/api'

export default {
  async getListHistoryTravel({
    commit
  }, idCase) {
    try {
      const response = await requestServer(`/api/history-travel/${idCase}?`, 'GET')
      return response
    } catch (error) {
      return error.response
    }
  },
  async getDetailHistoryTravel({
    commit
  }, data) {
    const {
      idHistoryTravel
    } = data
    try {
      const response = await requestServer(`/api/history-travel/${idHistoryTravel}?`, 'GET')
      return response
    } catch (error) {
      return error.response
    }
  },
  async postListHistoryTravel({
    commit
  }, data) {
    const {
      idCase,
      body
    } = data
    try {
      const response = await requestServer(`/api/history-travel/${idCase}`, 'POST', body)
      return response
    } catch (error) {
      return error.response
    }
  },
  async updateDetailHistoryTravel({
    commit
  }, data) {
    const {
      idHistoryTravel,
      body
    } = data
    try {
      const response = await requestServer(`/api/history-travel/${idHistoryTravel}`, 'PUT', body)
      return response
    } catch (error) {
      return error.response
    }
  },
  async deleteHistoryTravel({
    commit
  }, idHistoryTravel) {
    try {
      const response = await requestServer(`/api/history-travel/${idHistoryTravel}`, 'DELETE')
      return response
    } catch (error) {
      return error.response
    }
  },
  resetStateHistoryTravel({
    commit
  }) {
    commit('resetState')
  }
}
