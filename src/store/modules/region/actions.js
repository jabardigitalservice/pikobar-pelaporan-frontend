import requestServer from '@/api'
import axios from 'axios'
import requestCache from '@/utils/requestCache'

export default {
  async getListProvince({ commit }) {
    try {
      const response = await requestServer('/api/areas/province', 'GET')
      return response
    } catch (error) {
      return error.response
    }
  },
  async getListDistrictCity({ commit }, params) {
    try {
      const response = await requestServer('/api/areas/district-city', 'GET', params)
      if (!params) {
        commit('SET_DISTRICT_CITY', response.data)
      }
      return response
    } catch (error) {
      return error.response
    }
  },
  async getDetailDistrict({ commit }, codeDistrict) {
    try {
      const response = await requestServer(`/api/areas/district-city?kota_kode=${codeDistrict}`, 'GET')
      return response
    } catch (error) {
      return error.response
    }
  },
  async getDetailSubDistrict({ commit }, codeSubDistrict) {
    try {
      const response = await requestServer(`/api/areas/sub-district-detail/${codeSubDistrict}`, 'GET')
      return response
    } catch (error) {
      return error.response
    }
  },
  async getDetailVillage({ commit }, codeVillage) {
    try {
      const response = await requestServer(`/api/areas/village-detail/${codeVillage}`, 'GET')
      return response
    } catch (error) {
      return error.response
    }
  },
  async getListSubDistrict({ commit }, codeDistrict) {
    try {
      const response = await requestServer(`/api/areas/sub-district/${codeDistrict}`, 'GET')
      return response
    } catch (error) {
      return error.response
    }
  },
  async getListVillage({ commit }, codeSubDistrict) {
    try {
      const response = await requestServer(`/api/areas/village/${codeSubDistrict}`, 'GET')
      return response
    } catch (error) {
      return error.response
    }
  },
  async getListHospital({ commit }, params) {
    try {
      const response = await requestServer('/api/areas/hospital', 'GET', params)
      commit('SET_HOSPITAL_CITY', response.data)
      return response
    } catch (error) {
      return error.response
    }
  },
  async listCountry({ commit }) {
    try {
      const response = await requestServer(`/api/country`, 'GET')
      return response
    } catch (error) {
      return error.response
    }
  },
  async listUnit({ commit }, params) {
    try {
      const response = await requestServer(`/api/unit`, 'GET', params)
      return response
    } catch (error) {
      return error.response
    }
  },
  async detailUnit({ commit }, id) {
    try {
      const response = await requestServer(`/api/unit/${id}`, 'GET')
      return response
    } catch (error) {
      return error.response
    }
  },
  async getLatitudeLongitude({ commit }, params) {
    try {
      let response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          ...params,
          key: process.env.VUE_APP_GOOGLE_MAP_API
        }
      })
      if (response.data.results) {
        response = response.data.results[0]['geometry'].location
      }
      return response
    } catch (error) {
      return error.response
    }
  },
  async getGeoJsonVillage({ commit }) {
    try {
      const response = await requestCache.get(process.env.VUE_APP_GEOJSON_VILLAGE, { noAuth: true })
      return response
    } catch (error) {
      return error.response
    }
  },
  async getGeoJsonSubDistrict({ commit }) {
    try {
      const response = await requestCache.get(process.env.VUE_APP_GEOJSON_SUBDISTRICT, { noAuth: true })
      return response
    } catch (error) {
      return error.response
    }
  },
  async getGeoJsonCity({ commit }) {
    try {
      const response = await requestCache.get(process.env.VUE_APP_GEOJSON_DISTRICT, { noAuth: true })
      return response
    } catch (error) {
      return error.response
    }
  },
  async getListUnitLab({ commit }) {
    try {
      const response = await requestServer('/api/areas/list-unit-lab', 'GET')
      return response
    } catch (error) {
      return error.response
    }
  }
}
