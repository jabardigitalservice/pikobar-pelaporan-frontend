import requestServer from '@/api'
import request from '@/utils/request'

export default {
  async exportExcelCase({ commit }, params) {
    try {
      const response = await request({
        url: `/api/cases-export`,
        method: 'GET',
        params: params,
        responseType: 'blob'
      })
      return response
    } catch (error) {
      return error.response
    }
  },
  async exportExcelHistory({ commit }, params) {
    try {
      const response = await request({
        url: `/api/history-export`,
        method: 'GET',
        params: params,
        responseType: 'blob'
      })
      return response
    } catch (error) {
      return error.response
    }
  },
  async exportExcelDailyReport({
    commit
  }, params) {
    try {
      const response = await request({
        url: `/api/reports/daily-report-xls`,
        method: 'GET',
        params: params,
        responseType: 'blob'
      })
      return response
    } catch (error) {
      return error.response
    }
  },
  async printPEForm({ commit }, id) {
    try {
      const response = await request({
        url: `/api/v2/cases/${id}/export-to-pe-form?`,
        method: 'GET',
        responseType: 'blob'
      })
      return response
    } catch (error) {
      return error.response
    }
  },
  async importExcel({ commit }, data) {
    const {
      formData,
      onProgress
    } = data
    try {
      const response = await requestServer('/api/v2/cases-import', 'UPLOAD', formData, onProgress)
      return response
    } catch (error) {
      return error.response
    }
  }
}
