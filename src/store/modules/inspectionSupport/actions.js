import requestServer from '@/api'

export default {
  async getListInspectionSupport({
    commit
  }, idCase) {
    try {
      const response = await requestServer(`/api/inspection-support/${idCase}?`, 'GET')
      return response
    } catch (error) {
      return error.response
    }
  },
  async getDetailInspectionSupport({
    commit
  }, data) {
    const {
      idInspectionSupport
    } = data
    try {
      const response = await requestServer(`/api/inspection-support/${idInspectionSupport}?`, 'GET')
      return response
    } catch (error) {
      return error.response
    }
  },
  async postListInspectionSupport({
    commit
  }, data) {
    const {
      idCase,
      body
    } = data
    try {
      const response = await requestServer(`/api/inspection-support/${idCase}`, 'POST', body)
      return response
    } catch (error) {
      return error.response
    }
  },
  async updateDetailInspectionSupport({
    commit
  }, data) {
    const {
      idInspectionSupport,
      body
    } = data
    try {
      const response = await requestServer(`/api/inspection-support/${idInspectionSupport}`, 'PUT', body)
      return response
    } catch (error) {
      return error.response
    }
  },
  async deleteInspectionSupport({
    commit
  }, idInspectionSupport) {
    try {
      const response = await requestServer(`/api/inspection-support/${idInspectionSupport}`, 'DELETE')
      return response
    } catch (error) {
      return error.response
    }
  },
  resetStateInspectionSupport({
    commit
  }) {
    commit('resetState')
  }
}
