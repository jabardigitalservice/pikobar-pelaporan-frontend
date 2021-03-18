import requestServer from '@/api'

export default {
  async getListPublicPlace({
    commit
  }, idCase) {
    try {
      const response = await requestServer(`/api/public-place/${idCase}?`, 'GET')
      return response
    } catch (error) {
      return error.response
    }
  },
  async getDetailPublicPlace({
    commit
  }, data) {
    const {
      idPublicPlace
    } = data
    try {
      const response = await requestServer(`/api/public-place/${idPublicPlace}?`, 'GET')
      return response
    } catch (error) {
      return error.response
    }
  },
  async postListPublicPlace({
    commit
  }, data) {
    const {
      idCase,
      body
    } = data
    try {
      const response = await requestServer(`/api/public-place/${idCase}`, 'POST', body)
      return response
    } catch (error) {
      return error.response
    }
  },
  async updateDetailPublicPlace({
    commit
  }, data) {
    const {
      idPublicPlace,
      body
    } = data
    try {
      const response = await requestServer(`/api/public-place/${idPublicPlace}`, 'PUT', body)
      return response
    } catch (error) {
      return error.response
    }
  },
  async deletePublicPlace({
    commit
  }, idPublicPlace) {
    try {
      const response = await requestServer(`/api/public-place/${idPublicPlace}`, 'DELETE')
      return response
    } catch (error) {
      return error.response
    }
  },
  resetStatePublicPlace({
    commit
  }) {
    commit('resetState')
  }
}
