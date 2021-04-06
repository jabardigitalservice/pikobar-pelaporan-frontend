import { required, email, max, numeric } from 'vee-validate/dist/rules'
import {
  isContainHtmlTags,
  isPhoneNumber,
  noWhiteSpaces,
  noAlphabet
  // isEmail
} from './validate'
import { extend, setInteractionMode } from 'vee-validate'
import i18n from '@/lang'
import store from '@/store'

setInteractionMode('eager')
extend('required', {
  ...required,
  message: (_, values) => i18n.t('errors.field_must_be_filled', values)
})

extend('max', {
  ...max,
  message: 'This field must be {length} characters or less'
})

extend('numeric', {
  ...numeric,
  message: (_, values) => i18n.t('errors.field_unauthorized_characters', values)
})

extend('notMinus', {
  message: (_, values) => i18n.t('errors.not_minus', values),
  validate: value => {
    return value >= 0
  }
})

extend('email', {
  ...email,
  message: (_, values) => i18n.t('errors.field_must_be_valid_email', values)
})

extend('isHtml', {
  message: (_, values) => i18n.t('errors.field_unauthorized_characters', values),
  validate: value => {
    return !isContainHtmlTags(value)
  }
})

extend('isPhoneNumber', {
  message: (_, values) => i18n.t('errors.field_phone_number_not_valid', values),
  validate: value => {
    return isPhoneNumber(value)
  }
})

extend('isWhiteSpaces', {
  message: (_, values) => i18n.t('errors.field_non_whitespaces', values),
  validate: value => {
    return noWhiteSpaces(value)
  }
})

extend('noAlphabet', {
  message: (_, values) => i18n.t('errors.field_must_be_filled_number', values),
  validate: value => {
    return noAlphabet(value)
  }
})

extend('isUsernameUsed', {
  message: (_, values) => i18n.t('errors.username_are_used', values),
  validate: async(value) => {
    let isUsed = true
    if (value !== undefined && value.length > 3) {
      const response = await store.dispatch('user/checkUsernameEmail', {
        params: value
      })
      isUsed = response.data
    }
    return !isUsed
  }
})

extend('isEmailUsed', {
  message: (_, values) => i18n.t('errors.email_are_used', values),
  validate: async(value) => {
    let isUsed = true
    if (value !== undefined && value.length > 3) {
      const response = await store.dispatch('user/checkUsernameEmail', {
        params: value
      })
      isUsed = response.data
    }
    return !isUsed
  }
})

extend('atLeastOne', {
  message: 'At least one item must be selected.',
  validate: (value) => {
    return value.length > 0
  }
})

extend('zeroFrontEnd', {
  message: (_, values) => i18n.t('errors.field_cannot_use_zero_in_first_and_last', values),
  validate: (value) => {
    return (value[0] !== '0' && value[value.length - 1] !== '0')
  }
})

extend('provinceCode', {
  message: (_, values) => i18n.t('errors.field_first_two_digits_must_province_code', values),
  validate: (value) => {
    const twoDigits = parseInt(value[0] + value[1])
    return ((twoDigits >= 11 && twoDigits <= 19) || twoDigits === 21 || (twoDigits >= 31 && twoDigits <= 36) || (twoDigits >= 51 && twoDigits <= 53) || (twoDigits >= 61 && twoDigits <= 65) || (twoDigits >= 71 && twoDigits <= 76) || twoDigits === 81 || twoDigits === 82 || twoDigits === 91 || twoDigits === 94)
  }
})

extend('sixteenDigits', {
  message: (_, values) => i18n.t('errors.field_must_contains_sixteen_digits', values),
  validate: (value) => {
    return (value !== undefined && value.length === 16)
  }
})

extend('isNikAvailable', {
  message: (_, values) => i18n.t('errors.duplicated_nik', values),
  validate: async(value) => {
    const response = await store.dispatch('reports/getNik', value)
    return (response.data === null)
  }
})
