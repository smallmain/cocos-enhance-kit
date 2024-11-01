'use strict';
const fs = require('fs');
const path = require('path');

/**
 * 环境信息
 */
let engineEditorPath = path.dirname(path.dirname(Editor.frameworkPath));

const engineMinigameAdapterPath = path.join(engineEditorPath, "builtin", "adapters");
const engineWechatMinigameWorkerMainMacroPath = path.join(engineEditorPath, "builtin", "adapters", "platforms/wechat/worker/macro.js");
const engineWechatMinigameWorkerSubMacroPath = path.join(engineEditorPath, "builtin", "adapters", "platforms/wechat/res/workers/macro.js");

const WECHAT_MINIGAME_WORKER_SUB_PATH = "platforms/wechat/res/workers";
const WECHAT_MINIGAME_CONFIG_PATH = "platforms/wechat/res/game.json";

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
        if (result.CC_WORKER_ASSET_PIPELINE || result.CC_WORKER_AUDIO_SYSTEM) {
            // 没有 Worker 目录与配置的话提醒用户重新安装
            if (!(gameJson.workers && fs.existsSync(workerDir))) {
                Editor.error(t('thread_not_right_workers_dir'));
            }
        } else {
            Editor.warn(t('thread_need_delete_files'));
        }
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

        "scene:ready"(event) {
            checkAndModifyWorkerFiles();
        },

    },

};