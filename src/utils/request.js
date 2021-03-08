import axios from 'axios'
// import assert from 'assert'
import store from '@/store'
import { ResponseRequest } from '@/utils/constantVariable'
import { setupCache } from 'axios-cache-adapter'

import { getToken } from '@/utils/cookies'

const isSecure = String(process.env.VUE_APP_SECURE) === 'true'
const method = isSecure ? 'https' : 'http'
let url
if (process.env.VUE_APP_PORT !== undefined && process.env.VUE_APP_PORT.length > 0) {
  url = `${method}://${process.env.VUE_APP_URL}:${process.env.VUE_APP_PORT}`
} else {
  url = `${method}://${process.env.VUE_APP_URL}`
}

// Create `axios-cache-adapter` instance
const cache = setupCache({
  maxAge: 15 * 60 * 1000
})

// create an axios instance
const service = axios.create({
  baseURL: url, // api base_url
  // withCredentials: false, // cookies
  // timeout: 500000, // request timeout
  adapter: cache.adapter// cache will be enabled by default
})

// request interceptor
service.interceptors.request.use(
  config => {
    // store.commit('animationLottie/SET_LOADING', true)
    // Do something before request is sent
    if (store.getters['user/token']) {
      // Set Bearer Token
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // store.commit('animationLottie/SET_LOADING', false)
    // Do something with request error
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get information such as headers or status
   * Please return  response => response
   */
  async(response) => {
    // store.commit('animationLottie/SET_LOADING', false)
    const res = response.data

    return res
  },
  async(error) => {
    // await store.dispatch('animationLottie/setLoading', false)
    if (!error.response.data.errors) {
      const status = await error.response.status
      switch (status) {
        case ResponseRequest.NOTFOUND:
          await store.dispatch('toast/errorToast', error.response.data.message)
          break
        case ResponseRequest.SERVERERROR:
          await store.dispatch('toast/errorToast', error.response.data.message)
          break
        case ResponseRequest.UNAUTHORIZED:
          await store.dispatch('toast/errorToast', error.response.data.message)
          break
        case ResponseRequest.UNPROCESSABLE:
          await store.dispatch('toast/errorToast', error.response.data.message)
          break
        default:
          await store.dispatch('toast/errorToast', error.message)
          break
      }
    }
    return Promise.reject(error)
  }
)

export default service
