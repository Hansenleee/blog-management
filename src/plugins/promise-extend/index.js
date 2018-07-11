/**
 * 为Promise扩展finally方法,始终都会执行回调
 * @param callback 摘自阮一峰老师的博客
 * @returns {Promise.<*>}
 */
/* eslint no-extend-native: ["error", { "exceptions": ["Promise"] }] */
Promise.prototype.finally = function (callback) {
  const P = this.constructor
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  )
}
