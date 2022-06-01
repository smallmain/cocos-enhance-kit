# 手动安装

:::caution 提示

手动安装需要掌握一定的 [Git](https://git-scm.com/doc) 和 [自定义引擎](https://docs.cocos.com/creator/2.4/manual/zh/advanced-topics/engine-customization.html) 知识，建议使用我们发布的 [引擎扩展](./installation-engine-plugin) 一键安装。

:::

## 引擎要求

请将 Cocos Creator 至少升级到 **v2.4.x** 版本。  
推荐直接升级到最新版本，2.x 版本只会进行维护性更新，所以不用担心其稳定性问题。

## 标准安装

当您项目所使用的引擎版本与服务包适配的引擎版本一致，并且您自己未对引擎有任何改动时，可参照以下步骤安装：

### 1.替换自定义引擎

压缩包内的 `engine` `cocos2d-x` `jsb-adapter` 这三个目录分别就是我们已经修改好的 **JavaScript 引擎**、**Cocos2d-x 引擎** 和 **jsb-adpater**。

参照官方的 [自定义引擎](https://docs.cocos.com/creator/2.4/manual/zh/advanced-topics/engine-customization.html) 文档分别配置或替换这三个部分即可。

:::tip 提示

**官方文档中的一些步骤我们已经帮你做好了**：

**定制 JavaScript 引擎：**参考官方文档的 `1.2 修改 JS 引擎路径` 设置路径即可，无需安装编译依赖或者编译。

**定制 Cocos2d-x 引擎：**

**替换 jsb-adapter：**这一步只需要替换目录即可，但请一定不要忘记！

并且如果您**不需要支持原生平台，可以只配置 JavaScript 引擎**，不需要配置 Cocos2d-x 和 jsb-adapter。
:::

### 2.往项目放入资源

由于我们无法为引擎新增内置资源，所以需要您手动操作这一步，将压缩包内 `project` 目录的 `sp` 目录拷贝到项目的 `assets` 目录中，并设置 `sp` 目录为 **Asset Bundle**。

![assetbundlesettings](assets/assetbundle-settings.png)

:::caution 注意

请勿随意放置，路径必须是 `assets/sp`，在编辑器环境中引擎只能通过路径读取资源。

请勿随意修改 Asset Bundle 的名称，名称必须是 `sp`，在实际运行中会通过加载这个 Asset Bundle 读取资源。

没有必要将这个 Asset Bundle 设为远程包或者 Zip 压缩，里面只是两个 Effect 着色器资源。

:::

### 3.TypeScript 类型提示（可选）

如果您的项目使用 TypeScript，请将压缩包内 `project` 目录的 `creator-sp.d.ts` 拷贝到项目根目录中，更新 API 接口类型提示。

![dts](assets/dts.png)

部分 IDE 可能需要重启才会生效。

## 下载链接

### Service Pack v1.0 

[下载压缩包](http://www.baidu.com)

:::note

**Service Pack v1.0** 适配 **Cocos Creator v2.4.9** 版本，请确认您项目的引擎版本一致。

:::

### 历史版本

[存档页面](test)
