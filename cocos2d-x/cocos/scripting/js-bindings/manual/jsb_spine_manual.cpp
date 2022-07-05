/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

//
//  jsb_spine_manual.cpp
//  cocos2d_js_bindings
//
//  Created by James Chen on 6/14/17.
//
//

#include "base/ccConfig.h"
#include "jsb_spine_manual.hpp"

#if USE_SPINE > 0

#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#include "cocos/scripting/js-bindings/manual/jsb_conversions.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_global.h"
#include "cocos/scripting/js-bindings/manual/jsb_helper.hpp"
#include "cocos/scripting/js-bindings/auto/jsb_cocos2dx_spine_auto.hpp"

#include "middleware-adapter.h"
#include "spine-creator-support/SkeletonDataMgr.h"
#include "spine-creator-support/SkeletonRenderer.h"
#include "spine-creator-support/spine-cocos2dx.h"

#include "cocos2d.h"
#include "cocos/editor-support/spine/spine.h"
#include "cocos/editor-support/spine-creator-support/spine-cocos2dx.h"

#include "cocos/editor-support/spine-creator-support/AttachmentVertices.h"

using namespace cocos2d;

static spine::Cocos2dTextureLoader textureLoader;
static cocos2d::Map<std::string, middleware::Texture2D*>* _preloadedAtlasTextures = nullptr;
static middleware::Texture2D* _getPreloadedAtlasTexture(const char* path)
{
    assert(_preloadedAtlasTextures);
    auto it = _preloadedAtlasTextures->find(path);
    return it != _preloadedAtlasTextures->end() ? it->second : nullptr;
}

static bool js_register_spine_initSkeletonData (se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc != 5) {
        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 5);
        return false;
    }
    bool ok = false;
    
    std::string uuid;
    ok = seval_to_std_string(args[0], &uuid);
    SE_PRECONDITION2(ok, false, "js_register_spine_initSkeletonData: Invalid uuid content!");
    
    auto mgr = spine::SkeletonDataMgr::getInstance();
    bool hasSkeletonData = mgr->hasSkeletonData(uuid);
    if (hasSkeletonData) {
        spine::SkeletonData* skeletonData = mgr->retainByUUID(uuid);
        native_ptr_to_rooted_seval<spine::SkeletonData>(skeletonData, &s.rval());
        return true;
    }
    
    std::string skeletonDataFile;
    ok = seval_to_std_string(args[1], &skeletonDataFile);
    SE_PRECONDITION2(ok, false, "js_register_spine_initSkeletonData: Invalid json path!");
    
    std::string atlasText;
    ok = seval_to_std_string(args[2], &atlasText);
    SE_PRECONDITION2(ok, false, "js_register_spine_initSkeletonData: Invalid atlas content!");
    
    cocos2d::Map<std::string, middleware::Texture2D*> textures;
    ok = seval_to_Map_string_key(args[3], &textures);
    SE_PRECONDITION2(ok, false, "js_register_spine_initSkeletonData: Invalid textures!");
    
    float scale = 1.0f;
    ok = seval_to_float(args[4], &scale);
    SE_PRECONDITION2(ok, false, "js_register_spine_initSkeletonData: Invalid scale!");
    
    // create atlas from preloaded texture
    
    _preloadedAtlasTextures = &textures;
    spine::spAtlasPage_setCustomTextureLoader(_getPreloadedAtlasTexture);

    spine::Atlas* atlas = new (__FILE__, __LINE__) spine::Atlas(atlasText.c_str(), (int)atlasText.size(), "", &textureLoader);
    
    _preloadedAtlasTextures = nullptr;
    spine::spAtlasPage_setCustomTextureLoader(nullptr);
    
    spine::AttachmentLoader* attachmentLoader = new (__FILE__, __LINE__) spine::Cocos2dAtlasAttachmentLoader(atlas);
    spine::SkeletonData* skeletonData = nullptr;

    std::size_t length = skeletonDataFile.length();
    auto binPos = skeletonDataFile.find(".skel", length - 5);
    if (binPos == std::string::npos) binPos = skeletonDataFile.find(".bin", length - 4);

    if (binPos != std::string::npos) {
        auto fileUtils = cocos2d::FileUtils::getInstance();
        if (fileUtils->isFileExist(skeletonDataFile))
        {
            cocos2d::Data cocos2dData;
            const auto fullpath = fileUtils->fullPathForFilename(skeletonDataFile);
            fileUtils->getContents(fullpath, &cocos2dData);
            
            spine::SkeletonBinary binary(attachmentLoader);
            binary.setScale(scale);
            skeletonData = binary.readSkeletonData(cocos2dData.getBytes(), (int)cocos2dData.getSize());
            CCASSERT(skeletonData, !binary.getError().isEmpty() ? binary.getError().buffer() : "Error reading binary skeleton data.");
        }
    } else {
        spine::SkeletonJson json(attachmentLoader);
        json.setScale(scale);
        skeletonData = json.readSkeletonData(skeletonDataFile.c_str());
        CCASSERT(skeletonData, !json.getError().isEmpty() ? json.getError().buffer() : "Error reading json skeleton data.");
    }
    
    if (skeletonData) {
        std::vector<int> texturesIndex;
        for (auto it = textures.begin(); it != textures.end(); it++)
        {
            texturesIndex.push_back(it->second->getRealTextureIndex());
        }
        mgr->setSkeletonData(uuid, skeletonData, atlas, attachmentLoader, texturesIndex);
        native_ptr_to_rooted_seval<spine::SkeletonData>(skeletonData, &s.rval());
    } else {
        if (atlas) {
            delete atlas;
            atlas = nullptr;
        }
        if (attachmentLoader) {
            delete attachmentLoader;
            attachmentLoader = nullptr;
        }
    }
    return true;
}
SE_BIND_FUNC(js_register_spine_initSkeletonData)

static bool js_register_spine_disposeSkeletonData (se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc != 1) {
        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 5);
        return false;
    }
    bool ok = false;
    
    std::string uuid;
    ok = seval_to_std_string(args[0], &uuid);
    SE_PRECONDITION2(ok, false, "js_register_spine_disposeSkeletonData: Invalid uuid content!");
    
    auto mgr = spine::SkeletonDataMgr::getInstance();
    bool hasSkeletonData = mgr->hasSkeletonData(uuid);
    if (!hasSkeletonData) return true;
    mgr->releaseByUUID(uuid);
    return true;
}
SE_BIND_FUNC(js_register_spine_disposeSkeletonData)

static bool js_register_spine_initSkeletonRenderer(se::State& s)
{
    // renderer, jsonPath, atlasText, textures, scale
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc != 2) {
        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 5);
        return false;
    }
    bool ok = false;
    
    spine::SkeletonRenderer* node = nullptr;
    ok = seval_to_native_ptr(args[0], &node);
    SE_PRECONDITION2(ok, false, "js_register_spine_initSkeletonData: Converting SpineRenderer failed!");
    
    std::string uuid;
    ok = seval_to_std_string(args[1], &uuid);
    SE_PRECONDITION2(ok, false, "js_register_spine_initSkeletonData: Invalid uuid content!");
    
    auto mgr = spine::SkeletonDataMgr::getInstance();
    bool hasSkeletonData = mgr->hasSkeletonData(uuid);
    if (hasSkeletonData) {
        node->initWithUUID(uuid);
    }
    return true;
}
SE_BIND_FUNC(js_register_spine_initSkeletonRenderer)

static bool js_register_spine_retainSkeletonData(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc != 1) {
        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 1);
        return false;
    }
    bool ok = false;
    
    std::string uuid;
    ok = seval_to_std_string(args[0], &uuid);
    SE_PRECONDITION2(ok, false, "js_register_spine_hasSkeletonData: Invalid uuid content!");
    
    auto mgr = spine::SkeletonDataMgr::getInstance();
    bool hasSkeletonData = mgr->hasSkeletonData(uuid);
    if (hasSkeletonData) {
        spine::SkeletonData* skeletonData = mgr->retainByUUID(uuid);
        native_ptr_to_rooted_seval<spine::SkeletonData>(skeletonData, &s.rval());
    }
    return true;
}
SE_BIND_FUNC(js_register_spine_retainSkeletonData)

bool spine_skin_attachments_to_seval(std::vector<std::map<std::string, spine::Attachment*>>& v, se::Value* ret) {
	assert(ret != nullptr);
	bool ok = true;
	se::HandleObject arr(se::Object::createArrayObject(v.size()));

	int i = 0;

	for (const auto &vv : v)
	{
		se::HandleObject obj(se::Object::createPlainObject());

		se::Value tmp;
		for (const auto& e : vv) {
			native_ptr_to_rooted_seval<spine::Attachment>(e.second, &tmp);
			obj->setProperty(e.first.c_str(), tmp);
		}

		arr->setArrayElement(i, se::Value(obj));
		i++;
	}

	ret->setObject(arr, true);

	return ok;
}

static bool js_cocos2dx_spine_Skin_getAttachmentsForJSB(se::State& s) {
    spine::Skin* cobj = (spine::Skin*)s.nativeThisObject();
    SE_PRECONDITION2(
        cobj, false,
        "js_cocos2dx_spine_Skin_getAttachmentsForJSB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::vector<std::map<std::string, spine::Attachment*>> result =
            cobj->getAttachmentsForJSB();
        ok &= spine_skin_attachments_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false,
                         "js_cocos2dx_spine_Skin_getAttachmentsForJSB : Error "
                         "processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d",
                    (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_Skin_getAttachmentsForJSB)

static bool js_cocos2dx_spine_RegionAttachment_getTextureForJSB(se::State& s) {
    spine::RegionAttachment* cobj =
        (spine::RegionAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(
        cobj, false,
        "js_cocos2dx_spine_RegionAttachment_getTextureForJSB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::AttachmentVertices* attachmentVertices = (spine::AttachmentVertices*)cobj->getRendererObject();
        ok &= native_ptr_to_seval<cocos2d::middleware::Texture2D>((cocos2d::middleware::Texture2D*)attachmentVertices->_texture, &s.rval());
        SE_PRECONDITION2(ok, false,
                         "js_cocos2dx_spine_RegionAttachment_getTextureForJSB : Error "
                         "processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d",
                    (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_RegionAttachment_getTextureForJSB)

static bool js_cocos2dx_spine_RegionAttachment_setRegionForJSB(se::State& s) {
    spine::RegionAttachment* attachment =
        (spine::RegionAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(
        attachment, false,
        "js_cocos2dx_spine_RegionAttachment_setRegionForJSB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc != 5) {
        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 5);
        return false;
    }
    bool ok = false;

    if (attachment == nullptr) return false;

    cocos2d::middleware::Texture2D* texture = nullptr;
    ok = seval_to_native_ptr(args[0], &texture);
    SE_PRECONDITION2(
        ok, false,
        "js_cocos2dx_spine_RegionAttachment_setRegionForJSB: Converting Middleware Texture2D failed!");

    cocos2d::renderer::Rect rect;
    ok = seval_to_Rect(args[1], &rect);
    SE_PRECONDITION2(
        ok, false, "js_cocos2dx_spine_RegionAttachment_setRegionForJSB: Converting Invalid Rect failed!");

    cocos2d::Size originalSize;
    ok = seval_to_Size(args[2], &originalSize);
    SE_PRECONDITION2(
        ok, false, "js_cocos2dx_spine_RegionAttachment_setRegionForJSB: Converting Invalid OriginalSize failed!");

    cocos2d::Vec2 offset;
    ok = seval_to_Vec2(args[3], &offset);
    SE_PRECONDITION2(
        ok, false, "js_cocos2dx_spine_RegionAttachment_setRegionForJSB: Converting Invalid Offset failed!");

    float degrees;
    ok = seval_to_float(args[4], &degrees);
    SE_PRECONDITION2(
        ok, false, "js_cocos2dx_spine_RegionAttachment_setRegionForJSB: Converting Invalid Degrees failed!");

    spine::AttachmentVertices* attachmentVertices = (spine::AttachmentVertices*)attachment->getRendererObject();

    CC_SAFE_RELEASE(attachmentVertices->_texture);
    attachmentVertices->_texture = texture;
    CC_SAFE_RETAIN(texture);

    float u, v, u2, v2;
    float w = texture->getNativeTexture()->getWidth();
    float h = texture->getNativeTexture()->getHeight();
    if (degrees != 0) {
        u = rect.x / w;
        v = rect.y / h;
        u2 = (rect.x + rect.h) / w;
        v2 = (rect.y + rect.w) / h;
    } else {
        u = rect.x / w;
        v = rect.y / h;
        u2 = (rect.x + rect.w) / w;
        v2 = (rect.y + rect.h) / h;
    }

    attachment->setRegionX(rect.x);
    attachment->setRegionY(rect.y);
    attachment->setRegionWidth(rect.w);
    attachment->setRegionHeight(rect.h);
    attachment->setRegionOriginalWidth(originalSize.width);
    attachment->setRegionOriginalHeight(originalSize.height);
    attachment->setRegionOffsetX(offset.x);
    attachment->setRegionOffsetY(offset.y);
    attachment->setRegionDegrees(degrees);

    attachment->setUVs(u, v, u2, v2, degrees);
    attachment->updateOffset();

    cocos2d::middleware::V2F_T2F_C4B* vertices = attachmentVertices->_triangles->verts;
    for (int i = 0, ii = 0; i < 4; ++i, ii += 2) {
        vertices[i].texCoord.u = attachment->getUVs()[ii];
        vertices[i].texCoord.v = attachment->getUVs()[ii + 1];
    }

    return true;
}
SE_BIND_FUNC(js_cocos2dx_spine_RegionAttachment_setRegionForJSB)

static bool js_cocos2dx_spine_MeshAttachment_getTextureForJSB(se::State& s) {
    spine::MeshAttachment* cobj =
        (spine::MeshAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(
        cobj, false,
        "js_cocos2dx_spine_MeshAttachment_getTextureForJSB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::AttachmentVertices* attachmentVertices = (spine::AttachmentVertices*)cobj->getRendererObject();
        ok &= native_ptr_to_seval<cocos2d::middleware::Texture2D>((cocos2d::middleware::Texture2D*)attachmentVertices->_texture, &s.rval());
        SE_PRECONDITION2(ok, false,
                         "js_cocos2dx_spine_MeshAttachment_getTextureForJSB : Error "
                         "processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d",
                    (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_spine_MeshAttachment_getTextureForJSB)

static bool js_cocos2dx_spine_MeshAttachment_setRegionForJSB(se::State& s) {
    spine::MeshAttachment* attachment =
        (spine::MeshAttachment*)s.nativeThisObject();
    SE_PRECONDITION2(
        attachment, false,
        "js_cocos2dx_spine_MeshAttachment_setRegionForJSB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc != 5) {
        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 5);
        return false;
    }
    bool ok = false;

    if (attachment == nullptr) return false;

    cocos2d::middleware::Texture2D* texture = nullptr;
    ok = seval_to_native_ptr(args[0], &texture);
    SE_PRECONDITION2(
        ok, false,
        "js_cocos2dx_spine_MeshAttachment_setRegionForJSB: Converting Middleware Texture2D failed!");

    cocos2d::renderer::Rect rect;
    ok = seval_to_Rect(args[1], &rect);
    SE_PRECONDITION2(
        ok, false, "js_cocos2dx_spine_MeshAttachment_setRegionForJSB: Converting Invalid Rect failed!");

    cocos2d::Size originalSize;
    ok = seval_to_Size(args[2], &originalSize);
    SE_PRECONDITION2(
        ok, false, "js_cocos2dx_spine_MeshAttachment_setRegionForJSB: Converting Invalid OriginalSize failed!");

    cocos2d::Vec2 offset;
    ok = seval_to_Vec2(args[3], &offset);
    SE_PRECONDITION2(
        ok, false, "js_cocos2dx_spine_MeshAttachment_setRegionForJSB: Converting Invalid Offset failed!");

    float degrees;
    ok = seval_to_float(args[4], &degrees);
    SE_PRECONDITION2(
        ok, false, "js_cocos2dx_spine_MeshAttachment_setRegionForJSB: Converting Invalid Degrees failed!");

    spine::AttachmentVertices* attachmentVertices = (spine::AttachmentVertices*)attachment->getRendererObject();

    CC_SAFE_RELEASE(attachmentVertices->_texture);
    attachmentVertices->_texture = texture;
    CC_SAFE_RETAIN(texture);

    float u, v, u2, v2;
    float w = texture->getNativeTexture()->getWidth();
    float h = texture->getNativeTexture()->getHeight();
    if (degrees != 0) {
        u = rect.x / w;
        v = rect.y / h;
        u2 = (rect.x + rect.h) / w;
        v2 = (rect.y + rect.w) / h;
    } else {
        u = rect.x / w;
        v = rect.y / h;
        u2 = (rect.x + rect.w) / w;
        v2 = (rect.y + rect.h) / h;
    }

    attachment->setRegionU(u);
    attachment->setRegionV(v);
    attachment->setRegionU2(u2);
    attachment->setRegionV2(v2);
    attachment->setRegionRotate(degrees != 0);
    attachment->setRegionDegrees(degrees);

    attachment->setRegionX(rect.x);
    attachment->setRegionY(rect.y);
    attachment->setRegionWidth(rect.w);
    attachment->setRegionHeight(rect.h);
    attachment->setRegionOriginalWidth(originalSize.width);
    attachment->setRegionOriginalHeight(originalSize.height);
    attachment->setRegionOffsetX(offset.x);
    attachment->setRegionOffsetY(offset.y);

    attachment->updateUVs();

    cocos2d::middleware::V2F_T2F_C4B* vertices = attachmentVertices->_triangles->verts;
        for (size_t i = 0, ii = 0, nn = attachment->getWorldVerticesLength(); ii < nn; ++i, ii += 2) {
            vertices[i].texCoord.u = attachment->getUVs()[ii];
            vertices[i].texCoord.v = attachment->getUVs()[ii + 1];
        }

    return true;
}
SE_BIND_FUNC(js_cocos2dx_spine_MeshAttachment_setRegionForJSB)

bool register_all_spine_manual(se::Object* obj)
{
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("spine", &nsVal))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("spine", nsVal);
    }
    se::Object* ns = nsVal.toObject();
    
    ns->defineFunction("initSkeletonRenderer", _SE(js_register_spine_initSkeletonRenderer));
    ns->defineFunction("initSkeletonData", _SE(js_register_spine_initSkeletonData));
    ns->defineFunction("retainSkeletonData", _SE(js_register_spine_retainSkeletonData));
    ns->defineFunction("disposeSkeletonData", _SE(js_register_spine_disposeSkeletonData));

    __jsb_spine_Skin_proto->defineFunction("getAttachments", _SE(js_cocos2dx_spine_Skin_getAttachmentsForJSB));

    __jsb_spine_RegionAttachment_proto->defineFunction("getTextureForJSB",_SE(js_cocos2dx_spine_RegionAttachment_getTextureForJSB));
    __jsb_spine_RegionAttachment_proto->defineFunction("setRegionForJSB",_SE(js_cocos2dx_spine_RegionAttachment_setRegionForJSB));

    __jsb_spine_MeshAttachment_proto->defineFunction("getTextureForJSB",_SE(js_cocos2dx_spine_MeshAttachment_getTextureForJSB));
    __jsb_spine_MeshAttachment_proto->defineFunction("setRegionForJSB",_SE(js_cocos2dx_spine_MeshAttachment_setRegionForJSB));

    spine::setSpineObjectDisposeCallback([](void* spineObj){
        se::Object* seObj = nullptr;
        
        auto iter = se::NativePtrToObjectMap::find(spineObj);
        if (iter != se::NativePtrToObjectMap::end())
        {
            // Save se::Object pointer for being used in cleanup method.
            seObj = iter->second;
            // Unmap native and js object since native object was destroyed.
            // Otherwise, it may trigger 'assertion' in se::Object::setPrivateData later
            // since native obj is already released and the new native object may be assigned with
            // the same address.
            se::NativePtrToObjectMap::erase(iter);
        }
        else
        {
            return;
        }
        
        auto cleanup = [seObj](){
            
            auto se = se::ScriptEngine::getInstance();
            if (!se->isValid() || se->isInCleanup())
                return;
            
            se::AutoHandleScope hs;
            se->clearException();
            
            // The mapping of native object & se::Object was cleared in above code.
            // The private data (native object) may be a different object associated with other se::Object.
            // Therefore, don't clear the mapping again.
            seObj->clearPrivateData(false);
            seObj->unroot();
            seObj->decRef();
        };
        
        if (!se::ScriptEngine::getInstance()->isGarbageCollecting())
        {
            cleanup();
        }
        else
        {
            CleanupTask::pushTaskToAutoReleasePool(cleanup);
        }
    });
    
    se::ScriptEngine::getInstance()->addBeforeCleanupHook([](){
        spine::SkeletonDataMgr::destroyInstance();
    });
    
    se::ScriptEngine::getInstance()->clearException();
    
    return true;
}

#endif
