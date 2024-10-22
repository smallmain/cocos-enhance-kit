const { getUserDataPath, readJsonSync, deleteFileSync, makeDirSync, writeFileSync, copyFile, downloadFile, writeFile, deleteFile, rmdirSync, unzip, isOutOfStorage } = require("./fs-utils.js");
const { extname } = require("./path.js");
const { main } = require("./ipc-worker.js");

var checkNextPeriod = false;
var writeCacheFileTimer = null;
var suffix = 0;
const REGEX = /^https?:\/\/.*/;

function isEmptyObject(obj) {
    for (var key in obj) {
        return false;
    }
    return true;
}

var cacheManager_worker = {

    cacheDir: 'gamecaches',

    cachedFileName: 'cacheList.json',

    // whether or not cache asset into user's storage space
    cacheEnabled: true,

    // whether or not auto clear cache when storage ran out
    autoClear: true,

    // cache one per cycle
    cacheInterval: 500,

    deleteInterval: 500,

    writeFileInterval: 2000,

    // whether or not storage space has run out
    outOfStorage: false,

    tempFiles: null,

    cachedFiles: null,

    cacheQueue: {},

    version: '1.0',

    init(callback) {
        this.cacheDir = getUserDataPath() + '/' + this.cacheDir;
        var cacheFilePath = this.cacheDir + '/' + this.cachedFileName;
        var result = readJsonSync(cacheFilePath);
        if (result instanceof Error || !result.version) {
            if (!(result instanceof Error)) rmdirSync(this.cacheDir, true);
            this.cachedFiles = {};
            makeDirSync(this.cacheDir, true);
            writeFileSync(cacheFilePath, JSON.stringify({ files: this.cachedFiles, version: this.version }), 'utf8');
        }
        else {
            this.cachedFiles = result.files;
        }
        this.tempFiles = {};
        callback(this.cachedFiles);
    },

    transformUrl(url, reload) {
        var inLocal = false;
        var inCache = false;
        var isInUserDataPath = url.startsWith(getUserDataPath());
        if (isInUserDataPath) {
            inLocal = true;
        } else if (REGEX.test(url)) {
            if (!reload) {
                var cache = this.cachedFiles[url];
                if (cache) {
                    inCache = true;
                    url = cache.url;
                } else {
                    var tempUrl = this.tempFiles[url];
                    if (tempUrl) {
                        inLocal = true;
                        url = tempUrl;
                    }
                }
            }
        } else {
            inLocal = true;
        }
        return { url, inLocal, inCache };
    },

    download(
        callback,
        url,
        options_reload,
        options_header,
        options_cacheEnabled,
        options___cacheBundleRoot__,
    ) {
        var result = this.transformUrl(url, options_reload);
        if (result.inLocal) {
            callback(null, result.url);
        } else if (result.inCache) {
            this.updateLastTime(url);
            callback(null, result.url);
        }
        else {
            downloadFile(url, null, options_header, null, (err, path) => {
                if (err) {
                    callback(err.message, null);
                    return;
                }
                this.tempFiles[url] = path;
                this.cacheFile(null, url, path, options_cacheEnabled, options___cacheBundleRoot__, true);
                callback(null, path);
            });
        }
    },

    handleZip(
        callback,
        url,
        options_header,
        options___cacheBundleRoot__,
    ) {
        let cachedUnzip = this.cachedFiles[url];
        if (cachedUnzip) {
            this.updateLastTime(url);
            callback(null, cachedUnzip.url);
        } else if (REGEX.test(url)) {
            downloadFile(url, null, options_header, null, (err, downloadedZipPath) => {
                if (err) {
                    callback(err.message, null);
                    return;
                }
                this.unzipAndCacheBundle(url, downloadedZipPath, options___cacheBundleRoot__, callback);
            });
        } else {
            this.unzipAndCacheBundle(url, url, options___cacheBundleRoot__, callback);
        }
    },

    getTemp(callback, url) {
        callback(this.tempFiles.has(url) ? this.tempFiles.get(url) : '');
    },

    updateLastTime(url) {
        if (this.cachedFiles[url]) {
            var cache = this.cachedFiles[url];
            cache.lastTime = Date.now();
        }
    },

    writeCacheFile() {
        if (!writeCacheFileTimer) {
            writeCacheFileTimer = setTimeout(() => {
                writeCacheFileTimer = null;
                writeFile(this.cacheDir + '/' + this.cachedFileName, JSON.stringify({ files: this.cachedFiles, version: this.version }), "utf8", () => { });
            }, this.writeFileInterval);
        }
    },

    writeCacheFileSync() {
        writeFileSync(this.cacheDir + '/' + this.cachedFileName, JSON.stringify({ files: this.cachedFiles, version: this.version }), "utf8");
    },

    _cache() {
        var self = this;
        for (var id in this.cacheQueue) {
            var { srcUrl, isCopy, cacheBundleRoot, callback: _callback } = this.cacheQueue[id];
            var time = Date.now().toString();

            var localPath = '';

            if (cacheBundleRoot) {
                localPath = `${this.cacheDir}/${cacheBundleRoot}/${time}${suffix++}${extname(id)}`;
            }
            else {
                localPath = `${this.cacheDir}/${time}${suffix++}${extname(id)}`;
            }

            function callback(err) {
                checkNextPeriod = false;
                if (err) {
                    if (isOutOfStorage(err.message)) {
                        self.outOfStorage = true;
                        self.autoClear && self.clearLRU();
                        return;
                    }
                } else {
                    self.cachedFiles[id] = { bundle: cacheBundleRoot, url: localPath, lastTime: time };
                    delete self.cacheQueue[id];
                    self.writeCacheFile();
                    main.assetManager.addCachedFiles([id, cacheBundleRoot, localPath, time]);
                    if (_callback) _callback(id, cacheBundleRoot, localPath, time);
                }
                if (!isEmptyObject(self.cacheQueue)) {
                    checkNextPeriod = true;
                    setTimeout(self._cache.bind(self), self.cacheInterval);
                }
            }
            if (!isCopy) {
                downloadFile(srcUrl, localPath, null, callback);
            }
            else {
                copyFile(srcUrl, localPath, callback);
            }
            return;
        }
        checkNextPeriod = false;
    },

    cacheFile(callback, id, srcUrl, cacheEnabled, cacheBundleRoot, isCopy) {
        cacheEnabled = cacheEnabled !== undefined ? cacheEnabled : this.cacheEnabled;
        if (!cacheEnabled || this.cacheQueue[id] || this.cachedFiles[id]) {
            if (callback) callback(null);
            return;
        }

        this.cacheQueue[id] = { srcUrl, cacheBundleRoot, isCopy, callback };
        if (!checkNextPeriod) {
            checkNextPeriod = true;
            if (!this.outOfStorage) {
                setTimeout(this._cache.bind(this), this.cacheInterval);
            }
            else {
                checkNextPeriod = false;
            }
        }
    },

    clearCache(callback) {
        main.assetManager.getAllBundles(bundles => {
            this.cachedFiles = {};
            this.writeCacheFileSync();

            rmdirSync(this.cacheDir, true);
            makeDirSync(this.cacheDir, true);

            this.outOfStorage = false;

            bundles.forEach(bundle => {
                const [name, base] = bundle;
                if (REGEX.test(base)) this.makeBundleFolder(name);
            });

            callback();
        });
    },

    clearLRU(callback) {
        main.assetManager.getAllBundles(bundles => {
            var caches = [];
            var self = this;

            for (const key in this.cachedFiles) {
                const val = this.cachedFiles[key];
                if (val.bundle === 'internal') continue;
                if (self._isZipFile(key) && bundles.find(bundle => bundle[1].indexOf(val.url) !== -1)) continue;
                caches.push({ originUrl: key, url: val.url, lastTime: val.lastTime });
            }

            caches.sort(function (a, b) {
                return a.lastTime - b.lastTime;
            });

            caches.length = Math.floor(caches.length / 3);

            if (caches.length === 0) {
                if (callback) {
                    callback([]);
                }
                return;
            }

            for (var i = 0, l = caches.length; i < l; i++) {
                const item = caches[i];
                delete this.cachedFiles[item.originUrl];
                if (self._isZipFile(item.originUrl)) {
                    rmdirSync(item.url, true);
                } else {
                    deleteFileSync(item.url);
                }
            }

            this.outOfStorage = false;

            self.writeCacheFileSync();

            if (callback) {
                callback(caches.map(v => v.originUrl));
            } else {
                main.assetManager.removeCachedFiles(caches.map(v => v.originUrl));
            }
        });
    },

    removeCache(callback, url) {
        if (this.cachedFiles[url]) {
            var self = this;
            var path = this.cachedFiles[url].url;

            delete this.cachedFiles[url];

            if (self._isZipFile(url)) {
                rmdirSync(path, true);
            } else {
                deleteFileSync(path);
            }

            this.outOfStorage = false;

            self.writeCacheFileSync();
        }
        if (callback) callback();
    },

    makeBundleFolder(bundleName) {
        makeDirSync(this.cacheDir + '/' + bundleName, true);
    },

    unzipAndCacheBundle(id, zipFilePath, cacheBundleRoot, onComplete) {
        let time = Date.now().toString();
        let targetPath = `${this.cacheDir}/${cacheBundleRoot}/${time}${suffix++}`;
        let self = this;
        makeDirSync(targetPath, true);
        unzip(zipFilePath, targetPath, function (err) {
            if (err) {
                rmdirSync(targetPath, true);
                if (isOutOfStorage(err.message)) {
                    self.outOfStorage = true;
                    self.autoClear && self.clearLRU();
                }
                onComplete && onComplete(err);
                return;
            }
            self.cachedFiles[id] = { bundle: cacheBundleRoot, url: targetPath, lastTime: time };
            self.writeCacheFile();
            main.assetManager.addCachedFiles([id, cacheBundleRoot, targetPath, time]);
            onComplete && onComplete(null, targetPath);
        });
    },

    _isZipFile(url) {
        return url.slice(-4) === '.zip';
    },
};

module.exports = cacheManager_worker;
