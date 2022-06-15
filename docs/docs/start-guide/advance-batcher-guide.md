---
sidebar_position: 2
description: "极致地减少游戏 Draw Call。"
---

# 进阶合批指南

TODO

动态图集与字符图集使用这个管理器来实现多纹理合批，使用的全局实例可以通过 `cc.sp.multiBatcher` 访问。

如果你的资源规划地非常细致，项目本身有已经打好的大图集，那么你就可以考虑
