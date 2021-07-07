import requestServer from '@/api'
import {
  setToken,
  setUserSurvey,
  removeToken
} from '@/utils/cookies'
import { resetRouter } from '@/router'
import {
  setTokenFirebase,
  setRefreshFirebase
} from '@/utils/firebaseConfig'

export default {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      requestServer('/api/login', 'POST', userInfo).then((response) => {
        const { token, id } = response.data
        commit('SET_TOKEN', token)
        commit('SET_USER_ID', id)
        setToken(token)
        setUserSurvey(false)
        setTokenFirebase()
        resolve(response.data)
      }).catch((error) => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      requestServer('/api/users/info?', 'GET').then(async(response) => {
        const {
          role,
          fullname,
          phone_number,
          code_district_city,
          name_district_city,
          unit_id
        } = response.data
        setRefreshFirebase()
        commit('SET_ROLES', [role])
        commit('SET_DISTRICT', code_district_city)
        commit('SET_FULLNAME', fullname)
        commit('SET_PHONENUMBER', phone_number)
        commit('SET_DISTRICT_NAME', name_district_city)
        if (unit_id) {
          commit('SET_UNIT_NAME', unit_id.name)
          commit('SET_UNIT_TYPE', unit_id.unit_type)
        }
        resolve([role])
      }).catch((error) => {
        reject(error)
      })
    })
  },

  async changePasswordUser({ commit }, data) {
    try {
      const response = await requestServer('/api/users/change-password', 'PUT', data)
      return response
    } catch (error) {
      return error.response
    }
  },

  async createUser({ commit }, data) {
    try {
      const response = await requestServer('/api/users', 'POST', data)
      return response
    } catch (error) {
      return error.response
    }
  },

  async editUser({ commit }, data) {
    const id = await data.id
    await delete data['id']
    try {
      const response = await requestServer(`/api/users/${id}`, 'PUT', data.data)
      return response
    } catch (error) {
      return error.response
    }
  },

  async listUser({ commit }, params) {
    try {
      const response = await requestServer('/api/users', 'GET', params)
      if (response.data === null) {
        commit('SET_TOTAL_LIST_USER', 1)
        commit('SET_LIST_USER', [])
      } else {
        commit('SET_TOTAL_LIST_USER', response.data?._meta?.totalPages || 0)
        commit('SET_LIST_USER', response.data?.users || [])
      }
      return response
    } catch (error) {
      return error.response
    }
  },

  async detailUser({ commit }, id) {
    try {
      const response = await requestServer(`/api/users/${id}?`, 'GET')
      return response
    } catch (error) {
      return error.response
    }
  },

  async infoCurrentUser({ commit }) {
    try {
      const response = await requestServer(`/api/users/info`, 'GET')
      return response
    } catch (error) {
      return error.response
    }
  },

  async deleteUser({ commit }, id) {
    try {
      const response = await requestServer(`/api/users/${id}`, 'DELETE')
      return response
    } catch (error) {
      return error.response
    }
  },

  async checkUsernameEmail({ commit }, params) {
    try {
      const response = await requestServer('/api/users/check', 'GET', params)
      return response
    } catch (error) {
      return error.response
    }
  },

  resetForm({ commit }) {
    commit('RESET_FORM_USER')
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_DISTRICT', [])
      removeToken()
      resetRouter()

      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  }
}
