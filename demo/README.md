# Cocos Service Pack Demo

这是对服务包所有特性做展示的 Cocos Creator 演示项目。

## 如何运行

1. 将项目克隆下来之后，根据文档中的 [安装指南](https://smallmain.github.io/cocos-service-pack/docs/installation-guide/installation-intro) 安装服务包。

2. 重启编辑器后运行项目的 `main.fire` 场景。

// 注意：序列帧动画的性能下降（具体多少待测试）
// 注意：使用多纹理材质并且使用 Spine 缓存模式时，useTint 会强制关闭。

// 之后：
// Char 模式只能复用完全相同宽高的 Char，试一下加一个开关，能先用空纹理写一遍，覆盖掉旧的避免 bleed 问题
// 查找所有 TODO
// 插件适配两个版本：最新版与 2.4.6 版本
// 适配原生平台
// 新增静态合批：在一个节点树的根节点挂上一个组件，该组件会快照这个节点树并显示为一张图片，然后只接管渲染，不影响其它逻辑
