## 分支结构

- `master` 分支存放项目文档、演示项目的源码和其它文件
- `v1.0.0-v2.4.9` 类似这种格式的分支存放引擎源码与类型提示文件
  
## 目录结构

在源码分支下：

- `engine` JavaScript 引擎
- `jsb-adapter` 原生平台 JSB 适配器
- `adapters` 小游戏平台适配器
- `cocos2d-x` C++ 原生平台引擎
- `creator-sp.d.ts` 引擎 TypeScript 类型提示

在 `master` 分支下：

- `src` 只留一份指向源码分支的说明文档
- `extension` 支持性引擎扩展
- `docs` 存放着文档网站源码，使用 Docusaurus 开发
- `demo` 存放着 Cocos Creator 演示项目源码
- `scripts` 工具脚本
- `media` 媒体素材

## 开发流程

### 适配新引擎版本

- 以旧版本分支为基础创建新分支，比如旧版本 `v1.2.0-v2.4.9` 适配到引擎 `v2.4.13`，则命名为 `v1.2.0-v2.4.13`
- 分别打开新旧引擎的各个源码目录，使用对比工具逐个进行比对，将改动同步到社区版引擎
- 参考以往的提交记录填写描述并提交后即可发布新版本

### 本地开发

- 在演示项目扩展目录建立软链接，指向当前开发中的扩展目录
- 在各个平台打包运行进行测试

## 自动发布脚本

- 建议使用脚本前，先大概了解手动发布流程的步骤
- 前往 `scripts` 目录并执行 `npm i` 安装依赖
- 新建 `.env` 文件，填写 `GITHUB_TOKEN`（如果还需发布付费扩展，需填写 ssh 的 `HOST` `PORT` `USERNAME` `PASSWORD`）
- 返回根目录，执行 `node --env-file=.env scripts/index.js` 启动发布脚本
- 按照脚本的提示进行发布

## 手动发布流程

### 更新版本号

- 修改 `engine`、`jsb-adapter`、`cocos2d-x` 根目录的 `VERSION.md` 文件。
- 修改源码目录的 `README.md` 文件。
- 修改 `sp.js` 的 `version` 属性。
- 修改 `extension` 的 `package.json` 文件中的 `version` 属性。

### 准备压缩包

- 删除 `cocos2d-x` 目录中的 `build/build` 目录，没有用处。
- 删除 `engine` 目录中的 `node_modules` 目录，可能导致解压失败。
- 编译 JavaScript 引擎。
- 编译原生模拟器。
- 将几个源码目录、类型提示文件、`enhance-kit-support` 放到压缩包根目录内。

### 更新 DEMO

- 编译 `web-mobile` 和 `web-desktop` 项目。
- 将这两个项目目录放在 `docs/static/demo` 相应版本号的目录中。
- 查找仓库内所有链接并更新至当前版本号。

### 正式发布

- 上传压缩包到 Github 的 Release。
- 在 Github Release 中填写更新日志。
- 将文档分出当前版本，并发布新版本文档。
