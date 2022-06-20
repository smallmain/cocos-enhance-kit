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
- `patches` 存放着所有引擎改动的 Git Patch。

## 发布新版本

### 更新版本号

1. 修改 `engine`、`jsb-adapter`、`cocos2d-x` 根目录的 `VERSION` 文件。
2. 修改 `sp.js` 的 `version` 属性。
3. 修改 `extension` 的 `package.json` 文件中的 `version` 属性。
4. 修改文档中相关的版本号。

### 准备压缩包

1.将对 engine 的改动整合到 Git Patch，然后将 Patch 按相应的引擎目录放置在仓库的 `patches` 目录中，并放在压缩包根目录内。
2.将引擎按照官方文档进行编译，并放到压缩包根目录内，包括类型提示文件。
3.将 `service-pack-support` 目录放在压缩包根目录内。
4.更新文档的更新日志。

### 发布压缩包

1.上传压缩包到 Github 的 Release，修改文档内所有下载地址。
2.将文档分出当前版本，并发布新版本文档。
