const isSubContext = wx.getOpenDataContext === undefined;
const sysinfo = wx.getSystemInfoSync();
const platform = sysinfo.platform.toLowerCase();
const isIOS = platform === "ios";
const sdkVersion = sysinfo.SDKVersion.split('.').map(Number);
// >= 2.20.2
const hasWorker = sdkVersion[0] > 2 || (sdkVersion[0] === 2 && (sdkVersion[1] > 20 || (sdkVersion[1] === 20 && sdkVersion[2] >= 2)));

// 是否启用 Worker 驱动资源管线（下载、缓存）
globalThis.CC_WORKER_ASSET_PIPELINE = false;

// 是否启用 Worker
globalThis.CC_USE_WORKER = (CC_WORKER_ASSET_PIPELINE) && hasWorker && !isSubContext;

// 是否启用 Worker 调试模式
globalThis.CC_WORKER_DEBUG = true;

// 是否启用 Worker 调度模式，这也许能减少通信次数带来的性能消耗（必须一致）
globalThis.CC_WORKER_SCHEDULER = true;

// 是否启用 Worker 使用同步版本的文件系统 API
// NOTE: IOS 不支持 async 文件系统 API，Android 不支持部分 sync 文件系统 API
globalThis.CC_WORKER_FS_SYNC = isIOS;
