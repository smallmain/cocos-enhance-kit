---
sidebar_position: 2
description: "了解如何手动进行多纹理合批。"
---

# 多纹理合批

在 [新 UI 渲染批次合并指南](../../start-guide/batcher-guide#充分利用动态合图) 中提到了动态合图与多纹理渲染结合后，能让多张图集纹理在同一批次渲染。

如果你阅读过 [多纹理材质](./multi-material) 文档的话，肯定知道能使用 `MultiHandler` 的接口来动态设置材质的纹理插槽来实现。

但是这种完全手动的方式实现起来比较麻烦，比如你需要使用一个纹理时，还得找到该纹理所在的材质并设置到渲染组件上。

为了能更方便地进行多纹理合批，服务包封装了一个自动切换多纹理材质的机制与多纹理合批管理类 `cc.sp.MultiBatcher`。

动态图集与字符图集使用了一个全局实例，可以通过 `cc.sp.multiBatcher` 访问。

---
## 开关自动切换多纹理材质

要让动态合图自动进行多纹理合批，首先要解决设置材质的问题，当切换成动态图集的纹理时，需要自动将组件的材质设置为有动态图集纹理的材质。

所以我们增加了一个机制，在支持的组件内使用开启了该机制的纹理进行渲染时，会提前切换为该纹理关联的材质（只要支持多纹理渲染就支持自动切换材质）。

这个机制默认是开启的，可以通过全局开关来控制默认值：

```js
cc.sp.autoSwitchMaterial = false;
```

默认情况下组件会使用全局值，你可以控制单个组件是否强制启用/禁用该机制：

![autoswitchsettings](./assets/autoswitch-settings.png)

除了在编辑器调整，也可以通过代码控制：

```js
// cc.RenderComponent.EnableType
// GLOBAL: 全局默认值
// ENABLE: 开启
// DISABLE: 关闭
sprite.autoSwitchMaterial = cc.RenderComponent.EnableType.ENABLE;
```

:::caution 注意

组件有脏检查标记，如果修改全局开关或者修改纹理关联的材质，需要对所有使用该纹理的渲染组件调用 `comp.setVertsDirty()` 重新检查。

:::

:::caution 特别注意

如果 Spine 组件所使用的 `SkeletonData` 同时使用了多个纹理，那么只会遍历数据以找到的第一个纹理为主执行自动切换机制。

:::

---
## 设置纹理的关联材质

:::info

每个纹理只能关联一个材质，如果同一个纹理，不同的渲染组件需要使用不同材质就需要手动设置。

:::

关联材质的接口有两种用法：

```js
const bool = texture.linkMaterial(material);
const bool = texture.linkMaterial(material, index);
```

第一句代码会自动将纹理设置到材质的空插槽中，然后将该材质设置为该纹理的关联材质，如果没有空插槽会返回 `false`。

第二句则是强制将纹理设置到指定的插槽中，并将该材质设置为该纹理的关联材质。

想要解除两者的关联可以使用：

```js
texture.unlinkMaterial();
```

获取关联的材质可以使用：

```js
const material = texture.getLinkedMaterial();
```

---
## 多纹理合批管理器

手动关联材质就意味着你需要手动创建并管理创建的所有材质，如果是大量纹理需要关联材质就会比较麻烦。

所以我们封装了一个小巧的多纹理合批管理器 `cc.sp.MultiBatcher`。

这个管理器有点像动态合图管理器，它会持有一个材质数组，初始化后会使用内置的多纹理 Effect 着色器创建一个材质并放在数组中。

你可以传给管理器一个纹理，它会查找所有材质的空插槽，如果没有材质有空插槽则会创建一个新材质，然后把纹理与材质关联。

### 如何使用

创建管理器并初始化可以使用：

```js
const batcher = new cc.sp.MultiBatcher();
batcher.init();
```

传入纹理可以使用：

```js
const material = batcher.requsetMaterial(texture);
```

会返回关联的材质，如果纹理本来就已经有关联的材质，则会直接返回已关联的材质。

清空内部数组可以使用：

```js
batcher.reset();
```

### 它的用途

在 [进阶合批指南](../../start-guide/advance-batcher-guide) 中有提供一些常见的使用案例。
