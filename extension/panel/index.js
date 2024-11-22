function t(str) {
    return Editor.T('enhance-kit.' + str);
}

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
        <p id="unripe_tip" class="desc">${t('loading')}</p>
    </div>
    <div id="ready" class="hidden">
        <h1>${t('thread_title')}</h1>
        <p class="desc">${t('thread_desc')}</p>
        <hr />
        <div class="sub">
            <p class="subdesc">${t('thread_desc2')}</p>
            <ui-prop id="td" tabindex="-1" name="${t('thread_debug')}" tooltip="${t('thread_debug_desc')}">
                <ui-checkbox id="tdc" tabindex="-1"></ui-checkbox>
            </ui-prop>
                        <ui-prop id="tap" tabindex="-1" name="${t('thread_asset_pipeline')}" tooltip="${t('thread_asset_pipeline_desc')}">
                <ui-checkbox id="tapc" tabindex="-1"></ui-checkbox>
            </ui-prop>
            <ui-prop id="fs" tabindex="-1" name="${t('thread_audio_system')}" tooltip="${t('thread_audio_system_desc')}" foldable>
                <ui-checkbox id="fsc" tabindex="-1"></ui-checkbox>
                <div slot="child">
                    <ui-prop id="fsi" tabindex="-1" name="${t('thread_audio_sync')}" tooltip="${t('thread_audio_sync_desc')}" indent="1">
                        <ui-num-input type="int" min="0" value="-1" id="fsii" tabindex="0"></ui-num-input>
                    </ui-prop>
                </div>
            </ui-prop>
            <ui-prop id="th" tabindex="-1" name="${t('thread_http')}" tooltip="${t('thread_http_desc')}">
                <ui-checkbox id="thc" tabindex="-1"></ui-checkbox>
            </ui-prop>
            <ui-prop id="tw" tabindex="-1" name="${t('thread_ws')}" tooltip="${t('thread_ws_desc')}">
                <ui-checkbox id="twc" tabindex="-1"></ui-checkbox>
            </ui-prop>
            <ui-prop id="tc" tabindex="-1" name="${t('thread_custom')}" tooltip="${t('thread_custom_desc')}">
                <ui-checkbox id="tcc" tabindex="-1"></ui-checkbox>
            </ui-prop>
            <ui-prop id="ts" tabindex="-1" name="${t('thread_scheduler')}" tooltip="${t('thread_scheduler_desc')}">
                <ui-checkbox id="tsc" tabindex="-1"></ui-checkbox>
            </ui-prop>
            <ui-prop id="tsp" tabindex="-1" name="${t('thread_subpackage')}" tooltip="${t('thread_subpackage_desc')}">
                <ui-checkbox id="tspc" tabindex="-1"></ui-checkbox>
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
        thread_custom: '#tc',
        thread_custom_checkbox: '#tcc',
        thread_http: '#th',
        thread_http_checkbox: '#thc',
        thread_ws: '#tw',
        thread_ws_checkbox: '#twc',
        thread_audio_system: '#fs',
        thread_audio_system_checkbox: '#fsc',
        thread_audio_system_interval: '#fsi',
        thread_audio_system_interval_input: '#fsii',
        thread_scheduler: '#ts',
        thread_scheduler_checkbox: '#tsc',
        thread_subpackage: '#tsp',
        thread_subpackage_checkbox: '#tspc',
    },

    ready() {
        Editor.Ipc.sendToMain('enhance-kit:getSettings', (error, data) => {
            if (error) {
                this.$unripe_tip.textContent = 'Error:' + String(error);
                this.$unripe_tip.style.color = 'red';
                return;
            }

            if (data.code === 0) {
                this.$unripe_area.classList.add('hidden');
                this.$ready_area.classList.remove('hidden');

                this.$thread_debug_checkbox.checked = data.CC_WORKER_DEBUG;
                this.$thread_custom_checkbox.checked = data.CC_CUSTOM_WORKER;
                this.$thread_asset_pipeline_checkbox.checked = data.CC_WORKER_ASSET_PIPELINE;
                this.$thread_audio_system_checkbox.checked = data.CC_WORKER_AUDIO_SYSTEM;
                this.$thread_audio_system_interval_input.value = data.CC_WORKER_AUDIO_SYSTEM_SYNC_INTERVAL;
                this.$thread_http_checkbox.checked = data.CC_WORKER_HTTP_REQUEST;
                this.$thread_ws_checkbox.checked = data.CC_WORKER_WEBSOCKET;
                this.$thread_subpackage_checkbox.checked = data.CC_WORKER_SUB_PACKAGE;
                this.$thread_scheduler_checkbox.checked = data.CC_WORKER_SCHEDULER;

                this.$thread_debug_checkbox.addEventListener('change', () => {
                    this.setSettings("CC_WORKER_DEBUG", this.$thread_debug_checkbox.checked);
                });

                this.$thread_asset_pipeline_checkbox.addEventListener('change', () => {
                    this.setSettings("CC_WORKER_ASSET_PIPELINE", this.$thread_asset_pipeline_checkbox.checked);
                });

                this.$thread_custom_checkbox.addEventListener('change', () => {
                    this.setSettings("CC_CUSTOM_WORKER", this.$thread_custom_checkbox.checked);
                });

                this.$thread_http_checkbox.addEventListener('change', () => {
                    this.setSettings("CC_WORKER_HTTP_REQUEST", this.$thread_http_checkbox.checked);
                });

                this.$thread_ws_checkbox.addEventListener('change', () => {
                    this.setSettings("CC_WORKER_WEBSOCKET", this.$thread_ws_checkbox.checked);
                });

                this.$thread_subpackage_checkbox.addEventListener('change', () => {
                    this.setSettings("CC_WORKER_SUB_PACKAGE", this.$thread_subpackage_checkbox.checked);
                });

                const onAudioSystemEnableChange = (enabled) => {
                    this.$thread_audio_system_interval_input.disabled = !enabled;
                };
                onAudioSystemEnableChange(this.$thread_asset_pipeline_checkbox.checked);

                this.$thread_audio_system_checkbox.addEventListener('change', () => {
                    const enabled = this.$thread_audio_system_checkbox.checked;
                    onAudioSystemEnableChange(enabled);
                    this.setSettings("CC_WORKER_AUDIO_SYSTEM", enabled);
                });

                this.$thread_audio_system_interval_input.addEventListener('confirm', () => {
                    this.setSettings("CC_WORKER_AUDIO_SYSTEM_SYNC_INTERVAL", this.$thread_audio_system_interval_input.value);
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
