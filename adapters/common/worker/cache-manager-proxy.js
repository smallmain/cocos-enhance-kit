const { getUserDataPath, readJsonSync, makeDirSync, writeFileSync, copyFile, downloadFile, writeFile, deleteFile, rmdirSync, unzip, isOutOfStorage } = window.fsUtils;

var cacheManager = {

    // 以下为单向属性，修改会同步到 Worker 中
    _cacheDir: 'gamecaches',
    get cacheDir() {
        return this._cacheDir;
    },
    set cacheDir(v) {
        worker.cacheManager.set_cacheDir([this._cacheDir = v]);
    },

    _cachedFileName: 'cacheList.json',
    get cachedFileName() {
        return this._cachedFileName;
    },
    set cachedFileName(v) {
        worker.cacheManager.set_cachedFileName([this._cachedFileName = v]);
    },

    _cacheEnabled: true,
    get cacheEnabled() {
        return this._cacheEnabled;
    },
    set cacheEnabled(v) {
        worker.cacheManager.set_cacheEnabled([this._cacheEnabled = v]);
    },

    _autoClear: true,
    get autoClear() {
        return this._autoClear;
    },
    set autoClear(v) {
        worker.cacheManager.set_autoClear([this._autoClear = v]);
    },

    _cacheInterval: 500,
    get cacheInterval() {
        return this._cacheInterval;
    },
    set cacheInterval(v) {
        worker.cacheManager.set_cacheInterval([this._cacheInterval = v]);
    },

    _deleteInterval: 500,
    get deleteInterval() {
        return this._deleteInterval;
    },
    set deleteInterval(v) {
        worker.cacheManager.set_deleteInterval([this._deleteInterval = v]);
    },

    // 以下属性未暴露，仅在 Worker 中保留
    // writeFileInterval: 2000,
    // outOfStorage: false,
    // tempFiles: null,
    // cacheQueue: {},

    // 以下为只读属性，并且在变动时从 Worker 中同步，需注意 lastTime 可能不是最新的
    cachedFiles: null,

    // 以下为只读属性
    version: '1.0',

    // 增加 download 函数以在 Worker 执行下载逻辑
    download(url, func, options, onFileProgress, onComplete) {
        // 暂未实现 onFileProgress 回调
        worker.cacheManager.download(
            [url, options.reload, options.header, options.cacheEnabled, options.__cacheBundleRoot__],
            ([errMsg, path]) => {
                if (errMsg) {
                    onComplete(new Error(errMsg), null);
                    return;
                }
                func(path, options, (err, data) => {
                    if (err) {
                        this.removeCache(url);
                    }
                    onComplete(err, data);
                });
            },
        );
    },

    // 增加 handleZip 函数以在 Worker 执行处理逻辑
    handleZip(url, options, onComplete) {
        // 暂未实现 options.onFileProgress 回调
        worker.cacheManager.handleZip(
            [url, options.header, options.__cacheBundleRoot__],
            ([errMsg, path]) => {
                if (errMsg) {
                    onComplete(new Error(errMsg), null);
                } else {
                    onComplete(null, path);
                }
            },
        );
    },

    getCache(url) {
        return this.cachedFiles.has(url) ? this.cachedFiles.get(url).url : '';
    },

    // getTemp 改为异步函数
    getTempAsync(url, callback) {
        worker.cacheManager.getTemp([url], ([url]) => {
            callback(url);
        });
    },

    init() {
        this._cacheDir = getUserDataPath() + '/' + this.cacheDir;
        worker.cacheManager.init(([cachedFiles]) => {
            this.cachedFiles = new cc.AssetManager.Cache(cachedFiles);
        });
    },

    clearCache() {
        worker.cacheManager.clearCache(() => {
            this.cachedFiles.clear();
        });
    },

    clearLRU() {
        worker.cacheManager.clearLRU(([deletedFiles]) => {
            for (let i = 0, l = deletedFiles.length; i < l; i++) {
                this.cachedFiles.remove(deletedFiles[i]);
            }
        });
    },

    removeCache(url) {
        worker.cacheManager.removeCache([url], () => {
            this.cachedFiles.remove(url);
        });
    },

    makeBundleFolder(bundleName) {
        makeDirSync(this.cacheDir + '/' + bundleName, true);
    },
};

cc.assetManager.cacheManager = module.exports = cacheManager;
