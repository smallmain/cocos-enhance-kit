var assetManagerWorkerAdapter = {
    // 返回当前 cc.assetManager.bundles 的 [name, base]
    getAllBundles(args, cmdId, callback) {
        var bundles = [];
        cc.assetManager.bundles.forEach((v, k) => {
            bundles.push([v.name, v.base]);
        });
        callback(cmdId, [bundles]);
    },
    // 删除缓存文件记录
    removeCachedFiles(args, cmdId, callback) {
        const deletedFiles = args[0];
        for (let i = 0, l = deletedFiles.length; i < l; i++) {
            cc.assetManager.cacheManager.cachedFiles.remove(deletedFiles[i]);
        }
    },
    // 添加缓存文件记录
    addCachedFiles(args, cmdId, callback) {
        const [id, cacheBundleRoot, localPath, time] = args[0];
        cc.assetManager.cacheManager.cachedFiles.add(id, { bundle: cacheBundleRoot, url: localPath, lastTime: time });
    },
};

module.exports = assetManagerWorkerAdapter;
