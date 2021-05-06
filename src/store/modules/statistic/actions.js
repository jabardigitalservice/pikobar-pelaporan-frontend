import requestServer from '@/api'
import request from '@/utils/request'

export default {
  async countAgeGender({ commit }, params) {
    try {
      const response = await requestServer('/api/dashboard/chart-age-gender', 'GET', params)
      return response
    } catch (error) {
      return error.response
    }
  },
  async countOTG({ commit }, params) {
    try {
      const response = await requestServer('/api/dashboard/chart-otg', 'GET', params)
      return response
    } catch (error) {
      return error.response
    }
  },
  async countODP({ commit }, params) {
    try {
      const response = await requestServer('/api/dashboard/chart-odp', 'GET', params)
      return response
    } catch (error) {
      return error.response
    }
  },
  async countPDP({ commit }, params) {
    try {
      const response = await requestServer('/api/dashboard/chart-pdp', 'GET', params)
      return response
    } catch (error) {
      return error.response
    }
  },
  async countPositive({ commit }, params) {
    try {
      const response = await requestServer('/api/dashboard/chart-confirm', 'GET', params)
      return response
    } catch (error) {
      return error.response
    }
  },
  async countTestResult({ commit }, params) {
    try {
      const response = await requestServer('/api/dashboard/summary-input-test', 'GET', params)
      return response
    } catch (error) {
      return error.response
    }
  },
  async countCaseNew({ commit }, params) {
    try {
      const response = await requestServer('/api/dashboard/v2/summary-case-criteria', 'GET', params)
      return response
    } catch (error) {
      return error.response
    }
  },
  async agregateCriteria({ commit }, params) {
    try {
      const response = await requestServer('/api/dashboard/tabel-aggregate-criteria', 'GET', params)
      return response
    } catch (error) {
      return error.response
    }
  },
  async exportAgregateCriteriaExcel({ commit }, params) {
    try {
      const response = await request({
        url: `/api/dashboard/tabel-aggregate-criteria-export`,
        method: 'GET',
        params: params,
        responseType: 'blob'
      })
      return response
    } catch (error) {
      return error.response
    }
  },
  async distributionCase({ commit }, params) {
    try {
      const response = await requestServer('/api/map', 'GET', params)
      return response
    } catch (error) {
      return error.response
    }
  },
  async listCaseRelated({ commit }, params) {
    try {
      const response = await requestServer('/api/case-related', 'GET', params)
      return response
    } catch (error) {
      return error.response
    }
  },
  async detailCaseRelated({ commit }, id) {
    try {
      const response = await requestServer(`/api/case-related/${id}?`, 'GET')
      return response
    } catch (error) {
      return error.response
    }
  },
  async agregateSummaryCase({ commit }, params) {
    try {
      const response = await requestServer('/api/dashboard/v2/summary-case', 'GET', params)
      return response
    } catch (error) {
      return error.response
    }
  },
  async agregateVisualizationCase({ commit }, params) {
    try {
      const response = await requestServer('/api/dashboard/v2/visualization-case', 'GET', params)
      return response
    } catch (error) {
      return error.response
    }
  },
  async exportDemographic({ commit }, params) {
    try {
      const response = await request({
        url: `/api/dashboard/v2/export-demographic`,
        method: 'GET',
        params: params,
        responseType: 'blob'
      })
      return response
    } catch (error) {
      return error.response
    }
  },
  async exportCriteria({ commit }, params) {
    try {
      const response = await request({
        url: `/api/dashboard/v2/export-criteria`,
        method: 'GET',
        params: params,
        responseType: 'blob'
      })
      return response
    } catch (error) {
      return error.response
    }
  },
  async summaryTestResult({ commit }, params) {
    try {
      const response = await requestServer(`/api/dashboard/summary-test-result`, 'GET', params)
      return response
    } catch (error) {
      return error.response
    }
  },
  async summaryTestResultLocation({ commit }, params) {
    try {
      const response = await requestServer(`/api/dashboard/summary-test-result-location`, 'GET', params)
      return response
    } catch (error) {
      return error.response
    }
  },
  async summaryTestResultGender({ commit }, params) {
    try {
      const response = await requestServer(`/api/dashboard/summary-test-result-gender`, 'GET', params)
      return response
    } catch (error) {
      return error.response
    }
  },
  async summaryTestResultAge({ commit }, params) {
    try {
      const response = await requestServer(`/api/dashboard/summary-test-result-age`, 'GET', params)
      return response
    } catch (error) {
      return error.response
    }
  }
}
