---
sidebar_position: 1
description: "推荐使用此方式进行一键安装。"
---

# 使用引擎扩展安装

---
## 前往 Cocos Store 下载

在 Cocos Store 搜索名为 **Cocos Service Pack** 的引擎扩展，或者 [点此跳转](https://store.cocos.com/app/detail/3824)。

这个扩展不是免费的，**但其唯一的作用就是帮助你管理服务包的版本（查看、安装和卸载服务包）。**

:::tip 常见问题

- **Service Pack 不是开源项目吗？？？**

    Service Pack 是完全开源的项目，这个引擎扩展只会为你提供自动化的安装方式，以后也只会有版本管理方面的功能。
    
    你可以选择 [手动安装](./installation-manual.md)，也只需要几步即可完成。

- **如何反馈有关这个扩展的问题或建议**

    若遇到与这个扩展相关的问题或者建议，不要在服务包的 Github 仓库反馈，请在扩展的 **商店评论区** 进行反馈。

    因为这个扩展的收益是个人的，所以也只由个人维护。

:::

---
## 查询信息

安装好扩展后，可在 Cocos Creator 的菜单栏依次点击 **扩展 - 服务包管理 - 查看信息**，会打印当前环境信息。

![plugin-info](./assets/plugin-info.png)

你可以看到当前引擎版本支持一键安装的服务包版本，已安装的服务包版本等信息。

---
## 一键安装

安装好扩展后，可在 Cocos Creator 的菜单栏依次点击 **扩展 - 服务包管理 - 安装服务包 - 安装最新版本**，会自动开始安装服务包。

![plugin-install](./assets/plugin-install.png)

:::note 扩展做了什么事

扩展帮您自动完成了手动安装时需要做的所有步骤，包括自定义引擎和放置 TypeScript 类型提示文件。

:::

预览项目并检查 Devtools Console 打印的是否为 `Cocos Creator SP v2.4.x`，是的话则已经成功安装。

![installedconsole](./assets/installed-console.png)

接下来推荐你从 [入门教程](../start-guide/start-guide-intro.mdx) 开始了解服务包为你的开发都带来了哪些新特性！

---
## 更多特性

在服务包发布新版本之后，你可能还没做好升级的准备，这时候你可以点击 **扩展 - 服务包管理 - 安装服务包 - 安装其它版本** 安装服务包的历史版本。

该扩展会收录服务包发布过的所有版本。

服务包只会适配引擎的最新版本，如果你需要在其它引擎版本上安装服务包，一般需要手动使用 Git Patch。

之后扩展可能会额外适配更多的引擎版本，这取决于大家具体的需求如何。
