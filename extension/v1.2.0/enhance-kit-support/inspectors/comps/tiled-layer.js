"use strict";
Vue.component("cc-tiled-layer", {
  dependencies: ["packages://inspector/share/blend.js"],
  template: '\n <ui-prop\n      v-prop="target.cullingLayer"\n      :multi-values="multi"\n    ></ui-prop>  <cc-array-prop :target.sync="target.materials"></cc-array-prop>\n\n  ',
  props: {
    target: {
      twoWay: !0,
      type: Object
    },
    multi: {
      twoWay: !0,
      type: Boolean
    }
  }
});
