import requestServer from '@/api'

export default {
  async hospitalRefferalNewCase({ commit }, data) {
    try {
      const response = await requestServer(`/api/cases-transfer`, 'POST', data)
      return response
    } catch (error) {
      return error.response
    }
  },
  async caseHospitalRefferal({ commit }, params) {
    const { id, data } = params
    try {
      const response = await requestServer(`/api/cases/${id}/transfers`, 'POST', data)
      return response
    } catch (error) {
      return error.response
    }
  },
  async caseHospitalRefferalRevise({ commit }, params) {
    const {
      idCase,
      idTransfer,
      data
    } = params
    try {
      const response = await requestServer(`api/cases/${idCase}/transfers/${idTransfer}/revise`, 'POST', data)
      return response
    } catch (error) {
      return error.response
    }
  },
  async caseHospitalReferralInOut({ commit }, data) {
    const {
      type,
      params
    } = data
    try {
      const response = await requestServer(`/api/cases-transfer/${type}`, 'GET', params)
      return response
    } catch (error) {
      return error.response
    }
  },
  async caseHospitalReferralSummary({ commit }, data) {
    const {
      type
    } = data
    try {
      const response = await requestServer(`/api/cases-transfer-summary/${type}?`, 'GET')
      return response
    } catch (error) {
      return error.response
    }
  },
  async actionHospitalReferral({ commit }, params) {
    const {
      idCase,
      idTransfer,
      actions,
      body
    } = params
    try {
      const response = await requestServer(`api/cases/${idCase}/transfers/${idTransfer}/${actions}`, 'POST', body)
      return response
    } catch (error) {
      return error.response
    }
  },
  async caseHospitalReferralHistory({ commit }, id) {
    try {
      const response = await requestServer(`/api/cases/${id}/transfers?`, 'GET')
      return response
    } catch (error) {
      return error.response
    }
  }
}
