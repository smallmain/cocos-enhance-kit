---
sidebar_position: 6
---

# 卸载

:::tip 提示

卸载的原理相同，手动安装后不一定必须手动卸载，也可以使用付费扩展进行卸载，反之亦然。

:::

## 卸载前检查

- 检查项目代码不再依赖社区版提供的特性。
- 检查项目没有对社区版扩展内提供的内置资源的引用。

## 一键卸载

以下内容仅针对付费引擎扩展编写，可查看 [一键安装](./installation/installation-auto.md) 了解详情。

依次点击编辑器菜单栏 **扩展 - 社区版管理 - 卸载社区版** 即可。

![plugin-uninstall](./assets/plugin-uninstall.png)

之后重启即可生效。

---
## 手动卸载

依次点击编辑器菜单 **项目 - 项目设置 - 自定义引擎**，勾选使用内置引擎。

点击 Cocos Creator 主界面右上角的 **编辑器** 按钮，进入到编辑器的资源目录。

使用引擎原版的 `jsb-adapter` 替换 `Resources/builtin/jsb-adapter`。

使用引擎原版的 `adapters` 替换 `Resources/builtin/adapters`。

删除项目内安装的社区版扩展和 `creator-sp.d.ts` 文件。

重启编辑器生效。
