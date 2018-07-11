/**
 * -------------
 * cookie读写删除操作
 * *set、get、remove
 * -------------
 */

const decode = decodeURIComponent
const encode = encodeURIComponent
const toString = Object.prototype.toString

/**
 * 判断类型
 * @param {Any} name - 值
 * @return {String} 判断类型
 */
function typeOf(name) {
  return toString.call(name).slice(8, -1).toLowerCase()
}

/**
 * 判断是否为空字符串
 * @param {String} s - 字符串
 * @return {Boolean} 是否
 */
function isNoneEmptyString(s) {
  return typeOf(s) === 'string' && s !== '' && !!s
}

/**
 * 校验cookie.name值
 * @param {String} name - 名称
 */
function validateCookieName(name) {
  if (!isNoneEmptyString(name)) {
    throw new TypeError('Cookie name must be a non-empty string')
  }
}

/**
 * 返回不处理的值
 * @param {String} s - 值
 * @return {String} s
 */
function same(s) {
  return s
}

/**
 * 返回cookie的string值
 * @param {Boolean} shouldDecode - 需要decode
 * @return {String} 返回cookie.value
 */
function parseCookieString(shouldDecode) {
  const cookies = {}
  const cookie = global.document.cookie
  if (typeOf(cookie) === 'string' && cookie.length > 0) {
    // 判断是否需要对cookie值进行反编码处理
    const decodeValue = shouldDecode ? decode : same
    const cookieArrays = cookie.split(/;\s/g)
    const len = cookieArrays.length
    const regMatch = /([^=]+)=/i
    let cookieName = ''
    let cookieValue = ''
    // 循环遍历cookie数组
    for (let index = 0; index < len; index++) {
      const cookieNameValue = cookieArrays[index]
      const regCookie = regMatch.exec(cookieNameValue)
      // 判断正则匹配结果是否为数组
      if (typeOf(regCookie) === 'array' && regCookie.length > 1) {
        cookieName = decode(regCookie[1])
        cookieValue = decodeValue(cookieNameValue.replace(/[^=]+=/, ''))
      } else {
        // 如果没有取到name=value对应的简直对
        cookieName = decode(cookieNameValue)
        cookieValue = ''
      }
      // 加入到对象中
      if (cookieName) {
        cookies[cookieName] = cookieValue
      }
    }
  }
  return cookies
}

export default {
  /**
   * 返回指定name下的cookie值
   * @param {String} name - cookie值
   * @param {Object} options - 配置
   * @return {string} cookie值
   */
  getItem(name, options) {
    validateCookieName(name)

    if (typeOf(options) === 'function') {
      options = {
        converter: options,
      }
    } else {
      options = options || {}
    }

    const cookie = parseCookieString(!options.raw)
    return (options.converter || same)(cookie[name])
  },

  /**
   * 设置对应nam的cookie值
   * @param {String} name - cookie的name
   * @param {String} value - cookie的value值
   * @param {Object} options - cookie的配置
   * @param {String} options.expires - 有效期
   * @param {String} options.domain - 域名
   * @param {Stirng} options.path - 路径
   * @param {String} options.secure - 设置cookie安全，非https请求不带上cookie
   * @return {String} 返回设置的cookie
   */
  setItem(name, value, options) {
    validateCookieName(name)

    // 获取optios配置
    options = options || {}
    const expires = options.expires
    const domain = options.domain
    const path = options.path
    const secure = options.secure

    value = options.raw ? value : encode(value)
    let text = `${name}=${value}`

    // 有效期
    let date = expires
    if (typeOf(date) === 'number') {
      date = new Date()
      date.setDate(date.getDate() + expires)
    }
    if (typeOf(date) === 'date') {
      text += `; expires=${date.toUTCString()}`
    }
    // domain
    if (isNoneEmptyString(domain)) {
      text += `; domain=${domain}`
    }
    // path
    if (isNoneEmptyString(path)) {
      text += `; path=${path}`
    }
    // securepara
    if (isNoneEmptyString(secure)) {
      text += '; secure'
    }

    global.document.cookie = text
    return text
  },

  /**
   * 移除cookie
   * 移除cookie方法，原来的cookie的value设置为空，expire为当前时间，立即失效
   * @param {String} name - cookie的name
   * @param {Object} options - cookie的配置
   * @param {String} options.expires - 有效期
   * @param {String} options.domain - 域名
   * @param {Stirng} options.path - 路径
   * @param {String} options.secure - 设置cookie安全，非https请求不带上cookie
   * @return {String} 返回设置的cookie
   */
  removeItem(name, options) {
    options = options || {}
    options.expires = new Date(0)
    return this.setItem(name, '', options)
  },
}
