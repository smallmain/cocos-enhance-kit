## 项目结构

- `master` 分支存放项目文档、演示项目的源码和其它文件。
- `v1.0.0-v2.4.9` 类似这种格式的分支存放引擎源码与类型提示文件。
  
## 目录结构

在源码分支下：

-  `engine` JavaScript 引擎
-  `jsb-adapter` 原生平台 JSB 适配器
-  `cocos2d-x` C++ 原生平台引擎
-  `creator-sp.d.ts` 引擎 TypeScript 类型提示

在 `master` 分支下：

- `src` 只留一份指向源码分支的说明文档
- `extension` 引擎扩展
- `docs` 存放着文档网站源码，使用 Docusaurus 开发。
- `demo` 存放着 Cocos Creator 演示项目源码。

## 发布新版本

### 更新版本号

1. 修改 `engine`、`jsb-adapter`、`cocos2d-x` 根目录的 `VERSION.md` 文件。
2. 修改 `sp.js` 的 `version` 属性。
3. 修改 `extension` 的 `package.json` 文件中的 `version` 属性。
4. 修改文档中相关的版本号。

### 更新 DEMO

1.编译 `web-mobile` 和 `web-desktop` 项目。
2.将这两个项目目录放在名称是当前版本号的目录中，然后放在 `docs/static/demo` 中。
3.修改文档中相关的演示项目路径。

### 准备压缩包

1.将对 engine 的改动整合到 Git Patch，然后将 Patch 按相应的引擎目录放置在 `patches` 目录并放在压缩包根目录内。
2.编译 JavaScript 引擎和原生模拟器，再将三个引擎目录放到压缩包根目录内，包括类型提示文件。
3.将 `enhance-kit-support` 目录放在压缩包根目录内。
4.更新文档的更新日志。

### 发布压缩包

1.上传压缩包到 Github 的 Release，修改文档内所有下载地址。
2.将文档分出当前版本，并发布新版本文档。

### 同步到 Gitee

1.同步仓库
2.同步 Gitee Pages

## 版本计划

- 原生平台上支持 Spine 与其它组件合批
- tiledMap 生成的 Label 好像不能使用 CacheMode，然后考虑对其进行一些优化
- 动态图集支持预乘纹理
- 补充原理文档
- Char 模式因为 bleed 问题只能复用完全相同宽高的区域，试着增加一个选项，能够先用空纹理覆盖，之所以做选项是不知道性能消耗大不大
- 新增静态合批：在一个节点树的根节点挂上一个组件，该组件会快照这个节点树并显示为一张图片，然后只接管渲染，不影响其它逻辑，也可以选择直接删除掉被快照的所有节点
