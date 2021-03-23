import requestServer from '@/api'

export default {
  async updateCloseContact({ commit }, data) {
    const id_close_contact = await data.id
    await delete data['id']
    try {
      const response = await requestServer(`/api/cases-revamp/${id_close_contact}/contact`, 'PUT', data.data)
      return response
    } catch (error) {
      return error.response
    }
  },
  async addCloseContact({ commit }, data) {
    const id_case = await data.id
    await delete data['id']
    try {
      const response = await requestServer(`/api/cases/${id_case}/closecontact`, 'POST', data.data)
      return response
    } catch (error) {
      return error.response
    }
  },
  async getListCloseContactByCase({ commit }, idCase) {
    try {
      const response = await requestServer(`/api/cases/${idCase}/closecontact?`, 'GET')
      return response
    } catch (error) {
      return error.response
    }
  },
  async getListCloseContact({ commit }, params) {
    try {
      const response = await requestServer('/api/close-contacts', 'GET', params)
      return response
    } catch (error) {
      return error.response
    }
  },
  async getDetailCloseContactByCase({ commit }, data) {
    const {
      idCloseContact
    } = data
    try {
      const response = await requestServer(`/api/close-contacts/${idCloseContact}?`, 'GET')
      return response
    } catch (error) {
      return error.response
    }
  },
  async postListCloseContactByCase({ commit }, data) {
    const {
      idCase,
      body
    } = data
    try {
      const response = await requestServer(`/api/cases/${idCase}/close-contacts`, 'POST', body)
      return response
    } catch (error) {
      return error.response
    }
  },
  async updateDetailCloseContactByCase({ commit }, data) {
    const {
      idCloseContact,
      body
    } = data
    try {
      const response = await requestServer(`/api/close-contacts/${idCloseContact}`, 'PUT', body)
      return response
    } catch (error) {
      return error.response
    }
  },
  async deleteCloseContact({ commit }, data) {
    const {
      idCase,
      idCloseContact
    } = data
    try {
      const response = await requestServer(`/api/cases/${idCase}/closecontact/${idCloseContact}`, 'DELETE')
      return response
    } catch (error) {
      return error.response
    }
  },
  resetStateCloseContactCase({ commit }) {
    commit('resetState')
  }
}
