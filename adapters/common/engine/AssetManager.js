const cacheManager = require('../cache-manager');
const { fs, downloadFile, readText, readArrayBuffer, readJson, loadSubpackage, getUserDataPath, exists } = window.fsUtils;

const REGEX = /^https?:\/\/.*/;
const cachedSubpackageList = {};
const downloader = cc.assetManager.downloader;
const parser = cc.assetManager.parser;
const presets = cc.assetManager.presets;
const isSubDomain = __globalAdapter.isSubContext;
downloader.maxConcurrency = 8;
downloader.maxRequestsPerFrame = 64;
presets['scene'].maxConcurrency = 10;
presets['scene'].maxRequestsPerFrame = 64;

let SUBCONTEXT_ROOT, REMOTE_SERVER_ROOT;
let subpackages = {}, remoteBundles = {};

function downloadScript (url, options, onComplete) {
    if (typeof options === 'function') {
        onComplete = options;
        options = null;
    }
    if (REGEX.test(url)) {
        onComplete && onComplete(new Error('Can not load remote scripts'));
    }
    else {
        __cocos_require__(url);
        onComplete && onComplete(null);
    }
}

function handleZip (url, options, onComplete) {
    let cachedUnzip = cacheManager.cachedFiles.get(url);
    if (cachedUnzip) {
        cacheManager.updateLastTime(url);
        onComplete && onComplete(null, cachedUnzip.url);
    }
    else if (REGEX.test(url)) {
        downloadFile(url, null, options.header, options.onFileProgress, function (err, downloadedZipPath) {
            if (err) {
                onComplete && onComplete(err);
                return;
            }
            cacheManager.unzipAndCacheBundle(url, downloadedZipPath, options.__cacheBundleRoot__, onComplete);
        });
    }
    else {
        cacheManager.unzipAndCacheBundle(url, url, options.__cacheBundleRoot__, onComplete);
    }
}

function downloadDomAudio (url, options, onComplete) {
    if (typeof options === 'function') {
        onComplete = options;
        options = null;
    }
    
    let dom;
    let sys = cc.sys;
    if (sys.platform === sys.TAOBAO || sys.platform === sys.TAOBAO_MINIGAME) {
        dom = window.document.createElement('audio');
    } else {
        dom = document.createElement('audio');
    }
    dom.src = url;
    
    // HACK: wechat does not callback when load large number of assets
    onComplete && onComplete(null, dom);
}

function download (url, func, options, onFileProgress, onComplete) {
    var result = transformUrl(url, options);
    if (result.inLocal) {
        func(result.url, options, onComplete);
    }
    else if (result.inCache) {
        cacheManager.updateLastTime(url);
        func(result.url, options, function (err, data) {
            if (err) {
                cacheManager.removeCache(url);
            }
            onComplete(err, data);
        });
    }
    else {
        downloadFile(url, null, options.header, onFileProgress, function (err, path) {
            if (err) {
                onComplete(err, null);
                return;
            }
            func(path, options, function (err, data) {
                if (!err) {
                    cacheManager.tempFiles.add(url, path);
                    cacheManager.cacheFile(url, path, options.cacheEnabled, options.__cacheBundleRoot__, true);
                }
                onComplete(err, data);
            });
        });
    }
}

function parseArrayBuffer (url, options, onComplete) {
    readArrayBuffer(url, onComplete);
}

function parseText (url, options, onComplete) {
    readText(url, onComplete);
}

function parseJson (url, options, onComplete) {
    readJson(url, onComplete);
}

function downloadText (url, options, onComplete) {
    download(url, parseText, options, options.onFileProgress, onComplete);
}

var downloadJson = !isSubDomain ? function (url, options, onComplete) {
    download(url, parseJson, options, options.onFileProgress, onComplete);
} : function (url, options, onComplete) {
    var { url } = transformUrl(url, options);
    url = url.slice(SUBCONTEXT_ROOT.length + 1);  // remove subcontext root in url
    var content = __cocos_require__(cc.path.changeExtname(url, '.js'));
    onComplete && onComplete(null, content);
}

var loadFont = !isSubDomain ? function (url, options, onComplete) {
    var fontFamily = __globalAdapter.loadFont(url);
    onComplete(null, fontFamily || 'Arial');
} : function (url, options, onComplete) {
    onComplete(null, 'Arial');
}

function doNothing (content, options, onComplete) {
    exists(content, (existence) => {
        if (existence) {
            onComplete(null, content); 
        } else {
            onComplete(new Error(`file ${content} does not exist!`));
        }
    });
}

function downloadAsset (url, options, onComplete) {
    download(url, doNothing, options, options.onFileProgress, onComplete);
}

function subdomainTransformUrl (url, options, onComplete) {
    var { url } = transformUrl(url, options);
    onComplete(null, url);
}

function downloadBundle (nameOrUrl, options, onComplete) {
    let bundleName = cc.path.basename(nameOrUrl);
    var version = options.version || cc.assetManager.downloader.bundleVers[bundleName];
    const suffix = version ? `${version}.` : '';

    function getConfigPathForSubPackage () {
        let sys = cc.sys;
        if (sys.platform === sys.TAOBAO_MINIGAME) {
            return `${bundleName}/config.${suffix}json`;
        }
        return `subpackages/${bundleName}/config.${suffix}json`;
    }

    function appendBaseToJsonData (data) {
        if (!data) return;

        let sys = cc.sys;
        if (sys.platform === sys.TAOBAO_MINIGAME) {
            data.base = `${bundleName}/`;
        } else {
            data.base = `subpackages/${bundleName}/`;
        }
    }

    if (subpackages[bundleName]) {
        var config = getConfigPathForSubPackage();
        let loadedCb = function () {
            downloadJson(config, options, function (err, data) {
                appendBaseToJsonData(data);
                onComplete(err, data);
            });
        };
        if (cachedSubpackageList[bundleName]) {
            return loadedCb();
        }
        loadSubpackage(bundleName, options.onFileProgress, function (err) {
            if (err) {
                onComplete(err, null);
                return;
            }
            cachedSubpackageList[bundleName] = true;
            loadedCb();
        });
    }
    else {
        let js, url;
        if (REGEX.test(nameOrUrl) || (!isSubDomain && nameOrUrl.startsWith(getUserDataPath()))) {
            url = nameOrUrl;
            js = `src/scripts/${bundleName}/index.js`;
            cacheManager.makeBundleFolder(bundleName);
        }
        else {
            if (remoteBundles[bundleName]) {
                url = `${REMOTE_SERVER_ROOT}remote/${bundleName}`;
                js = `src/scripts/${bundleName}/index.js`;
                cacheManager.makeBundleFolder(bundleName);
            }
            else {
                url = `assets/${bundleName}`;
                js = `assets/${bundleName}/index.js`;
            }
        }
        __cocos_require__(js);
        options.__cacheBundleRoot__ = bundleName;
        var config = `${url}/config.${version ? version + '.' : ''}json`;
        downloadJson(config, options, function (err, data) {
            if (err) {
                onComplete && onComplete(err);
                return;
            }
            if (data.isZip) {
                let zipVersion = data.zipVersion;
                let zipUrl = `${url}/res.${zipVersion ? zipVersion + '.' : ''}zip`;
                handleZip(zipUrl, options, function (err, unzipPath) {
                    if (err) {
                        onComplete && onComplete(err);
                        return;
                    }
                    data.base = unzipPath + '/res/';
                    // PATCH: for android alipay version before v10.1.95 (v10.1.95 included)
                    // to remove in the future
                    let sys = cc.sys;
                    if (sys.platform === sys.ALIPAY_GAME && sys.os === sys.OS_ANDROID) {
                        let resPath = unzipPath + 'res/';
                        if (fs.accessSync({path: resPath}).success) {
                            data.base = resPath;
                        }
                    }
                    onComplete && onComplete(null, data);
                });
            }
            else {
                data.base = url + '/';
                onComplete && onComplete(null, data);
            }
        });
    }
};

const originParsePVRTex = parser.parsePVRTex;
let parsePVRTex = function (file, options, onComplete) {
    readArrayBuffer(file, function (err, data) {
        if (err) return onComplete(err);
        originParsePVRTex(data, options, onComplete);
    });
};

const originParseASTCTex = parser.parseASTCTex;
let parseASTCTex = function (file, options, onComplete) {
    readArrayBuffer(file, function (err, data) {
        if (err) return onComplete(err);
        originParseASTCTex(data, options, onComplete);
    });
};

const originParsePKMTex = parser.parsePKMTex;
let parsePKMTex = function (file, options, onComplete) {
    readArrayBuffer(file, function (err, data) {
        if (err) return onComplete(err);
        originParsePKMTex(data, options, onComplete);
    });
};

function parsePlist (url, options, onComplete) {
    readText(url, function (err, file) {
        var result = null;
        if (!err) {
            result = cc.plistParser.parse(file);
            if (!result) err = new Error('parse failed');
        }
        onComplete && onComplete(err, result);
    });
}

let downloadImage = isSubDomain ? subdomainTransformUrl : downloadAsset;
downloader.downloadDomAudio = downloadDomAudio;
downloader.downloadScript = downloadScript;
parser.parsePVRTex = parsePVRTex;
parser.parsePKMTex = parsePKMTex;
parser.parseASTCTex = parseASTCTex;

downloader.register({
    '.js' : downloadScript,

    // Audio
    '.mp3' : downloadAsset,
    '.ogg' : downloadAsset,
    '.wav' : downloadAsset,
    '.m4a' : downloadAsset,

    // Image
    '.png' : downloadImage,
    '.jpg' : downloadImage,
    '.bmp' : downloadImage,
    '.jpeg' : downloadImage,
    '.gif' : downloadImage,
    '.ico' : downloadImage,
    '.tiff' : downloadImage,
    '.image' : downloadImage,
    '.webp' : downloadImage,
    '.pvr': downloadAsset,
    '.pkm': downloadAsset,
    '.astc': downloadAsset,

    '.font': downloadAsset,
    '.eot': downloadAsset,
    '.ttf': downloadAsset,
    '.woff': downloadAsset,
    '.svg': downloadAsset,
    '.ttc': downloadAsset,

    // Txt
    '.txt' : downloadAsset,
    '.xml' : downloadAsset,
    '.vsh' : downloadAsset,
    '.fsh' : downloadAsset,
    '.atlas' : downloadAsset,

    '.tmx' : downloadAsset,
    '.tsx' : downloadAsset,
    '.plist' : downloadAsset,
    '.fnt' : downloadAsset,

    '.json' : downloadJson,
    '.ExportJson' : downloadAsset,

    '.binary' : downloadAsset,
    '.bin': downloadAsset,
    '.dbbin': downloadAsset,
    '.skel': downloadAsset,

    '.mp4': downloadAsset,
    '.avi': downloadAsset,
    '.mov': downloadAsset,
    '.mpg': downloadAsset,
    '.mpeg': downloadAsset,
    '.rm': downloadAsset,
    '.rmvb': downloadAsset,

    'bundle': downloadBundle,

    'default': downloadText,
});

parser.register({
    '.png' : downloader.downloadDomImage,
    '.jpg' : downloader.downloadDomImage,
    '.bmp' : downloader.downloadDomImage,
    '.jpeg' : downloader.downloadDomImage,
    '.gif' : downloader.downloadDomImage,
    '.ico' : downloader.downloadDomImage,
    '.tiff' : downloader.downloadDomImage,
    '.image' : downloader.downloadDomImage,
    '.webp' : downloader.downloadDomImage,
    '.pvr': parsePVRTex,
    '.pkm': parsePKMTex,
    '.astc': parseASTCTex,

    '.font': loadFont,
    '.eot': loadFont,
    '.ttf': loadFont,
    '.woff': loadFont,
    '.svg': loadFont,
    '.ttc': loadFont,

    // Audio
    '.mp3' : downloadDomAudio,
    '.ogg' : downloadDomAudio,
    '.wav' : downloadDomAudio,
    '.m4a' : downloadDomAudio,

    // Txt
    '.txt' : parseText,
    '.xml' : parseText,
    '.vsh' : parseText,
    '.fsh' : parseText,
    '.atlas' : parseText,

    '.tmx' : parseText,
    '.tsx' : parseText,
    '.fnt' : parseText,
    '.plist' : parsePlist,

    '.binary' : parseArrayBuffer,
    '.bin': parseArrayBuffer,
    '.dbbin': parseArrayBuffer,
    '.skel': parseArrayBuffer,

    '.ExportJson' : parseJson,
});

var transformUrl = !isSubDomain ? function (url, options) {
    var inLocal = false;
    var inCache = false;
    var isInUserDataPath = url.startsWith(getUserDataPath());
    if (isInUserDataPath) {
        inLocal = true;
    }
    else if (REGEX.test(url)) {
        if (!options.reload) {
            var cache = cacheManager.cachedFiles.get(url);
            if (cache) {
                inCache = true;
                url = cache.url;
            }
            else {
                var tempUrl = cacheManager.tempFiles.get(url);
                if (tempUrl) { 
                    inLocal = true;
                    url = tempUrl;
                }
            }
        }
    }
    else {
        inLocal = true;
    }
    return { url, inLocal, inCache };
} : function (url, options) {
    if (!REGEX.test(url)) {
        url = SUBCONTEXT_ROOT + '/' + url;
    }
    return { url };
}

if (!isSubDomain) {
    cc.assetManager.transformPipeline.append(function (task) {
        var input = task.output = task.input;
        for (var i = 0, l = input.length; i < l; i++) {
            var item = input[i];
            var options = item.options;
            if (!item.config) {
                if (item.ext === 'bundle') continue;
                options.cacheEnabled = options.cacheEnabled !== undefined ? options.cacheEnabled : false;
            }
            else {
                options.__cacheBundleRoot__ = item.config.name;
            }
        }
    });

    var originInit = cc.assetManager.init;
    cc.assetManager.init = function (options) {
        originInit.call(cc.assetManager, options);
        options.subpackages && options.subpackages.forEach(x => subpackages[x] = 'subpackages/' + x);
        options.remoteBundles && options.remoteBundles.forEach(x => remoteBundles[x] = true);
        REMOTE_SERVER_ROOT = options.server || '';
        if (REMOTE_SERVER_ROOT && !REMOTE_SERVER_ROOT.endsWith('/')) REMOTE_SERVER_ROOT += '/';
        cacheManager.init();
    };
}
else {
    var originInit = cc.assetManager.init;
    cc.assetManager.init = function (options) {
        originInit.call(cc.assetManager, options);
        SUBCONTEXT_ROOT = options.subContextRoot || '';
    };
}

