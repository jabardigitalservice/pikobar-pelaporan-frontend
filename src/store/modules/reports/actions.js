import requestServer from '@/api'

export default {
  async listReportCase({ commit }, params) {
    try {
      const response = await requestServer('/api/cases', 'GET', params)
      if (response.data === null) {
        commit('SET_TOTAL_LIST_PASIEN', 1)
        commit('SET_TOTAL_DATA_PASIEN', 0)
        commit('SET_LIST_PASIEN', [])
      } else {
        commit('SET_TOTAL_LIST_PASIEN', response.data._meta.totalPages)
        commit('SET_TOTAL_DATA_PASIEN', response.data._meta.itemCount)
        commit('SET_LIST_PASIEN', response.data.cases)
      }

      return response
    } catch (error) {
      return error.response
    }
  },
  async createReportCase({ commit }, data) {
    try {
      const response = await requestServer('/api/cases', 'POST', data)
      return response
    } catch (error) {
      return error.response
    }
  },
  async createReportCaseV2({ commit }, data) {
    try {
      const response = await requestServer('/api/v2/cases', 'POST', data)
      return response
    } catch (error) {
      return error.response
    }
  },
  async searchCase({ commit }, params) {
    try {
      const response = await requestServer('/api/search', 'GET', params)
      return response
    } catch (error) {
      return error.response
    }
  },
  async statusCase({ commit }, id) {
    try {
      const response = await requestServer(`/api/v2/cases/${id}/status`, 'GET')
      return response
    } catch (error) {
      return error.response
    }
  },
  async updateReportCase({ commit }, data) {
    const id_case = await data.id
    await delete data['id']
    try {
      const response = await requestServer(`/api/cases/${id_case}`, 'PUT', data.data)
      return response
    } catch (error) {
      return error.response
    }
  },
  async updateMultipleStatusCase({ commit }, data) {
    try {
      const response = await requestServer('/api/v2/cases/multiple-update', 'PUT', data)
      return response
    } catch (error) {
      return error.response
    }
  },
  async detailReportCase({ commit }, id) {
    try {
      const response = await requestServer(`/api/cases/${id}`, 'GET')
      return response
    } catch (error) {
      return error.response
    }
  },
  async summaryReportCase({ commit }, id) {
    try {
      const response = await requestServer(`/api/v2/cases/${id}/summary`, 'GET')
      return response
    } catch (error) {
      return error.response
    }
  },
  async deleteReportCase({ commit }, id) {
    try {
      const response = await requestServer(`/api/cases/${id}`, 'DELETE')
      return response
    } catch (error) {
      return error.response
    }
  },
  async detailHistoryCase({ commit }, id) {
    try {
      const response = await requestServer(`/api/cases/${id}/last-history`, 'GET')
      return response.data[0]
    } catch (error) {
      return error.response
    }
  },
  async countReportCase({ commit }, params) {
    try {
      const response = await requestServer('/api/cases-summary', 'GET', params)
      return response
    } catch (error) {
      return error.response
    }
  },
  async countReportCaseFinal({ commit }, params) {
    try {
      const response = await requestServer('/api/cases-summary-final', 'GET', params)
      return response
    } catch (error) {
      return error.response
    }
  },
  async listHistoryCase({ commit }, id) {
    try {
      const response = await requestServer(`/api/cases/${id}/history`, 'GET')
      return response.data
    } catch (error) {
      return error.response
    }
  },
  async createHistoryCase({ commit }, data) {
    try {
      const response = await requestServer('/api/history_cases', 'POST', data)
      return response
    } catch (error) {
      return error.response
    }
  },
  async updateHistoryCase({ commit }, body) {
    const { idHistory, data } = body
    try {
      const response = await requestServer(`/api/history_cases/${idHistory}`, 'PUT', data)
      return response
    } catch (error) {
      return error.response
    }
  },
  async deleteHistoryCase({ commit }, id) {
    try {
      const response = await requestServer(`/api/history_cases/${id}`, 'DELETE')
      return response
    } catch (error) {
      return error.response
    }
  },
  async listNameCase({ commit }, params) {
    try {
      const response = await requestServer(`/api/cases-listid`, 'GET', params)
      return response
    } catch (error) {
      return error.response
    }
  },
  async getNik({ commit }, nik) {
    try {
      const response = await requestServer(`/api/cases-by-nik/${nik}`, 'GET')
      return response
    } catch (error) {
      return error.response
    }
  },
  async verifyCase({ commit }, params) {
    const { id, data } = params
    try {
      const response = await requestServer(`/api/cases/${id}/verifications`, 'POST', data)
      return response
    } catch (error) {
      return error.response
    }
  },
  async countVerificationCase({ commit }) {
    try {
      const response = await requestServer('/api/cases-summary-verification', 'GET')
      commit('SET_TOTAL_PENDING', response.data.PENDING)
      return response
    } catch (e) {
      return e
    }
  },
  async revampGetNik({ commit }, params) {
    try {
      const response = await requestServer('/api/cases-revamp/check', 'GET', params)
      return response
    } catch (error) {
      return error.response
    }
  },
  async casesList({ commit }, params) {
    try {
      const response = await requestServer(`/api/cases-listid`, 'GET', params)
      return response
    } catch (error) {
      return error.response
    }
  },
  async createRevampReportCase({ commit }, data) {
    try {
      const response = await requestServer('/api/cases-revamp', 'POST', data)
      return response
    } catch (error) {
      return error.response
    }
  },
  async correctCaseReport({ commi }, data) {
    const id_case = await data.id
    await delete data['id']
    try {
      const response = await requestServer(`/api/cases/${id_case}/verifications-revise`, 'PUT', data.data)
      return response
    } catch (error) {
      return error.response
    }
  },
  async getDailyReport({ commit }, params) {
    try {
      const response = await requestServer(`/api/reports/daily-report`, 'GET', params)
      return response.data
    } catch (error) {
      return error.response
    }
  },
  resetListCase({ commit }) {
    commit('RESET_LIST_CASE')
  },
  resetFormPasien({ commit }) {
    commit('RESET_FORM_PASIEN')
  },
  resetRiwayatFormPasien({ commit }) {
    commit('RESET_RIWAYAT_FORM_PASIEN')
  },
  resetFormPasienV2({ commit }) {
    commit('RESET_FORM_PASIEN_V2')
  }
}
