'use strict';
const fs = require('fs');
const path = require('path');

/**
 * 环境信息
 */
let engineEditorPath = path.dirname(path.dirname(Editor.frameworkPath));
let engineVersion = null;

const engineMinigameAdapterPath = path.join(engineEditorPath, "builtin", "adapters");
const engineWechatMinigameWorkerMainMacroPath = path.join(engineEditorPath, "builtin", "adapters", "platforms/wechat/worker/macro.js");
const engineWechatMinigameWorkerSubMacroPath = path.join(engineEditorPath, "builtin", "adapters", "platforms/wechat/res/workers/macro.js");

const WECHAT_MINIGAME_WORKER_SUB_PATH = "platforms/wechat/res/workers";
const WECHAT_MINIGAME_CONFIG_PATH = "platforms/wechat/res/game.json";
const WECHAT_MINIGAME_WORKER_CUSTOM_PATH = "platforms/wechat/res/workers/custom";

function t(str) {
    return Editor.T('enhance-kit.' + str);
}

function getMinigameAdapterVersion() {
    try {
        return fs.readFileSync(path.join(engineMinigameAdapterPath, "VERSION.md"), { encoding: "utf-8" }).trim();
    } catch (error) {
        // Editor.error(error);
        return "";
    }
}

function getProjectWorkerDtsPath() {
    return path.join(getProjectCustomWorkerPath(), "creator-worker.d.ts");
}

function getProjectCustomWorkerPath() {
    return path.join(path.dirname(Editor.url("db://assets/")), "worker");
}

function getProjectCustomWorkerSrcPath() {
    return path.join(getProjectCustomWorkerPath(), "src");
}

function getTemplatePath(version, name) {
    return path.join(Editor.url("packages://enhance-kit"), "templates", String(engineVersion), version, name);
}

function copyFolder(src, dest) {
    function createDir(path) {
        fs.mkdirSync(path)
    }

    if (fs.existsSync(src)) {
        createDir(dest)
        /**
         * @des 方式一：利用子进程操作命令行方式
         */
        // child_process.spawn('cp', ['-r', copiedPath, resultPath])

        /**
         * @des 方式二：
         */
        const files = fs.readdirSync(src, { withFileTypes: true });
        for (let i = 0; i < files.length; i++) {
            const cf = files[i]
            const ccp = path.join(src, cf.name)
            const crp = path.join(dest, cf.name)
            if (cf.isFile()) {
                fs.copyFileSync(ccp, crp)
            } else if (cf.isDirectory()) {
                try {
                    /**
                     * @des 判断读(R_OK | W_OK)写权限
                     */
                    fs.accessSync(path.join(crp, '..'), fs.constants.W_OK)
                    copyFolder(ccp, crp, true);
                } catch (error) {
                    Editor.error('folder write error:', error);
                }

            } else if (cf.isSymbolicLink()) {
                fs.symlinkSync(fs.readlinkSync(ccp), crp)
            } else if (cf.isBlockDevice() || cf.isCharacterDevice()) {
                fs.copyFileSync(ccp, crp)
            } else {
                Editor.error('not file or directory: ', ccp);
            }
        }
    } else {
        Editor.error('do not exist path: ', src);
    }
}

function getSettings() {
    const minigameVersion = getMinigameAdapterVersion();
    const isUninstalled = minigameVersion === "";
    const isSupported = !isUninstalled && Number(minigameVersion.split(".")[0]) >= 2;
    if (isUninstalled) {
        return { code: -1, errMsg: t('not_install') };
    } else if (!isSupported) {
        return { code: -2, errMsg: t('version_not_2_0') };
    } else {
        const content = fs.readFileSync(engineWechatMinigameWorkerMainMacroPath, { encoding: "utf-8" });

        return {
            code: 0,
            CC_WORKER_DEBUG: getMacroBooleanValue(content, "CC_WORKER_DEBUG"),
            CC_WORKER_ASSET_PIPELINE: getMacroBooleanValue(content, "CC_WORKER_ASSET_PIPELINE"),
            CC_WORKER_AUDIO_SYSTEM: getMacroBooleanValue(content, "CC_WORKER_AUDIO_SYSTEM"),
            CC_WORKER_SCHEDULER: getMacroBooleanValue(content, "CC_WORKER_SCHEDULER"),
            CC_WORKER_AUDIO_SYSTEM_SYNC_INTERVAL: getMacroIntegerValue(content, "CC_WORKER_AUDIO_SYSTEM_SYNC_INTERVAL"),
            CC_CUSTOM_WORKER: getMacroBooleanValue(content, "CC_CUSTOM_WORKER"),
            CC_WORKER_HTTP_REQUEST: getMacroBooleanValue(content, "CC_WORKER_HTTP_REQUEST"),
            CC_WORKER_WEBSOCKET: getMacroBooleanValue(content, "CC_WORKER_WEBSOCKET"),
            CC_WORKER_SUB_PACKAGE: getMacroBooleanValue(content, "CC_WORKER_SUB_PACKAGE"),
        };
    }
}

function syncSettingsToSubWorker() {
    const result = getSettings();
    if (result.code === 0) {
        let content = fs.readFileSync(engineWechatMinigameWorkerSubMacroPath, { encoding: "utf-8" });

        for (const key in result) {
            if (key !== "code") {
                content = setMacroValue(content, key, result[key]);
            }
        }

        fs.writeFileSync(engineWechatMinigameWorkerSubMacroPath, content);
    }
}

function setSettings(macro, value) {
    {
        const content = fs.readFileSync(engineWechatMinigameWorkerMainMacroPath, { encoding: "utf-8" });
        fs.writeFileSync(engineWechatMinigameWorkerMainMacroPath, setMacroValue(content, macro, value));
    }

    checkAndModifyWorkerFiles();
    refreshCustomThreadCode();
    syncSettingsToSubWorker();
}

function getMacroBooleanValue(text, macro) {
    const regex = new RegExp(`globalThis\\.${macro}\\s*=\\s*(true|false);`);
    const match = text.match(regex);
    return match ? match[1] === 'true' : null;
}

function getMacroIntegerValue(text, macro) {
    const regex = new RegExp(`globalThis\\.${macro}\\s*=\\s*(\\d+);`);
    const match = text.match(regex);
    return match ? parseInt(match[1]) : null;
}

function setMacroValue(text, macro, value) {
    if (typeof value === "number") {
        const regex = new RegExp(`globalThis\\.${macro}\\s*=\\s*(\\d+);`);
        const replacement = `globalThis.${macro} = ${value};`;
        return text.replace(regex, replacement);
    } else if (typeof value === "boolean") {
        const regex = new RegExp(`globalThis\\.${macro}\\s*=\\s*(true|false);`);
        const replacement = `globalThis.${macro} = ${value};`;
        return text.replace(regex, replacement);
    } else {
        Editor.error(`setMacroValue: unknown value: ${value}`);
    }
}

function checkAndModifyWorkerFiles() {
    const result = getSettings();
    if (result.code === 0) {
        const workerDir = path.join(engineMinigameAdapterPath, WECHAT_MINIGAME_WORKER_SUB_PATH);
        const gameJsonPath = path.join(engineMinigameAdapterPath, WECHAT_MINIGAME_CONFIG_PATH);
        const gameJson = JSON.parse(fs.readFileSync(gameJsonPath, { encoding: "utf-8" }));

        // 是否启用 Worker
        if (result.CC_WORKER_ASSET_PIPELINE || result.CC_WORKER_AUDIO_SYSTEM || result.CC_CUSTOM_WORKER || result.CC_WORKER_HTTP_REQUEST || result.CC_WORKER_WEBSOCKET) {
            // 没有 Worker 目录与配置的话提醒用户重新安装
            if (!(gameJson.workers && fs.existsSync(workerDir))) {
                Editor.error(t('thread_not_right_workers_dir'));
            }
        } else {
            Editor.warn(t('thread_need_delete_files'));
        }

        // 是否使用子包
        if (gameJson.workers) {
            gameJson.workers.isSubpackage = result.CC_WORKER_SUB_PACKAGE;
            fs.writeFileSync(gameJsonPath, JSON.stringify(gameJson, null, 2));
        }
    }
}

function refreshCustomThreadCode() {
    const result = getSettings();
    if (result.code === 0) {
        const customDir = path.join(engineMinigameAdapterPath, WECHAT_MINIGAME_WORKER_CUSTOM_PATH);
        const src = getProjectCustomWorkerSrcPath();
        // 是否启用 Worker
        if (result.CC_CUSTOM_WORKER) {
            if (fs.existsSync(src)) {
                fs.rmSync(customDir, { force: true, recursive: true });
                copyFolder(src, customDir);
                fs.writeFileSync(path.join(customDir, "ipc-worker.js"), "module.exports = require('../ipc-worker.js');");
                Editor.success(t('refresh_thread_custom_success'));
            } else {
                fs.rmSync(customDir, { force: true, recursive: true });
                Editor.error(t('thread_custom_not_exists_1') + Editor.T('i18n:MAIN_MENU.package.title') + "-" + t('COCOS_CREATE_EXTENSION') + "-" + t('thread_create_custom_thread_menu') + t('thread_custom_not_exists_2'));
            }
        } else {
            fs.rmSync(customDir, { force: true, recursive: true });
        }
    }
}

function createThreadTemplate() {
    const version = getMinigameAdapterVersion();
    const src = getTemplatePath(version, "worker");
    const dest = getProjectCustomWorkerPath();
    if (fs.existsSync(dest)) {
        // 写入 creator-worker.d.ts
        const workerDtsPath = path.join(getTemplatePath(version, "worker"), "creator-worker.d.ts");
        const projectWorkerDtsPath = getProjectWorkerDtsPath();
        if (exist(workerDtsPath) && exist(projectWorkerDtsPath)) {
            fs.writeFileSync(projectWorkerDtsPath, fs.readFileSync(workerDtsPath));
        }
        Editor.success(t('create_thread_custom_already_exists'));
    } else {
        copyFolder(src, dest);
        Editor.success(t('create_thread_custom_success'));
    }
}

module.exports = {

    async load() {
        // 这里场景未准备就绪，无法获取 engineVersion
    },

    messages: {

        openSettings() {
            Editor.Panel.open('enhance-kit');
        },

        getSettings(event) {
            const result = getSettings();
            event.reply(null, result);
        },

        setSettings(event, macro, value) {
            setSettings(macro, value);
            event.reply(null);
        },

        createThreadTemplate() {
            createThreadTemplate();
            refreshCustomThreadCode();
        },

        refreshCustomThreadCode() {
            refreshCustomThreadCode();
        },

        "scene:ready"(event) {
            Editor.Scene.callSceneScript('enhance-kit', 'scene-get-engine-version', function (err, version) {
                if (version) {
                    engineVersion = version;
                    checkAndModifyWorkerFiles();
                    refreshCustomThreadCode();
                }
            });
        },
    },

};
