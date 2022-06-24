/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

require('./jsb-sys.js');
require('./jsb-game.js');
require('./jsb-videoplayer.js');
require('./jsb-webview.js');
require('./jsb-audio.js');
require('./jsb-loader.js');
require('./jsb-editbox.js');
require('./jsb-reflection.js');
require('./jsb-assets-manager.js');
require('./jsb-safearea.js');

if (CC_NATIVERENDERER) {
    require('./jsb-effect.js');
    require('./jsb-effect-variant.js');
    require('./scene/camera.js');
    require('./scene/light.js');
    require('./scene/node-proxy.js');
    require('./scene/render-flow.js');
    // must be required after render flow
    require('./scene/node.js');

    cc.game.on(cc.game.EVENT_ENGINE_INITED, function () {
        require('./scene/mesh-buffer.js');
        require('./scene/quad-buffer.js');
        require('./scene/render-data.js');

        require('./assemblers/assembler.js');
        require('./assemblers/assembler-2d.js');
        require('./assemblers/assembler-3d.js');

        require('./assemblers/sprite/index.js');
        require('./assemblers/label/index.js');
        require('./assemblers/mask-assembler.js');
        require('./assemblers/graphics-assembler.js');
        require('./assemblers/motion-streak.js');
        require('./assemblers/mesh-renderer.js');
        require('./assemblers/particle-3d-assembler.js');

        require('./jsb-dragonbones.js');
        require('./jsb-spine-skeleton.js');
        require('./jsb-particle.js');
        require('./jsb-tiledmap.js');
        require('./jsb-skin-mesh.js');
    });
}