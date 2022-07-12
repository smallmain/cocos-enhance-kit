"use strict";
Vue.component("cc-sprite", {
    dependencies: ["packages://inspector/share/blend.js"],
    template: `
    <ui-prop
      style="padding-top: 8px"
      name="Atlas"
      tooltip="{{T('COMPONENT.sprite.atlas')}}"
    >
      <ui-asset class="flex-1"
        type="sprite-atlas"
        v-value="target._atlas.value.uuid"
        v-values="atlasUuids"
        :multi-values="atlasMulti"
      ></ui-asset>
      <ui-button
        class="blue tiny"
        tooltip="{{T('COMPONENT.sprite.select_tooltip')}}"
        @confirm="selectAtlas"
      >
        {{T('COMPONENT.sprite.select_button')}}
      </ui-button>
    </ui-prop>

    <ui-prop
      style="padding-top: 8px"
      name="Sprite Frame"
      tooltip="{{T('COMPONENT.sprite.sprite_frame')}}"
    >
      <ui-asset class="flex-1"
        type="sprite-frame"
        v-value="target.spriteFrame.value.uuid"
        v-values="spriteUuids"
        :multi-values="spriteMulti"
      ></ui-asset>
      <ui-button
        class="blue tiny"
        tooltip="{{T('COMPONENT.sprite.edit_tooltip')}}"
        @confirm="editSprite"
      >
        {{T('COMPONENT.sprite.edit_button')}}
      </ui-button>
    </ui-prop>

    <ui-prop 
      v-prop="target.type"
      :multi-values="multi"
    ></ui-prop>

    <div v-if="isFilledType()">
      <ui-prop indent=1 
        v-prop="target.fillType"
        :multi-values="multi"
      ></ui-prop>
      <ui-prop indent=1 
        v-prop="target.fillCenter"
        v-disabled="!isRadialFilled()"
        :multi-values="multi"
      ></ui-prop>
      <ui-prop indent=1 
        v-prop="target.fillStart"  
        :multi-values="multi"
      ></ui-prop>
      <ui-prop indent=1
        v-prop="target.fillRange"
        :multi-values="multi"
      ></ui-prop>
    </div>

    <ui-prop
      v-prop="target.sizeMode"
      :multi-values="multi"
    ></ui-prop>
    <ui-prop v-if="allowTrim()"
      v-prop="target.trim"
      :multi-values="multi"
    ></ui-prop>

    <cc-blend-section :target.sync="target"></cc-blend-section>
    <cc-array-prop :target.sync="target.materials"></cc-array-prop>

    <ui-prop v-prop="target.autoSwitchMaterial"></ui-prop>
    <ui-prop v-prop="target.allowDynamicAtlas"></ui-prop>
    `,
    props: {
        target: {
            twoWay: !0,
            type: Object
        },
        multi: {
            twoWay: !0,
            type: Boolean
        }
    },
    data: ()=>({
        atlasUuid: "",
        atlasUuids: "",
        atlasMulti: !1,
        spriteUuid: "",
        spriteUuids: "",
        spriteMulti: !1
    }),
    created() {
        this.target && (this._updateAtlas(),
        this._updateSprite())
    },
    watch: {
        target() {
            this._updateAtlas(),
            this._updateSprite()
        }
    },
    methods: {
        T: Editor.T,
        selectAtlas() {
            Editor.Ipc.sendToPanel("assets", "change-filter", "t:sprite-atlas")
        },
        editSprite() {
            Editor.Panel.open("sprite-editor", {
                uuid: this.target.spriteFrame.value.uuid
            })
        },
        allowTrim() {
            return this.target.type.value === cc.Sprite.Type.SIMPLE
        },
        isFilledType() {
            return this.target.type.value === cc.Sprite.Type.FILLED
        },
        isRadialFilled() {
            return this.target.fillType.value === cc.Sprite.FillType.RADIAL
        },
        _updateAtlas() {
            if (!this.target)
                return this.atlasUuid = "",
                this.atlasUuids = "",
                this.atlasMulti = !1,
                void 0;
            this.atlasUuid = this.target._atlas.value.uuid,
            this.atlasUuids = this.target._atlas.values.map(t=>t.uuid);
            var t = this.atlasUuids[0];
            this.atlasMulti = !this.atlasUuids.every((i,e)=>0 === e || i === t)
        },
        _updateSprite() {
            if (!this.target)
                return this.spriteUuid = "",
                this.spriteUuids = "",
                this.spriteMulti = !1,
                void 0;
            this.spriteUuid = this.target.spriteFrame.value.uuid,
            this.spriteUuids = this.target.spriteFrame.values.map(t=>t.uuid);
            var t = this.spriteUuids[0];
            this.spriteMulti = !this.spriteUuids.every((i,e)=>0 === e || i === t)
        }
    }
});
