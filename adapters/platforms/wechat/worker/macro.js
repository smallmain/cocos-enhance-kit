const isSubContext = wx.getOpenDataContext === undefined;
const sysinfo = wx.getSystemInfoSync();
const platform = sysinfo.platform.toLowerCase();
const isAndroid = platform === "android";
const isDevtools = platform === "devtools";
const sdkVersion = sysinfo.SDKVersion.split('.').map(Number);
// >= 2.20.2
const hasWorker = sdkVersion[0] > 2 || (sdkVersion[0] === 2 && (sdkVersion[1] > 20 || (sdkVersion[1] === 20 && sdkVersion[2] >= 2)));
// >= 2.27.3
const useSubpackage = sdkVersion[0] > 2 || (sdkVersion[0] === 2 && (sdkVersion[1] > 27 || (sdkVersion[1] === 27 && sdkVersion[2] >= 3)));

// 是否启用 Worker 驱动资源管线
if (!("CC_WORKER_ASSET_PIPELINE" in globalThis)) {
    globalThis.CC_WORKER_ASSET_PIPELINE = false;
    // NOTE 截止 2024.10.22，微信未修复 iOS、Windows、Mac 上仅文件系统 API 可以正常使用的问题
    globalThis.CC_WORKER_ASSET_PIPELINE = (isAndroid || isDevtools) && globalThis.CC_WORKER_ASSET_PIPELINE;
}

// 是否启用 Worker 驱动音频系统
if (!("CC_WORKER_AUDIO_SYSTEM" in globalThis)) {
    globalThis.CC_WORKER_AUDIO_SYSTEM = false;
    // NOTE 截止 2024.10.22，微信未修复 iOS、Windows、Mac 上仅文件系统 API 可以正常使用的问题
    globalThis.CC_WORKER_AUDIO_SYSTEM = (isAndroid || isDevtools) && globalThis.CC_WORKER_AUDIO_SYSTEM;
}

// Worker 音频系统同步音频属性的间隔时间（单位：毫秒）
if (!("CC_WORKER_AUDIO_SYSTEM_SYNC_INTERVAL" in globalThis)) {
    globalThis.CC_WORKER_AUDIO_SYSTEM_SYNC_INTERVAL = 500;
}

// 是否启用 Worker 驱动 HTTP 请求
if (!("CC_WORKER_HTTP_REQUEST" in globalThis)) {
    globalThis.CC_WORKER_HTTP_REQUEST = false;
    // NOTE 截止 2024.10.22，微信未修复 iOS、Windows、Mac 上仅文件系统 API 可以正常使用的问题
    globalThis.CC_WORKER_HTTP_REQUEST = (isAndroid || isDevtools) && globalThis.CC_WORKER_HTTP_REQUEST;
}

// 是否启用自定义 Worker
if (!("CC_CUSTOM_WORKER" in globalThis)) {
    globalThis.CC_CUSTOM_WORKER = false;
}

// 是否启用 Worker
if (!("CC_USE_WORKER" in globalThis)) {
    globalThis.CC_USE_WORKER = (CC_WORKER_ASSET_PIPELINE || CC_WORKER_AUDIO_SYSTEM || CC_CUSTOM_WORKER || CC_WORKER_HTTP_REQUEST) && hasWorker && !isSubContext;
}

// 是否启用 Worker 调试模式
if (!("CC_WORKER_DEBUG" in globalThis)) {
    globalThis.CC_WORKER_DEBUG = false;
}

// 是否启用 Worker 调度模式，这也许能减少通信次数带来的性能消耗
globalThis.CC_WORKER_SCHEDULER = true;

// 是否启用 Worker 使用同步版本的文件系统 API
// NOTE: IOS 不支持 async 文件系统 API，Android 不支持部分 sync 文件系统 API，其余系统暂不确定
if (!("CC_WORKER_FS_SYNC" in globalThis)) {
    globalThis.CC_WORKER_FS_SYNC = !isAndroid && !isDevtools;
}

// 是否启用 Worker 子包
if (!("CC_WORKER_SUB_PACKAGE" in globalThis)) {
    // NOTE 截止 2024.10.22，部分安卓机型声明使用子包 Worker 会报 java.string 错误
    globalThis.CC_WORKER_SUB_PACKAGE = false;   // useSubpackage
}
