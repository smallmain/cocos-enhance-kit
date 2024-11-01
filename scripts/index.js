import { confirm, input } from "@inquirer/prompts";
import { $ } from "execa";
import gracefulFs from "graceful-fs";
import { Octokit } from 'octokit';
import { basename, dirname, extname, join } from "path";
import { cwd, env } from "process";
import { Client } from 'ssh2';
import { Zip } from 'zip-lib';
const { renameSync, createReadStream, copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } = gracefulFs;

// 公共函数
const $$ = $({ stdout: 'inherit', stderr: 'inherit' });

function copyDirectory(sourceDir, targetDir) {
    // 创建目标目录
    mkdirSync(targetDir, { recursive: true });

    // 读取源目录中的文件和子目录
    const files = readdirSync(sourceDir);

    // 遍历源目录中的文件和子目录
    files.forEach((file) => {
        const sourcePath = join(sourceDir, file);
        const targetPath = join(targetDir, file);

        // 判断是否为文件
        if (statSync(sourcePath).isFile()) {
            // 如果是文件，则直接拷贝到目标目录
            copyFileSync(sourcePath, targetPath);
        } else {
            // 如果是子目录，则递归调用copyDir函数进行拷贝
            copyDirectory(sourcePath, targetPath);
        }
    });
}

async function uploadBySFTP(host, port, username, password, filePath, targetFilePath) {
    return new Promise((resolve, reject) => {
        const client = new Client();

        client.on('ready', () => {
            console.log('SSH 连接已建立');
            client.sftp((err, sftp) => {
                if (err) {
                    reject(err);
                    client.end();
                    return;
                }

                sftp.mkdir(dirname(targetFilePath), err => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    sftp.writeFile(targetFilePath, readFileSync(filePath), err => {
                        if (err) {
                            reject(err);
                            return;
                        }

                        client.end();
                        resolve();
                    })

                    // const readStream = createReadStream(filePath);
                    // const writeStream = sftp.createWriteStream(targetFilePath);

                    // writeStream.on('close', () => {
                    //     resolve();
                    //     client.end();
                    // });

                    // writeStream.on('error', (err) => {
                    //     reject(err);
                    //     sftp.writeFile(remotePath, data, options)
                    //     client.end();
                    // });

                    // readStream.pipe(writeStream);
                });
            });
        });

        client.on('error', (err) => {
            reject(err);
        });

        client.connect({
            host,
            port,
            username,
            password,
        });
    });
}

// 试运行
const DRYRUN = false;
const COMPILING_SIMULATOR = false;

// 目录
const masterPath = cwd();
const masterTempPath = join(masterPath, "temp");
const sourcePath = await input({
    message: "请输入源码分支目录：",
    required: true,
    default: "/Users/smallmain/Documents/Work/cocos-service-pack-src",
});
const extensionPath = await input({
    message: "请输入付费扩展目录（如果有的话）：",
    required: false,
    default: "/Users/smallmain/Documents/Work/cocos-service-pack-extension",
});

console.log("主分支目录：", masterPath);
console.log("源码目录：", sourcePath);
console.log("付费扩展目录：", extensionPath);

// 版本号
const engineVersion = await input({
    message: "请输入发布的引擎版本：",
    required: true,
    default: "1.0.0",
});
const kitVersion = await input({
    message: "请输入发布的社区版版本：",
    required: true,
    default: "1.0.0",
});

// 更新源码 VERSION.md
readdirSync(sourcePath, {
    recursive: true,
    encoding: "utf-8",
})
    .filter(path => basename(path) === "VERSION.md")
    .forEach(path => {
        const filePath = join(sourcePath, path);

        if (!DRYRUN) {
            writeFileSync(filePath, kitVersion);
        }

        console.log("更新文件", filePath);
    });

// 更新源码 README.md
const SOURCE_README = `Cocos Enhance Kit v${kitVersion} 引擎源码\n\n适配 v${engineVersion} 引擎\n`;
const sourceReadmePath = join(sourcePath, "README.md");
if (!DRYRUN) {
    writeFileSync(sourceReadmePath, SOURCE_README);
}
console.log("更新文件", sourceReadmePath);

// 更新 sp.js 版本号
const SPJS_REGEX = /version:\s*"(.*?)"/;
const spjsPath = join(sourcePath, "engine/cocos2d/core/sp/sp.js");
const newSpjsContent = readFileSync(spjsPath, { encoding: "utf-8" })
    .replace(SPJS_REGEX, `version: "${kitVersion}"`);
if (!DRYRUN) {
    writeFileSync(spjsPath, newSpjsContent);
}
console.log("更新文件", spjsPath);

// 确保支持性扩展 package.json 版本号正确
const supportPath = join(sourcePath, "extension");
const supportPackageJsonPath = join(supportPath, "package.json");
const supportPackageJson = JSON.parse(readFileSync(supportPackageJsonPath, { encoding: "utf-8" }));
supportPackageJson.version = kitVersion;
if (!DRYRUN) {
    writeFileSync(supportPackageJsonPath, JSON.stringify(supportPackageJson, null, 2));
}
console.log("更新文件", supportPackageJsonPath);

// 准备压缩包
const cppPath = join(sourcePath, "cocos2d-x");
const cppBuildPath = join(cppPath, "build/build");
const jsPath = join(sourcePath, "engine");
const jsNpmPath = join(jsPath, "node_modules");
const jsbPath = join(sourcePath, "jsb-adapter");
const minigamePath = join(sourcePath, "adapters");
const dtsPath = join(sourcePath, "creator-sp.d.ts");
const zipPath = join(masterTempPath, `cocos-enhance-kit-v${kitVersion}-v${engineVersion}.zip`);

if (!DRYRUN) {
    console.log("开始编译 JavaScript 引擎");
    try {
        await $$({ cwd: jsPath })`gulp build-dev`;
    } catch (error) {
        await confirm({
            message: `自动编译 JavaScript 引擎失败，请手动编译后继续`,
            default: true,
        });
    }
}
console.log("已编译 JavaScript 引擎");
if (!DRYRUN && COMPILING_SIMULATOR) {
    console.log("开始编译当前平台的原生模拟器");
    try {
        await $$({ cwd: cppPath })`gulp gen-simulator`;
        await $$({ cwd: cppPath })`gulp update-simulator-config`;
    } catch (error) {
        await confirm({
            message: `自动编译当前平台的原生模拟器失败，请手动编译后继续`,
            default: true,
        });
    }
}
console.log("已编译当前平台的原生模拟器");
const tempCppBuildPath = join(masterTempPath, "cpp/build");
const tempJsNpmPath = join(masterTempPath, "js/node_modules");
if (!DRYRUN) {
    try {
        mkdirSync(dirname(tempCppBuildPath), { recursive: true });
        renameSync(cppBuildPath, tempCppBuildPath);
    } catch (error) {

    }
    try {
        mkdirSync(dirname(tempJsNpmPath), { recursive: true });
        renameSync(jsNpmPath, tempJsNpmPath);
    } catch (error) {

    }
}
console.log("移动目录", cppBuildPath, "->", tempCppBuildPath);
console.log("移动目录", jsNpmPath, "->", tempJsNpmPath);

// 创建压缩包
if (!DRYRUN) {
    const sourceZipFile = new Zip();
    console.log("正在压缩", jsPath);
    sourceZipFile.addFolder(jsPath, "engine");
    console.log("正在压缩", cppPath);
    sourceZipFile.addFolder(cppPath, "cocos2d-x");
    console.log("正在压缩", jsbPath);
    sourceZipFile.addFolder(jsbPath, "jsb-adapter");
    console.log("正在压缩", minigamePath);
    sourceZipFile.addFolder(minigamePath, "adapters");
    console.log("正在压缩", supportPath);
    sourceZipFile.addFolder(supportPath, "extension");
    console.log("正在压缩", dtsPath);
    sourceZipFile.addFile(dtsPath);
    await sourceZipFile.archive(zipPath);
}
console.log("已压缩至文件", zipPath);

// [付费扩展]
if (extensionPath) {
    // 创建压缩包
    const payZipPath = join(masterTempPath, `${kitVersion}.zip`);
    if (!DRYRUN) {
        const sourceZipFile = new Zip();
        console.log("正在压缩", jsPath);
        sourceZipFile.addFolder(jsPath, `${kitVersion}/engine`);
        console.log("正在压缩", cppPath);
        sourceZipFile.addFolder(cppPath, `${kitVersion}/cocos2d-x`);
        console.log("正在压缩", jsbPath);
        sourceZipFile.addFolder(jsbPath, `${kitVersion}/jsb-adapter`);
        console.log("正在压缩", minigamePath);
        sourceZipFile.addFolder(minigamePath, `${kitVersion}/adapters`);
        console.log("正在压缩", dtsPath);
        sourceZipFile.addFile(dtsPath, `${kitVersion}/creator-sp.d.ts`);
        await sourceZipFile.archive(payZipPath);
    }
    console.log("已压缩至文件", payZipPath);

    // 上传至 downloadcdn.smallmain.com
    const payZipUrl = `http://downloadcdn.smallmain.com/cocos-enhance-kit/${engineVersion}/${kitVersion}.zip`;
    if (!DRYRUN) {
        console.log("正在上传文件", payZipPath);
        try {
            await uploadBySFTP(
                env.HOST,
                env.PORT,
                env.USERNAME,
                env.PASSWORD,
                payZipPath,
                `/www/wwwroot/download.smallmain.com/cocos-enhance-kit/${engineVersion}/${kitVersion}.zip`,
            );
        } catch (error) {
            console.error(error);
            await confirm({
                message: `自动上传 zip 失败，请手动上传后继续`,
                default: true,
            });
        }
    }
    console.log("已上传文件", payZipUrl);

    // 手动修改 config.json
    await confirm({
        message: `请将压缩文件上传至各网盘，并修改 config.json 指向下载链接`,
        default: true,
    });

    // 手动修改 package.json 的 version 字段
    await confirm({
        message: `请修改 package.json 的 version 确定版本号后继续`,
        default: true,
    });

    // 压缩为扩展 zip 文件
    const extensionVersion = JSON.parse(readFileSync(join(extensionPath, "package.json"), { encoding: "utf-8" })).version;
    const extensionZipPath = join(masterTempPath, `cocos-enhance-kit-extension-v${extensionVersion}.zip`);
    if (!DRYRUN) {
        const sourceZipFile = new Zip();
        readdirSync(extensionPath, { withFileTypes: true })
            .filter(v => v.name !== "packages" && v.name !== ".git")
            .forEach(v => {
                const path = join(v.path, v.name);
                console.log("正在压缩", path);
                if (v.isFile()) {
                    sourceZipFile.addFile(path, v.name);
                } else {
                    sourceZipFile.addFolder(path, v.name);
                }
            });

        // packages 目录需要仅保留 backup 目录，所以特殊处理
        const packagesPath = join(extensionPath, "packages");
        readdirSync(packagesPath, { withFileTypes: true })
            .forEach(v => {
                if (v.isFile()) {
                    const path = join(v.path, v.name);
                    console.log("正在压缩", path);
                    sourceZipFile.addFile(path, join("packages", v.name));
                } else {
                    const relPath = join(v.name, "backup");
                    const path = join(v.path, relPath);
                    console.log("正在压缩", path);
                    sourceZipFile.addFolder(path, join("packages", relPath));
                }
            });

        await sourceZipFile.archive(extensionZipPath);
    }
    console.log("已压缩至文件", extensionZipPath);

    //  手动上传到 Cocos Store
    await confirm({
        message: `请手动上传 zip 文件到 Cocos Store`,
        default: true,
    });
}

// 将目录移回
if (!DRYRUN) {
    try {
        renameSync(tempCppBuildPath, cppBuildPath);
    } catch (error) {

    }
    try {
        renameSync(tempJsNpmPath, jsNpmPath);
    } catch (error) {

    }
}
console.log("移动目录", tempCppBuildPath, "->", cppBuildPath);
console.log("移动目录", tempJsNpmPath, "->", jsNpmPath);

// 更新 Demo
const needUpdateDemo = await confirm({
    message: `是否需要更新 Demo 项目？`,
    default: true,
});
if (needUpdateDemo) {
    const demoBuildPath = join(masterPath, "demo/build");
    const demoDesktopBuildPath = join(demoBuildPath, "web-desktop");
    const demoMobileBuildPath = join(demoBuildPath, "web-mobile");
    const demoTargetPath = join(masterPath, "docs/static/demo", `v${kitVersion}`);
    const demoDesktopTargetPath = join(demoTargetPath, "web-desktop");
    const demoMobileTargetPath = join(demoTargetPath, "web-mobile");
    if (!existsSync(demoTargetPath)) {
        await confirm({
            message: `请测试并编译 Demo 项目，然后继续操作`,
            default: true,
        });
        if (!DRYRUN) {
            copyDirectory(demoDesktopBuildPath, demoDesktopTargetPath);
            copyDirectory(demoMobileBuildPath, demoMobileTargetPath);
        }
        console.log("拷贝目录", demoDesktopBuildPath, "->", demoDesktopTargetPath);
        console.log("拷贝目录", demoMobileBuildPath, "->", demoMobileTargetPath);
    }
    readdirSync(masterPath, {
        recursive: true,
        encoding: "utf-8",
    })
        .filter(path => [".ts", ".tsx", ".js", ".jsx", ".md", ".mdx"].includes(extname(path)))
        .forEach(path => {
            const filePath = join(masterPath, path);

            if (!statSync(filePath).isFile()) {
                return;
            }

            const content = readFileSync(filePath, { encoding: "utf-8" });
            const regexDesktop = /https:\/\/smallmain\.github\.io\/cocos-enhance-kit\/demo\/(v\d+\.\d+\.\d+)\/web-desktop\/index\.html/g;
            const regexMobile = /https:\/\/smallmain\.github\.io\/cocos-enhance-kit\/demo\/(v\d+\.\d+\.\d+)\/web-mobile\/index\.html/g;

            if (!DRYRUN) {
                writeFileSync(filePath, content.replace(regexDesktop, `https://smallmain.github.io/cocos-enhance-kit/demo/${targetVersion}/web-desktop/index.html`).replace(regexMobile, `https://smallmain.github.io/cocos-enhance-kit/demo/${targetVersion}/web-mobile/index.html`));
            }

            if (regexDesktop.test(content) || regexMobile.test(content)) {
                console.log("更新文件", filePath);
            }
        });
}

// 上传到 Github Release
const tag = `v${kitVersion}`;
let releaseUrl = "(undefined)";
const needPublish = await confirm({
    message: `是否上传至 Github Release？（请先在源码分支创建 '${tag}' Tag）`,
    default: true,
});
if (needPublish && !DRYRUN) {
    try {
        const octokit = new Octokit({
            auth: env.GITHUB_TOKEN,
        });

        console.log("创建 Release：", tag);

        let releaseId = 0;
        try {
            const { data } = await octokit.rest.repos.getReleaseByTag({
                owner: "smallmain",
                repo: "cocos-enhance-kit",
                tag: tag,
            });
            releaseId = data.id;
            releaseUrl = data.html_url;
        } catch (error) {
            const { data } = await octokit.rest.repos.createRelease({
                owner: "smallmain",
                repo: "cocos-enhance-kit",
                name: tag,
                tag_name: tag,
                body: `适配 Cocos Creator v${engineVersion} 版本\n\n> 注意，如果你需要使用模拟器预览，请按照官方的 [引擎定制文档](https://docs.cocos.com/creator/2.4/manual/zh/advanced-topics/engine-customization.html#25-%E7%BC%96%E8%AF%91%E6%A8%A1%E6%8B%9F%E5%99%A8) 重新编译原生模拟器。`,
                prerelease: false,
                make_latest: "legacy",
            });
            releaseId = data.id;
            releaseUrl = data.html_url;
        }

        console.log("上传至 Release：", zipPath);
        const fileContent = readFileSync(zipPath);
        await octokit.rest.repos.uploadReleaseAsset({
            owner: "smallmain",
            repo: "cocos-enhance-kit",
            release_id: releaseId,
            data: fileContent,
            name: basename(zipPath),
            headers: {
                'content-type': 'application/zip',
            },
        });
    } catch (error) {
        console.error(error);
        await confirm({
            message: `自动上传至 Github Release 失败，请手动上传后继续`,
            default: true,
        });
    }
}
console.log("已发布到 Github Release：", tag);

// 手动更新 Github Release 的更新日志
if (needPublish) {
    await confirm({
        message: `请前往 ${releaseUrl} 填写更新日志`,
        default: true,
    });
}

// 手动发布新版本文档
await confirm({
    message: `请使用命令 npm run docusaurus docs:version 1.1.0 创建新版本文档，并在 docs 目录执行 USE_SSH=true GIT_USER=<user_name> npm run deploy 发布`,
    default: true,
});

// rmSync(masterTempPath, { recursive: true, force: true });
