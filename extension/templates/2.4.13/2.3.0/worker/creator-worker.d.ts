declare namespace worker {
    export const createInnerAudioContext: any;
    export const connectSocket: any;
    export function createSharedArrayBuffer(size: number): WXSharedArrayBuffer;
    export const downloadFile: any;
    export const env: { USER_DATA_PATH: string };
    export const getFileSystemManager: any;
    export const onMessage: any;
    export const postMessage: any;
    export const request: any;
    export const uploadFile: any;
    export interface WXSharedArrayBuffer {
        buffer: SharedArrayBuffer;
    }
}

declare module "ipc-worker.js" {
    /**
     * 是否初始化完成
     * 
     * - 初始化完成后，宏才被设为有效值
     */
    export const inited: boolean;

    /**
     * 访问主线程的入口
     */
    export const main: any;

    /**
     * 注册主线程可以访问的入口
     * 
     * 请务必在脚本执行时调用才有效。
     */
    export function registerHandler(name: string, handler: object): void;
}

/**
 * 是否启用自定义 Worker
 */
declare var CC_CUSTOM_WORKER: boolean;

/**
 * 是否启用 Worker 调度模式，这会减少通信次数
 */
declare var CC_WORKER_SCHEDULER: boolean;

/**
 * 是否启用 Worker 调试模式
 */
declare var CC_WORKER_DEBUG: boolean;

/**
 * 是否启用 Worker 使用同步版本的文件系统 API
 */
declare var CC_WORKER_FS_SYNC: boolean;

/**
 * 是否启用 Worker 驱动资源管线
 */
declare var CC_WORKER_ASSET_PIPELINE: boolean;

/**
 * 是否启用 Worker 驱动音频系统
 */
declare var CC_WORKER_AUDIO_SYSTEM: boolean;

/**
 * Worker 音频系统同步音频属性的间隔时间（单位：毫秒）
 */
declare var CC_WORKER_AUDIO_SYSTEM_SYNC_INTERVAL: number;

/**
 * 是否启用 Worker 驱动 HTTP 请求
 */
declare var CC_WORKER_HTTP_REQUEST: boolean;
