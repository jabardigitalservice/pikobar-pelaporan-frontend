import requestServer from '@/api'

export default {
  async createSubmissionLogistic({ commit }, data) {
    try {
      const response = await requestServer(`/api/logistics/requests`, 'POST', data)
      return response
    } catch (error) {
      return error.response
    }
  },
  async getListFaskesType({ commit }, params) {
    try {
      const response = await requestServer('/api/logistics/faskes-types', 'GET', params)
      commit('SET_LIST_TYPE_FASKES', response.data)
      return response
    } catch (error) {
      return error.response
    }
  },
  async getListAPD({ commit }, params) {
    try {
      const response = await requestServer('/api/logistics/products?', 'GET')
      commit('SET_LIST_APD', response.data)
      return response
    } catch (error) {
      return error.response
    }
  },
  async getListApdUnit({ commit }, idAlkes) {
    try {
      const response = await requestServer(`/api/logistics/product-units/${idAlkes}`, 'GET')
      commit('SET_LIST_APD_UNIT', response)
      return response
    } catch (error) {
      return error.response
    }
  }
}
