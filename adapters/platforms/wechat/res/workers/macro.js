// 是否启用 Worker 调度模式，这会减少通信次数（必须一致）
globalThis.CC_WORKER_SCHEDULER = true;

// 是否启用 Worker 调试模式
globalThis.CC_WORKER_DEBUG = false;

// --- 以下从主线程同步值 ---

// 是否启用 Worker 使用同步版本的文件系统 API
globalThis.CC_WORKER_FS_SYNC = null;

// 是否启用 Worker 驱动资源管线
globalThis.CC_WORKER_ASSET_PIPELINE = null;

// 是否启用 Worker 驱动音频系统
globalThis.CC_WORKER_AUDIO_SYSTEM = null;

// Worker 音频系统同步音频属性的间隔时间（单位：毫秒）
globalThis.CC_WORKER_AUDIO_SYSTEM_SYNC_INTERVAL = null;
