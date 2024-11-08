---
sidebar_position: 2
description: "一行代码开启高清文本渲染。"
---
# 高 DPI 支持

可阅读 [提升游戏质量](../../best-practices/quality-guide) 了解基本的使用方法。

## 调整全局开关

使用下面的代码控制所有组件是否默认开启高 DPI 支持：

```js
cc.sp.enableLabelRetina = false;
```

## 调整渲染缩放比例

使用下面的代码调整内部渲染的缩放倍数：

```js
cc.sp.labelRetinaScale = 2;
```

## 控制单个组件开关

![reinasettings](./assets/reina-settings.png)

除了在编辑器调整，也可以通过代码控制：

```js
// cc.RenderComponent.EnableType
// GLOBAL: 全局默认值
// ENABLE: 开启
// DISABLE: 关闭
label.enableRetina = cc.RenderComponent.EnableType.ENABLE;
```
