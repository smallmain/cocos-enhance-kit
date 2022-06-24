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

const renderer = window.renderer;

// program lib
_p = renderer.ProgramLib.prototype;
let _define = _p.define;
let _shdID = 0;
let _templates = {};
let libDefine = function (prog) {
    let { name, defines, glsl1 } = prog;
    let { vert, frag } = glsl1 || prog;
    if (_templates[name]) {
      console.warn(`Failed to define shader ${name}: already exists.`);
      return;
    }

    let id = ++_shdID;

    // calculate option mask offset
    let offset = 0;
    for (let i = 0; i < defines.length; ++i) {
      let def = defines[i];
      let cnt = 1;

      if (def.type === 'number') {
        let range = def.range || [];
        def.min = range[0] || 0;
        def.max = range[1] || 4;
        cnt = Math.ceil(Math.log2(def.max - def.min));

        def._map = function (value) {
          return (value - this.min) << this._offset;
        }.bind(def);
      } else { // boolean
        def._map = function (value) {
          if (value) {
            return 1 << this._offset;
          }
          return 0;
        }.bind(def);
      }

      offset += cnt;
      def._offset = offset;
    }

    let uniforms = prog.uniforms || [];

    if (prog.samplers) {
      for (let i = 0; i < prog.samplers.length; i++) {
        uniforms.push(prog.samplers[i])
      }
    }
    if (prog.blocks) {
      for (let i = 0; i < prog.blocks.length; i++) {
        let defines = prog.blocks[i].defines;
        let members = prog.blocks[i].members;
        for (let j = 0; j < members.length; j++) {
          uniforms.push({
            defines,
            name: members[j].name,
            type: members[j].type,
          })
        }
      }
    }

    // store it
    _templates[name] = {
      id,
      name,
      vert,
      frag,
      defines,
      attributes: prog.attributes,
      uniforms,
      extensions: prog.extensions
    };
    _define.call(this, name, vert, frag, defines);
}

let libGetTemplate = function (name) {
    return _templates[name];
}

// ForwardRenderer adapter
var _p = renderer.ForwardRenderer.prototype;
_p._ctor = function(device, builtin) {
  if (device) {
    this.init(device, [], builtin.defaultTexture, window.innerWidth, window.innerHeight);
    let templates = builtin.programTemplates;
    this._programLib = this.getProgramLib();
    this._programLib.define = libDefine;
    this._programLib.getTemplate = libGetTemplate;
    
    for (let i = 0; i < templates.length; ++i) {
        this._programLib.define(templates[i]);
    }
  }
};

// Camera
_p = renderer.Camera.prototype;
Object.defineProperty(_p, "cullingMask", {
    get () {
        return this.getCullingMask();
    },
    set (value) {
        this.setCullingMask(value);
    }
});

export default renderer;