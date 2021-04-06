export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function isContainHtmlTags(str) {
  const reg = /(\<\w*)((\s\/\>)|(.*\<\/\w*\>))/

  return reg.test(str)
}

export function isPhoneNumber(str) {
  const reg = /^(^\+62\s?|^0)(\d{3,4}-?){2}\d{3,4}$/

  return reg.test(str)
}

export function noWhiteSpaces(str) {
  const reg = /^\S*$/

  return reg.test(str)
}

export function noAlphabet(str) {
  const reg = /^-?\d*$/

  return reg.test(str)
}

export function isEmail(str) {
  const reg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/

  return reg.test(str)
}
