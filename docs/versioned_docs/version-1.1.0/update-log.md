---
sidebar_position: 7
---

# 更新日志

---
## Enhance Kit v1.1.0

适配 Cocos Creator v2.4.9 版本，[点此下载压缩包](https://github.com/smallmain/cocos-enhance-kit/releases/tag/v1.1.0)

- **[新特性] 动态合图在符合条件的情况下会忽略 padding 将纹理加入动态图集**
- [修复] 修复动态图集 maxFrameSize 能设置为超出图集尺寸大小的问题
- [修复] 修复 Spine 动态合图时未判断 attachment 是否存在 region 对象导致报错的问题
- [修复] 修复 Android 平台打包出现 Implicit instantiation of undefined template 错误

---
## Enhance Kit v1.0.0

适配 Cocos Creator v2.4.9 版本，[点此下载压缩包](https://github.com/smallmain/cocos-enhance-kit/releases/tag/v1.0.0)

- **[新特性] 支持多纹理渲染**
- **[新特性] 重构动态图集，支持多个新特性**
- **[新特性] 重构 cc.Label 的 Char 缓存模式，支持多个新特性**
- **[新特性] 支持高 DPI 文本渲染**
- **[新特性] Spine 组件支持参与动态图集、与其它组件合批、使用 SpriteFrame 换装**
- [新特性] cc.Label、cc.RichText、cc.Sprite、cc.MotionStreak、Spine 组件支持使用多纹理材质，并支持自动切换材质机制
- [新特性] cc.RichText 支持使用自定义材质
- [修复] 直接修改 Effect 的属性不回导致其变体的 hash 值刷新
- [修复] CHAR 缓存模式 hash 计算可能会有重复的问题
- [调整] 默认禁用 Label 原生 TTF 渲染器

