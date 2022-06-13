---
sidebar_position: 1
description: "了解实现多纹理渲染的基础。"
---

# 多纹理材质

当我们说 “多纹理材质” 时，指的是持有 `cc.sp.MultiHandler` 实例的材质。

并且使用内置多纹理 Effect 着色器的材质会自动持有一个 `cc.sp.MultiHandler` 实例。

也就是说**使用自行创建的有多个纹理插槽着色器的材质不会被直接识别为多纹理材质。**

:::tip


##
