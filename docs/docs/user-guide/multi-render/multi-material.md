---
sidebar_position: 1
description: "了解实现多纹理渲染的基础。"
---

# 多纹理材质

## 创建多纹理材质

你可以正常创建一个材质文件，Effect 选择内置的多纹理 Effect 着色器 `multi-2d-sprite` 即可。

![material-settings](./assets/material-settings.png)

可以看到上面有 `texture` - `texture8` 一共 8 个纹理插槽，将需要使用的纹理拖到上面的插槽即可完成多纹理材质的配置。

## 在组件中使用多纹理材质

直接拖到组件的 `Materials` 属性上即可。

![material-comp](./assets/material-comp.png)

注意上图中已经在 `cc.Sprite` 组件拖入了刚刚创建的多纹理材质，并且其 `SpriteFrame` 属性设置的是材质中 `texture3` 插槽中的纹理。

![material-final](./assets/material-final.png)

你不需要指定组件要使用的纹理插槽 id，组件内部在渲染前会自动查找纹理在材质中的 id。

:::caution 警告

如果组件使用的纹理在材质中找不到，为了保证渲染的正常（毕竟性能只是锦上添花）会在组件的材质变体中将纹理设置到 `texture` 插槽中。

这会导致这个组件的多纹理材质变体之后都不能按预期进行合批，就像 “退化” 成了普通材质。

所以使用时必须要确保纹理在材质中，假如材质变体已经 “退化” 了，那你可以通过重新设置材质的方式使组件持有一个新的材质变体。

:::

## 自定义多纹理材质

上面介绍的多纹理材质都是使用的内置的多纹理 Effect 着色器，**如果你也创建了一个拥有多个纹理插槽的 Effect 着色器，直接使用并不会被直接识别为多纹理材质。**



## MultiHandler

这个是服务包新增的一个工具类，其主要用处是便捷、高性能地管理多纹理材质上面的所有纹理。

虽然你可以直接通过 `cc.Material` 上的接口来设置纹理插槽，但是出于性能考虑，**多纹理材质必须使用该类实例来进行纹理增删改的相关操作，否则可能导致不能正确渲染。**

它有以下接口：

### `setTexture(index: number, texture: cc.Texture2D): void`

设置纹理插槽上的纹理，


当我们说 “多纹理材质” 时，指的是持有 `cc.sp.MultiHandler` 实例的材质。

并且使用内置多纹理 Effect 着色器的材质会自动持有一个 `cc.sp.MultiHandler` 实例。

也就是说**使用自行创建的有多个纹理插槽着色器的材质不会被直接识别为多纹理材质。**

:::tip


##
