const utils = require('../../../common/utils');

if (window.__globalAdapter) {

    let globalAdapter = window.__globalAdapter;
    // SystemInfo
    let systemInfo;
    let systemInfoCached = false;
    function refreshSystemInfo(delay){
        systemInfo = wx.getSystemInfoSync();
        // refresh systemInfo, some seconds later.
        setTimeout(function () {
            systemInfo = wx.getSystemInfoSync();
            systemInfoCached = true
        }, delay || 5000);
    }
    refreshSystemInfo();

    // NOTE: size and orientation info is wrong at the init phase, especially on iOS device
    function isLandscape () {
        return systemInfo.deviceOrientation ? (systemInfo.deviceOrientation === "landscape"): (systemInfo.screenWidth > systemInfo.screenHeight);
    }

    globalAdapter.isSubContext = (wx.getOpenDataContext === undefined);
    globalAdapter.isDevTool = (systemInfo.platform === 'devtools');
    utils.cloneMethod(globalAdapter, wx, 'getSystemInfoSync');

    // TouchEvent
    utils.cloneMethod(globalAdapter, wx, 'onTouchStart');
    utils.cloneMethod(globalAdapter, wx, 'onTouchMove');
    utils.cloneMethod(globalAdapter, wx, 'onTouchEnd');
    utils.cloneMethod(globalAdapter, wx, 'onTouchCancel');

    // Audio
    utils.cloneMethod(globalAdapter, wx, 'createInnerAudioContext');

    // AudioInterruption Evnet
    utils.cloneMethod(globalAdapter, wx, 'onAudioInterruptionEnd');
    utils.cloneMethod(globalAdapter, wx, 'onAudioInterruptionBegin');

    // Video
    utils.cloneMethod(globalAdapter, wx, 'createVideo');

    // FrameRate
    utils.cloneMethod(globalAdapter, wx, 'setPreferredFramesPerSecond');

    // Keyboard
    utils.cloneMethod(globalAdapter, wx, 'showKeyboard');
    utils.cloneMethod(globalAdapter, wx, 'hideKeyboard');
    utils.cloneMethod(globalAdapter, wx, 'updateKeyboard');
    utils.cloneMethod(globalAdapter, wx, 'onKeyboardInput');
    utils.cloneMethod(globalAdapter, wx, 'onKeyboardConfirm');
    utils.cloneMethod(globalAdapter, wx, 'onKeyboardComplete');
    utils.cloneMethod(globalAdapter, wx, 'offKeyboardInput');
    utils.cloneMethod(globalAdapter, wx, 'offKeyboardConfirm');
    utils.cloneMethod(globalAdapter, wx, 'offKeyboardComplete');

    // Message
    utils.cloneMethod(globalAdapter, wx, 'getOpenDataContext');
    utils.cloneMethod(globalAdapter, wx, 'onMessage');

    // SharedCanvas
    utils.cloneMethod(globalAdapter, wx, 'getSharedCanvas');

    // Font
    utils.cloneMethod(globalAdapter, wx, 'loadFont');

    // hide show Event
    utils.cloneMethod(globalAdapter, wx, 'onShow');
    utils.cloneMethod(globalAdapter, wx, 'onHide');

    // onError
    utils.cloneMethod(globalAdapter, wx, 'onError');
    // offError
    utils.cloneMethod(globalAdapter, wx, 'offError');

    // Accelerometer
    let isAccelerometerInit = false;
    let deviceOrientation = 1;
    if (wx.onDeviceOrientationChange) {
        wx.onDeviceOrientationChange(function (res) {
            refreshSystemInfo();

            if (res.value === 'landscape') {
                deviceOrientation = 1;
            }
            else if (res.value === 'landscapeReverse') {
                deviceOrientation = -1;
            }
        });
    }

    if (wx.onWindowResize) {
        wx.onWindowResize(function () {
            refreshSystemInfo();
            window.dispatchEvent('resize');
        });
    }

    Object.assign(globalAdapter, {
        startAccelerometer (cb) {
            if (!isAccelerometerInit) {
                isAccelerometerInit = true;
                wx.onAccelerometerChange && wx.onAccelerometerChange(function (res) {
                    let resClone = {};
                    let x = res.x;
                    let y = res.y;
                    if (isLandscape()) {
                        let tmp = x;
                        x = -y;
                        y = tmp;
                    }

                    resClone.x = x * deviceOrientation;
                    resClone.y = y * deviceOrientation;
                    resClone.z = res.z;
                    cb && cb(resClone);
                });
            }
            else {
                wx.startAccelerometer && wx.startAccelerometer({
                    fail (err) {
                        console.error('start accelerometer failed', err);
                    },
                    // success () {},
                    // complete () {},
                });
            }
        },

        stopAccelerometer () {
            wx.stopAccelerometer && wx.stopAccelerometer({
                fail (err) {
                    console.error('stop accelerometer failed', err);
                },
                // success () {},
                // complete () {},
            });
        },
    });

    // safeArea
    // origin point on the top-left corner
    globalAdapter.getSafeArea = function () {
        systemInfo = systemInfoCached ? systemInfo : wx.getSystemInfoSync();
        let windowWidth = systemInfo.windowWidth;
        let windowHeight = systemInfo.windowHeight;

        let { top, left, bottom, right, width, height } = systemInfo.safeArea;
        // HACK: on iOS device, the orientation should mannually rotate
        if (systemInfo.platform === 'ios' && !globalAdapter.isDevTool && isLandscape()) {
            let tmpTop = top, tmpLeft = left, tmpBottom = bottom, tmpRight = right, tmpWidth = width, tmpHeight = height;
            let bottomHeight = windowWidth - tmpBottom;
            top = windowHeight - tmpRight;
            left = tmpTop;
            bottom = windowHeight - tmpLeft - bottomHeight;
            right = tmpBottom;
            height = tmpWidth - bottomHeight;
            width = tmpHeight;
        }
        return { top, left, bottom, right, width, height };
    }
}
