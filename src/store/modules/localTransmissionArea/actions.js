import requestServer from '@/api'

export default {
  async getListLocalTransmissionArea({
    commit
  }, idCase) {
    try {
      const response = await requestServer(`/api/local-transmission/${idCase}?`, 'GET')
      return response
    } catch (error) {
      return error.response
    }
  },
  async getDetailLocalTransmissionArea({
    commit
  }, data) {
    const {
      idTransmissionArea
    } = data
    try {
      const response = await requestServer(`/api/local-transmission/${idTransmissionArea}?`, 'GET')
      return response
    } catch (error) {
      return error.response
    }
  },
  async postListLocalTransmissionArea({
    commit
  }, data) {
    const {
      idCase,
      body
    } = data
    try {
      const response = await requestServer(`/api/local-transmission/${idCase}`, 'POST', body)
      return response
    } catch (error) {
      return error.response
    }
  },
  async updateDetailLocalTransmissionArea({
    commit
  }, data) {
    const {
      idTransmissionArea,
      body
    } = data
    try {
      const response = await requestServer(`/api/local-transmission/${idTransmissionArea}`, 'PUT', body)
      return response
    } catch (error) {
      return error.response
    }
  },
  async deleteLocalTransmissionArea({
    commit
  }, idTransmissionArea) {
    try {
      const response = await requestServer(`/api/local-transmission/${idTransmissionArea}`, 'DELETE')
      return response
    } catch (error) {
      return error.response
    }
  },
  resetStateLocalTransmissionArea({
    commit
  }) {
    commit('resetState')
  }
}
