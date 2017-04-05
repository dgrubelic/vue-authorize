import { isFunction, isPromise } from '../utils.js'
import Promise from '../promise.js'

export default class Permission {
  constructor(name, handler) {
    this.name = name
    
    if (isFunction(handler)) {
      this.handler = handler
    } else {
      throw new Error('Permission handler must be function.')
    }
  }

  /**
   * Invoke permission handler
   * @param  {Object} context Permission handler context
   * @return {Promise}
   */
  invoke(context) {
    let invokeResult = this.handler.call(context || this)
    if (isPromise(invokeResult)) {
      return invokeResult
    } else {
      return new Promise(function (resolve, reject) {
        if (!!invokeResult) {
          resolve()
        } else {
          reject()
        }
      })
    }
  }
}