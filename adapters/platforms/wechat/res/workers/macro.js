// 是否启用 Worker 调度模式，这会减少通信次数（必须一致）
globalThis.CC_WORKER_SCHEDULER = true;

// 是否启用 Worker 调试模式
globalThis.CC_WORKER_DEBUG = false;

// --- 以下从主线程同步值 ---

// 是否启用 Worker 使用同步版本的文件系统 API
globalThis.CC_WORKER_FS_SYNC = null;

// 是否启用 Worker 驱动资源管线（下载、缓存）
globalThis.CC_WORKER_ASSET_PIPELINE = null;

// 是否启用 Worker 驱动资源管线（加载）
globalThis.CC_WORKER_ASSET_PIPELINE_INCLUDE_LOAD = null;
