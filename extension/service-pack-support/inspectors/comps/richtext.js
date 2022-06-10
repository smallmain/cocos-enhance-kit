"use strict";
Vue.component("cc-richtext", {
    template: `
    <ui-prop
      v-prop="target.string"
      :multi-values="multi"
    ></ui-prop>
    <ui-prop
      v-prop="target.horizontalAlign"
      :multi-values="multi"
    ></ui-prop>
    <ui-prop
      v-prop="target.fontSize">
      :multi-values="multi"
    </ui-prop>
    <ui-prop
      v-prop="target.font"
      :multi-values="multi"
    ></ui-prop>
    <ui-prop
      v-prop="target.fontFamily"
      v-show="_isSystemFont()"
      :multi-values="multi"
    ></ui-prop>
    <ui-prop
      v-prop="target.useSystemFont"
      :multi-values="multi"
    ></ui-prop>
    <ui-prop
      v-prop="target.cacheMode"
      :multi-values="multi"
    ></ui-prop>
    <ui-prop
      v-prop="target.maxWidth"
      :multi-values="multi"
    ></ui-prop>
    <ui-prop
      v-prop="target.lineHeight"
      :multi-values="multi"
    ></ui-prop>
    <ui-prop
      v-prop="target.imageAtlas"
      :multi-values="multi"
    ></ui-prop>
    <ui-prop
      v-prop="target.handleTouchEvent"
      :multi-values="multi"
    ></ui-prop>

    <ui-prop v-prop="target.customMaterial"></ui-prop>
    <ui-prop v-prop="target.autoSwitchMaterial"></ui-prop>
    <ui-prop v-prop="target.allowDynamicAtlas"></ui-prop>
    <ui-prop v-prop="target.enableRetina"></ui-prop>
    `,
    props: {
        target: {
            twoWay: !0,
            type: Object
        },
        multi: {
            type: Boolean
        }
    },
    methods: {
        T: Editor.T,
        _isSystemFont() {
            return this.target.useSystemFont.value
        }
    }
});
