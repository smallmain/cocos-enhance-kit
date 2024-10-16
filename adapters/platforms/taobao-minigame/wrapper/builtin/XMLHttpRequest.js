import EventTarget from './EventTarget.js'

const _url = new WeakMap()
const _method = new WeakMap()
const _requestHeader = new WeakMap()
const _responseHeader = new WeakMap()
const _requestTask = new WeakMap()

function _triggerEvent(type, ...args) {
  if (typeof this[`on${type}`] === 'function') {
    this[`on${type}`].apply(this, args)
  }
}

function _changeReadyState(readyState) {
  this.readyState = readyState
  _triggerEvent.call(this, 'readystatechange')
}

export default class XMLHttpRequest extends EventTarget {
  // TODO 没法模拟 HEADERS_RECEIVED 和 LOADING 两个状态
  static UNSEND = 0
  static OPENED = 1
  static HEADERS_RECEIVED = 2
  static LOADING = 3
  static DONE = 4

  timeout = 0;
  /*
   * TODO 这一批事件应该是在 XMLHttpRequestEventTarget.prototype 上面的
   */
  onabort = null
  onerror = null
  onload = null
  onloadstart = null
  onprogress = null
  ontimeout = null
  onloadend = null

  onreadystatechange = null
  readyState = 0
  response = null
  responseText = null
  responseType = ''
  responseXML = null
  status = 0
  statusText = ''
  upload = {}
  withCredentials = false

  constructor() {
    super();

    _requestHeader.set(this, {
      'content-type': 'application/json'
    })
    _responseHeader.set(this, {})
  }

  abort() {
    const myRequestTask =  _requestTask.get(this)

    if (myRequestTask) {
      myRequestTask.abort()
    }
  }

  getAllResponseHeaders() {
    const responseHeader = _responseHeader.get(this)

    return Object.keys(responseHeader).map((header) => {
      return `${header}: ${responseHeader[header]}`
    }).join('\n')
  }

  getResponseHeader(header) {
    return _responseHeader.get(this)[header]
  }

  open(method, url/* async, user, password 这几个参数在小程序内不支持*/) {
    _method.set(this, method)
    _url.set(this, url)
    _changeReadyState.call(this, XMLHttpRequest.OPENED)
  }

  overrideMimeType() {
  }

  send(data = '') {
    if (this.readyState !== XMLHttpRequest.OPENED) {
      throw new Error("Failed to execute 'send' on 'XMLHttpRequest': The object's state must be OPENED.")
    } else {
      let myRequestTask = my.tb.request({
        body: JSON.stringify(data),
        url: _url.get(this),
        method: _method.get(this),
        headers: _requestHeader.get(this),
        options: {timeout: this.timeout, enableSystemParams: true},
        success: (res) => {
          this.status = res.code;
          this.responseText = this.response = res.content;
          _responseHeader.set(this, _requestHeader.get(this))
          _triggerEvent.call(this, 'loadstart')
          _changeReadyState.call(this, XMLHttpRequest.HEADERS_RECEIVED)
          _changeReadyState.call(this, XMLHttpRequest.LOADING)
          _changeReadyState.call(this, XMLHttpRequest.DONE)
          _triggerEvent.call(this, 'load')
          _triggerEvent.call(this, 'loadend')
        },
        fail: (res) => {
          _triggerEvent.call(this, 'error', res)
          _triggerEvent.call(this, 'loadend')
        }
      })

      _requestTask.set(this, myRequestTask);
    }
  }

  setRequestHeader(header, value) {
    const myHeader = _requestHeader.get(this)

    myHeader[header] = value
    _requestHeader.set(this, myHeader)
  }

  addEventListener(type, listener) {
      if (typeof listener === 'function') {
          let _this = this
          let event = { target: _this }
          this['on' + type] = function (event) {
              listener.call(_this, event)
          }
      }
  }
}
