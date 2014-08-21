/**
 * Retry a promise constructor callback a number of times before rejecting.
 * 
 * @param {Number} count the number of times to try
 * @param {Number} wait the number of ms to wait between retries
 * @param {Function} cb a standard promise callabck (resolve, reject)
 * @param {Function} cond optional takes error retry if returns true
 * @return {Function} wrapped promise constructor callback
 */

 module.exports = function mulligan(count, wait, cb, cond) {
  return function (resolve, reject) {
    var rejectHandler = function (err) {
      if (--count > 0 && (!cond || cond(err))) {
        setTimeout(attempt, wait)
      } else {
        reject(err)
      }
    }
    var attempt = function () {
      cb(resolve, rejectHandler)
    }
    attempt()
  }
}

