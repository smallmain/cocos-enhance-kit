/****************************************************************************
 Copyright (c) 2017-2019 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of fsUtils software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in fsUtils License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
var fs = worker.getFileSystemManager();
var outOfStorageRegExp = /the maximum size of the file storage/;

var fsUtils = {

    fs,

    isOutOfStorage(errMsg) {
        return outOfStorageRegExp.test(errMsg);
    },

    getUserDataPath() {
        return worker.env.USER_DATA_PATH;
    },

    checkFsValid() {
        if (!fs) {
            console.warn('can not get the file system!');
            return false;
        }
        return true;
    },

    deleteFile(filePath, onComplete) {
        try {
            fs.unlinkSync(filePath);
            onComplete && onComplete(null);
        } catch (error) {
            console.warn(`Delete file failed: path: ${filePath} message: ${error.message}`);
            onComplete && onComplete(error);
        }
    },

    deleteFileSync(filePath, onComplete) {
        try {
            fs.unlinkSync(filePath);
            onComplete && onComplete(null);
        } catch (error) {
            console.warn(`Delete file failed: path: ${filePath} message: ${error.message}`);
            onComplete && onComplete(error);
        }
    },

    downloadFile(remoteUrl, filePath, header, onProgress, onComplete) {
        var options = {
            url: remoteUrl,
            success: function (res) {
                if (res.statusCode === 200) {
                    onComplete && onComplete(null, res.tempFilePath || res.filePath);
                }
                else {
                    if (res.filePath) {
                        fsUtils.deleteFile(res.filePath);
                    }
                    console.warn(`Download file failed: path: ${remoteUrl} message: ${res.statusCode}`);
                    onComplete && onComplete(new Error(res.statusCode), null);
                }
            },
            fail: function (res) {
                console.warn(`Download file failed: path: ${remoteUrl} message: ${res.errMsg}`);
                onComplete && onComplete(new Error(res.errMsg), null);
            }
        }
        if (filePath) options.filePath = filePath;
        if (header) options.header = header;
        var task = worker.downloadFile(options);
        onProgress && task.onProgressUpdate(onProgress);
    },

    saveFile(srcPath, destPath, onComplete) {
        try {
            fs.saveFileSync(srcPath, destPath);
            onComplete && onComplete(null);
        } catch (error) {
            console.warn(`Save file failed: path: ${srcPath} message: ${error.message}`);
            onComplete && onComplete(error);
        }
    },

    copyFile(srcPath, destPath, onComplete) {
        try {
            fs.copyFileSync(srcPath, destPath);
            onComplete && onComplete(null);
        } catch (error) {
            console.warn(`Copy file failed: path: ${srcPath} message: ${error.message}`);
            onComplete && onComplete(error);
        }
    },

    writeFile(path, data, encoding, onComplete) {
        try {
            fs.writeFileSync(path, data, encoding);
            onComplete && onComplete(null);
        } catch (error) {
            console.warn(`Write file failed: path: ${path} message: ${error.message}`);
            onComplete && onComplete(error);
        }
    },

    writeFileSync(path, data, encoding) {
        try {
            fs.writeFileSync(path, data, encoding);
            return null;
        }
        catch (e) {
            console.warn(`Write file failed: path: ${path} message: ${e.message}`);
            return new Error(e.message);
        }
    },

    readFile(filePath, encoding, onComplete) {
        try {
            var data = fs.readFileSync(filePath, encoding);
            onComplete && onComplete(null, data);
        } catch (error) {
            console.warn(`Read file failed: path: ${filePath} message: ${error.message}`);
            onComplete && onComplete(error, null);
        }
    },

    readDir(filePath, onComplete) {
        try {
            var files = fs.readdirSync(filePath);
            onComplete && onComplete(null, files);
        } catch (error) {
            console.warn(`Read directory failed: path: ${filePath} message: ${error.message}`);
            onComplete && onComplete(error, null);
        }
    },

    readText(filePath, onComplete) {
        fsUtils.readFile(filePath, 'utf8', onComplete);
    },

    readArrayBuffer(filePath, onComplete) {
        fsUtils.readFile(filePath, '', onComplete);
    },

    readJson(filePath, onComplete) {
        fsUtils.readFile(filePath, 'utf8', function (err, text) {
            var out = null;
            if (!err) {
                try {
                    out = JSON.parse(text);
                }
                catch (e) {
                    console.warn(`Read json failed: path: ${filePath} message: ${e.message}`);
                    err = new Error(e.message);
                }
            }
            onComplete && onComplete(err, out);
        });
    },

    readJsonSync(path) {
        try {
            var str = fs.readFileSync(path, 'utf8');
            return JSON.parse(str);
        }
        catch (e) {
            console.warn(`Read json failed: path: ${path} message: ${e.message}`);
            return new Error(e.message);
        }
    },

    makeDirSync(path, recursive) {
        try {
            fs.mkdirSync(path, recursive);
            return null;
        }
        catch (e) {
            console.warn(`Make directory failed: path: ${path} message: ${e.message}`);
            return new Error(e.message);
        }
    },

    rmdirSync(dirPath, recursive) {
        try {
            fs.rmdirSync(dirPath, recursive);
        }
        catch (e) {
            console.warn(`rm directory failed: path: ${dirPath} message: ${e.message}`);
            return new Error(e.message);
        }
    },

    exists(filePath, onComplete) {
        try {
            fs.accessSync(filePath);
            onComplete && onComplete(true);
        } catch (error) {
            onComplete && onComplete(false);
        }
    },

    unzip(zipFilePath, targetPath, onComplete) {
        fs.unzip({
            zipFilePath,
            targetPath,
            success() {
                onComplete && onComplete(null);
            },
            fail(res) {
                console.warn(`unzip failed: path: ${zipFilePath} message: ${res.errMsg}`);
                onComplete && onComplete(new Error('unzip failed: ' + res.errMsg));
            },
        })
    },
};

module.exports = fsUtils;
