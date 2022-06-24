/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
 
import { attrTypeBytes } from "./enums";
const gfx = window.gfx;

// ====================
// exports
// ====================

export default class VertexFormat {
  /**
   * @constructor
   * @param {Array} infos
   *
   * @example
   * let vertexFmt = new VertexFormat([
   *   { name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 3 },
   *   { name: gfx.ATTR_UV0, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
   *   { name: gfx.ATTR_COLOR, type: gfx.ATTR_TYPE_FLOAT32, num: 4, normalize: true },
   * ])
   */
  constructor(infos) {
    this._attr2el = {};
    this._elements = [];
    this._bytes = 0;

    let offset = 0;
    for (let i = 0, len = infos.length; i < len; ++i) {
      let info = infos[i];
      let el = {
        name: info.name,
        offset: offset,
        stride: 0,
        stream: -1,
        type: info.type,
        num: info.num,
        normalize: (info.normalize === undefined) ? false : info.normalize,
        bytes: info.num * attrTypeBytes(info.type),
      };
      // log('info.num is:' + info.num + ' attrTypeBytes(info.type) is:' + attrTypeBytes(info.type));

      this._attr2el[el.name] = el;
      this._elements.push(el);

      this._bytes += el.bytes;
      offset += el.bytes;
    }

    for (let i = 0, len = this._elements.length; i < len; ++i) {
      let el = this._elements[i];
      el.stride = this._bytes;
    }

    this._nativeObj = new gfx.VertexFormatNative(this._elements);
  }

  /**
   * @method element
   * @param {string} attrName
   */
  element(attrName) {
    return this._attr2el[attrName];
  }

  getElement (attrName) {
    return this._attr2el[attrName];
  }

  getBytes () {
    return this._bytes;
  }

  getAttributeNames () {
    return Object.keys(this._attr2el);
  }
}