import axios from 'axios'
import { setupCache } from 'axios-cache-adapter'
import localforage from 'localforage'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'

import store from '@/store'
import { getToken } from '@/utils/cookies'
import { ResponseRequest } from '@/utils/constantVariable'

// cache age 2 minutes
const CACHE_MAX_AGE = 2 * 60 * 1000

// Extracting 'axios-cache-adapter/src/exclude' as importing it leads to webpack not compiling it.
function excludeChace(config, req) {
  const { exclude = {}} = config

  if (typeof exclude.filter === 'function' && exclude.filter(req)) {
    debug(`Excluding request by filter ${req.url}`)

    return true
  }

  // do not cache request with query
  const hasQueryParams = req.url.match(/\?.*$/) || !isEmpty(req.params)

  if (exclude.query && hasQueryParams) {
    debug(`Excluding request by query ${req.url}`)

    return true
  }

  const paths = exclude.paths || []
  const found = find(paths, regexp => req.url.match(regexp))

  if (found) {
    debug(`Excluding request by url match ${req.url}`)

    return true
  }

  // do not cache request with id
  const hasIdParams = req.url.split('/').some((el) => el.length === 24)
  if (exclude.query && hasIdParams) {
    return true
  }

  return false
}

// Create a store.
const cacheStore = localforage.createInstance({ name: 'pelaporan' })

// Define the cache adapter.
const cacheAdapter = setupCache({
  clearOnStale: false,
  debug: false,
  exclude: {
    filter: req => {
      return req.cache && req.cache.exclude
    }
  },
  key: req => {
    return (req.cache && req.cache.key) || req.url
  },
  maxAge: CACHE_MAX_AGE,
  store: cacheStore
})

const getKey = cacheAdapter.config.key
const debug = cacheAdapter.config.debug

// Our adapter factory which handles network errors, and groups.
const myAdapter = function(adapter) {
  return async function(req) {
    const isExcluded = excludeChace(cacheAdapter.config, req)
    const key = getKey(req)

    // Add the key to the groups.
    if (!isExcluded && req.cache && req.cache.groups) {
      const groupsCacheKey = '__groups'
      const groupsKeys = (await cacheStore.getItem(groupsCacheKey)) || {}
      let hasSetAny = false
      const groups = req.cache.groups || []
      groups.forEach(async(val) => {
        if (!(val in groupsKeys)) {
          groupsKeys[val] = []
        }
        if (groupsKeys[val].indexOf(key) < 0) {
          hasSetAny = true
          groupsKeys[val].push(key)
        }
      })

      // Commit the changes.
      if (hasSetAny) {
        await cacheStore.setItem(groupsCacheKey, groupsKeys)
      }
    }

    let res
    try {
      res = await adapter(req)
    } catch (e) {
      debug('request-failed', req.url)
      if (e.request && (req.cache && req.cache.useOnNetworkError) && !isExcluded) {
        // Mimic the behaviour of axios-cache-adapter, but directly get from store.
        res = await cacheStore.getItem(key)
        if (res && res.data) {
          res = res.data
          res.config = req
          res.request = {
            networkError: true,
            fromCache: true
          }
          return res
        }
      }

      throw e
    }

    return res
  }
}

const clearCacheByKey = async function(key) {
  const result = await cacheStore.getItem(key)
  if (result && 'expires' in result) {
    result.expires = 1
    await cacheStore.setItem(key, result)
  }
}

const clearCacheByGroup = async function(group) {
  const groups = (await cacheStore.getItem('__groups')) || {}
  const keys = groups[group] || []
  keys.forEach(async(val) => {
    await clearCacheByKey(val)
  })
}

const clearCacheByGroups = function(groups) {
  return Promise.all(groups.map(clearCacheByGroup))
}

const purgeCache = async function() {
  await cacheStore.clear()
}

const isSecure = String(process.env.VUE_APP_SECURE) === 'true'
const method = isSecure ? 'https' : 'http'
let urlHost
if (process.env.VUE_APP_PORT !== undefined && process.env.VUE_APP_PORT.length > 0) {
  urlHost = `${method}://${process.env.VUE_APP_URL}:${process.env.VUE_APP_PORT}`
} else {
  urlHost = `${method}://${process.env.VUE_APP_URL}`
}

const serviceCache = axios.create({
  // The cache adapter.
  baseURL: urlHost, // api base_url
  adapter: myAdapter(cacheAdapter.adapter),
  cache: {
    key: null,
    useOnNetworkError: true
  }
})

// request interceptor
serviceCache.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (store.getters['user/token'] && !config.noAuth) {
      // Set Bearer Token
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // Do something with request error
    Promise.reject(error)
  }
)

// response interceptor
serviceCache.interceptors.response.use(
  /**
   * If you want to get information such as headers or status
   * Please return  response => response
   */
  async(response) => {
    // store.commit('animationLottie/SET_LOADING', false)
    const resChache = response.data

    return resChache
  },
  async(error_) => {
    // await store.dispatch('animationLottie/setLoading', false)
    if (!error_.response.data.errors) {
      const status = await error_.response.status
      switch (status) {
        case ResponseRequest.NOTFOUND:
          await store.dispatch('toast/errorToast', error_.response.data.message)
          break
        case ResponseRequest.SERVERERROR:
          await store.dispatch('toast/errorToast', error_.response.data.message)
          break
        case ResponseRequest.UNAUTHORIZED:
          await store.dispatch('toast/errorToast', error_.response.data.message)
          break
        case ResponseRequest.UNPROCESSABLE:
          await store.dispatch('toast/errorToast', error_.response.data.message)
          break
        default:
          await store.dispatch('toast/errorToast', error_.message)
          break
      }
    }
    return Promise.reject(error_)
  }
)

const get = async function(url, config) {
  return serviceCache.get(url, config)
}

export default { get, clearCacheByKey, clearCacheByGroup, clearCacheByGroups, purgeCache }
