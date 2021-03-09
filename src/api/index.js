import request from '@/utils/request'
import requestCache from '@/utils/requestCache'

export async function requestServer(url, method, data, onProgress) {
  if ((method === 'GET')) {
    const response = await requestCache.get(url, { params: data }, {
      cache: {
        groups: ['members']
      }
    })
    return response
  } else if (method === 'DELETE') {
    return request({
      url: url,
      method: method,
      params: data
    })
  } else if ((method === 'PUT') || (method === 'POST')) {
    return request({
      url: url,
      method: method,
      data
    })
  } else if (method === 'UPLOAD') {
    return request({
      url: url,
      method: 'POST',
      data,
      onUploadProgress: function(e) {
        if (e.lengthComputable) {
          const percentCompleted = Math.round((e.loaded * 100) / e.total)
          if (onProgress) onProgress(percentCompleted)
          return percentCompleted
        }
      }
    })
  }
}

export default requestServer
