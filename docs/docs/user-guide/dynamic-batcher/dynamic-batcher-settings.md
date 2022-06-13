---
sidebar_position: 1
description: "更细致地控制动态合图的使用。"
---

# 新的合图设置

## 全局设置

### 是否参与动态合图

`cc.sp.allowDynamicAtlas`

控制所有组件默认情况下是否会参与动态合图，默认为开启状态。

### 自动多纹理合批

`cc.dynamicAtlasManager.autoMultiBatch`

控制图集纹理是否会自动添加到多纹理合批管理器，默认为开启状态，如果关闭也就**失去了自动进行多个图集纹理合批的特性**（当然关闭后你依然可以手动添加）。

### 在场景切换时清空所有图集

`cc.dynamicAtlasManager.autoResetBeforeSceneLoad`

控制在场景切换时是否会清空所有的动态图集，默认为开启状态。

:::tip 提示

在引擎原来的设计中，该机制不可被关闭，由于旧动态合图不支持复用废弃的空间，图集终究会被用完，所以引擎加入了这个治标不治本的功能。

但现在，我们认为该机制可以关闭，你只需要管理好纹理资源的释放即可，纹理资源释放的同时会释放使用的动态图集空间。

:::

## 组件的单独设置

### 是否参与动态合图

`cc.Component.allowDynamicAtlas`

控制该组件是否会参与动态合图，类型是 `cc.RenderComponent.EnableType` 枚举，默认为 `GLOBAL`。

:::tip cc.RenderComponent.EnableType

- `GLOBAL` 使用全局设置
- `ENABLE` 开启
- `DISABLE` 关闭

:::
