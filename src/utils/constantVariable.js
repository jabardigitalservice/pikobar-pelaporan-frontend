import { format } from 'date-fns'
import moment from 'moment'
export const ISO_FORMAT = 'yyyy-MM-dd'
export const DEFAULT_DATE = format(new Date(), ISO_FORMAT)
export const DEFAULT_ACTION_LABELS = {
  apply: 'Apply',
  cancel: 'Cancel',
  reset: 'Reset'
}

export const ResponseRequest = {
  TIMEOUT: 'ECONNABORTED',
  NETWORKERROR: 'Network Error',
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOTFOUND: 404,
  UNPROCESSABLE: 422,
  SERVERERROR: 500
}

export function baseUrl() {
  let url = `${window.location.hostname}`
  if (window.location.port.length > 0) {
    url += `:${window.location.port}`
  }
  return url
}

export function getAge(DOB) {
  const today = new Date()
  const birthDate = new Date(DOB)
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age = age - 1
  }
  return age
}

export function getAgeWithMonth(dob) {
  const today = moment()
  const birthDate = moment(dob, 'YYYY/MM/DD')
  let age = moment.duration(today.diff(birthDate))
  const year = age.years()
  const month = age.months()
  age = {
    'year': year,
    'month': month
  }
  return age
}

export function listYear() {
  var currentYear = new Date().getFullYear()
  const list = []
  for (var y = 0; y < 100; y++) {
    list.push(currentYear)
    currentYear--
  }
  return list
}

export function listDays() {
  const listDay = []
  for (let d = 1; d <= 31; d++) {
    listDay.push(d)
  }
  return listDay
}

export const rolesPerm = {
  'ADMIN': 'superadmin',
  'DINKESPROV': 'dinkesprov',
  'DINKESKOTA': 'dinkeskota',
  'FASKES': 'faskes'
}

export const rolesWidget = {
  'all': [rolesPerm.ADMIN, rolesPerm.DINKESPROV, rolesPerm.DINKESKOTA, rolesPerm.FASKES],
  'superadmin': [rolesPerm.ADMIN, rolesPerm.DINKESPROV],
  'dinkeskota': [rolesPerm.ADMIN, rolesPerm.DINKESKOTA],
  'dinkesKotaAndFaskes': [rolesPerm.DINKESKOTA, rolesPerm.FASKES]
}

export const rolesCriteria = {
  'stillQuarantine': ['CLOSECONTACT'],
  'stillSick': ['PROBABLE', 'SUSPECT', 'CONFIRMATION'],
  'recovery': ['PROBABLE', 'CONFIRMATION'],
  'discarded': ['CLOSECONTACT', 'SUSPECT']
}

export const inspectionType = {
  'inspectiontype1': ['pcr', 'rapid', 'tcm_sars_cov_2']
}

export const testResults = {
  'testResults1': ['rapid'],
  'testResults2': ['pcr', 'tcm_sars_cov_2'],
  'testResults3': ['pcr', 'rapid', 'tcm_sars_cov_2']
}
