Editor.Panel.extend({
    style: `
    :host { margin: 5px; }
    h1 { margin-left: 15px; }
    .desc { color: gray; margin-left: 15px; margin-right: 15px; }
    .subdesc { color: gray; }
    .sub { margin-left: 30px; margin-right: 30px;  }
    .hidden { display: none; }
  `,

    template: `
    <div id="unripe">
        <p id="unripe_tip" class="desc">加载中...</p>
    </div>
    <div id="ready" class="hidden">
        <h1>多线程支持</h1>
        <p class="desc">该特性仅在微信小游戏平台下有效。</p>
        <hr />
        <div class="sub">
            <p class="subdesc">请注意，以下为全局设置，改动会影响到所有项目，并且在重新安装、升级或卸载社区版后丢失所有设置。</p>
            <ui-prop id="td" tabindex="-1" name="调试模式" tooltip="启用后将会输出详细日志以便进行调试，这可能会大幅降低性能。">
                <ui-checkbox id="tdc" tabindex="-1"></ui-checkbox>
            </ui-prop>
            <ui-prop id="tap" tabindex="-1" name="多线程驱动资源管线" tooltip="启用后将资源管线移至线程中执行，减少由资源下载、缓存与加载导致的卡顿。">
                <ui-checkbox id="tapc" tabindex="-1"></ui-checkbox>
            </ui-prop>
            <ui-prop id="fs" tabindex="-1" name="多线程驱动音频系统" tooltip="启用后将音频耗时操作移至线程中执行，减少由音频 API 调用导致的卡顿。">
                <ui-checkbox id="fsc" tabindex="-1"></ui-checkbox>
            </ui-prop>
            <ui-prop id="ts" tabindex="-1" name="线程通信调度器" tooltip="启用后将会对多次数据通信打包发送，这可能会减少因通信次数带来的性能消耗。">
                        <ui-checkbox id="tsc" tabindex="-1"></ui-checkbox>
            </ui-prop>
        </div>
    </div>
  `,

    $: {
        unripe_area: '#unripe',
        unripe_tip: '#unripe_tip',
        ready_area: '#ready',
        thread_debug: '#td',
        thread_debug_checkbox: '#tdc',
        thread_asset_pipeline: '#tap',
        thread_asset_pipeline_checkbox: '#tapc',
        thread_audio_system: '#fs',
        thread_audio_system_checkbox: '#fsc',
        thread_scheduler: '#ts',
        thread_scheduler_checkbox: '#tsc',
    },

    ready() {
        Editor.Ipc.sendToMain('enhance-kit:getSettings', (error, data) => {
            if (error) {
                this.$unripe_tip.textContent = '发生错误：' + String(error);
                this.$unripe_tip.style.color = 'red';
                return;
            }

            if (data.code === 0) {
                this.$unripe_area.classList.add('hidden');
                this.$ready_area.classList.remove('hidden');

                this.$thread_debug_checkbox.checked = data.CC_WORKER_DEBUG;
                this.$thread_asset_pipeline_checkbox.checked = data.CC_WORKER_ASSET_PIPELINE;
                this.$thread_audio_system_checkbox.checked = data.CC_WORKER_AUDIO_SYSTEM;
                this.$thread_scheduler_checkbox.checked = data.CC_WORKER_SCHEDULER;

                this.$thread_debug_checkbox.addEventListener('change', () => {
                    this.setSettings("CC_WORKER_DEBUG", this.$thread_debug_checkbox.checked);
                });

                this.$thread_asset_pipeline_checkbox.addEventListener('change', () => {
                    this.setSettings("CC_WORKER_ASSET_PIPELINE", this.$thread_asset_pipeline_checkbox.checked);
                });

                this.$thread_audio_system_checkbox.addEventListener('change', () => {
                    this.setSettings("CC_WORKER_AUDIO_SYSTEM", this.$thread_audio_system_checkbox.checked);
                });

                this.$thread_scheduler_checkbox.addEventListener('change', () => {
                    this.setSettings("CC_WORKER_SCHEDULER", this.$thread_scheduler_checkbox.checked);
                });
            } else {
                this.$unripe_tip.textContent = data.errMsg;
                this.$unripe_tip.style.color = 'red';
            }
        }, 5000);
    },

    async setSettings(macro, value) {
        return new Promise((resolve, reject) => {
            Editor.Ipc.sendToMain('enhance-kit:setSettings', macro, value, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            }, 3000);
        });
    },
});
