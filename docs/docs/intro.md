---
sidebar_position: 1
title: 介绍
hide_title: true
---

![logo](/img/logo2.png)

这是一个提供 Cocos Creator 引擎特性增强、修复与优化的**开源非官方服务包**。

该项目使用自定义引擎的方式在符合原始引擎架构设计的基础上为 Cocos Creator 引擎加入新的特性、修复已知问题以及性能优化。

正因为如此，服务包中的大部分特性能像升级引擎版本一样无需改动项目代码即可生效。

:::info 项目的起源

2021 年 2 月，Cocos 发布 Cocos Creator 3.0，之后不会再开发 2.x 版本的新特性，但 2.x 在一些方面还并不完善，所以这个非官方的引擎“魔改”合集应运而生。

给项目取名的时候想到相似的事情发生在 2014 年 4 月，官方停止了对 Windows XP 的维护，之后 Harkaz 发布了一个非官方服务包 Service Pack 4 (SP4)。

受到这个命名的启发，遂项目取名为 Service Pack。

:::

## 重要特性

- **支持多纹理渲染**（多纹理材质、多纹理合批）
  ![demo1](/demo-imgs/demo1.png)
  
- **支持高 DPI 文本渲染**（Label、RichText 组件）
  ![demo4](/demo-imgs/demo4.png)

- **重构动态合图**（支持自动多纹理合批、优化算法、复用废弃空间等特性）
  ![demo2](/demo-imgs/demo2.png)

- **重构 Label 组件的 CHAR 缓存模式**（支持自动多纹理合批、多图集、复用废弃空间等特性）
  ![demo3](/demo-imgs/demo3.png)

- **Spine 组件支持与其它组件合批、合入动态图集与 SpriteFrame 换装**
  ![demo5](/demo-imgs/demo5.png)

## 功能演示

[Web Desktop 演示项目](https://smallmain.gitee.io/cocos-service-pack/demo/v1.0.0/web-desktop/index.html)

[Web Mobile 演示项目](https://smallmain.gitee.io/cocos-service-pack/demo/v1.0.0/web-mobile/index.html)（请将设备横屏）

:::note 提示

服务包对引擎的改动完全开源，每个改动会带有原理说明文档，当你发现问题时请与我们进行反馈，如果你有兴致，可以默默帅气地提交一个 PR，帮助我们一起完善这个项目。

:::

## 使用方法

请阅读文档的 [安装指南](./installation-guide/installation-intro.mdx) 与 [入门教程](./start-guide/start-guide-intro.mdx)。

## 更新日志

### Service Pack v1.0.0

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

[点此](https://smallmain.gitee.io/cocos-service-pack/docs/update-log) 查看所有的更新日志。

## 贡献指南

非常欢迎你能和我们一起来完善这个项目，请通过 Github 进行：

- 如果你发现了问题请建立 `Issues`
- 如果你有好的想法，请进入 `Discussions`
- 如果你有新的代码提交，请建立 `Pull requests`

**原则上你提交的任何修改都不能影响引擎原有功能，不允许删除引擎原有的特性，请认真思考代码设计。**

## 常见问题

### 为什么要直接修改引擎？

直接修改引擎可能是大部分人认为的下下策，比如我们常听到的：

- 可以通过 “修改对象原型” 等编程技巧将改动做成一个插件脚本
- 没接触过自定义引擎，不知道该如何使用
- 已经修改过引擎了，不能直接进行标准安装，会覆盖原有的修改

以上问题我们都思考过，首先，现在引擎的 2.x 版本已经停止了更新（仅做一些维护工作），也就是说修改引擎不会遇到在官方新版本发布后需要用大量时间去适配的情况。

其次，即使服务包的所有改动都能做成一个插件脚本，但无法兼容原生平台，并且一般都需要大量拷贝代码，包体会增大，可维护性会大幅降低。

最后，我们希望它接近 “原生” 的使用体验，就像引擎本来就有的功能一样，对于没有接触过自定义引擎的人，可以通过引擎扩展一键安装。

对于已经修改过引擎的人，由于服务包提供的是 Git Patch，所以可以让你在原有的基础上轻松应用服务包的改动，你甚至可以只选取你想要的特性进行应用。

### 启动 Cocos Creator 报 Error: Can not parse this input:undefined 错误

这是你可能忘记安装配套的引擎扩展，所以没有找到服务包的内置资源导致的报错。
