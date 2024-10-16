const screencanvas = $global.screencanvas;
const parser = cc.assetManager.parser;
const downloader = cc.assetManager.downloader;

function parseParameters (options, onProgress, onComplete) {
    if (onComplete === undefined) {
        var isCallback = typeof options === 'function';
        if (onProgress) {
            onComplete = onProgress;
            if (!isCallback) {
                onProgress = null;
            }
        }
        else if (onProgress === undefined && isCallback) {
            onComplete = options;
            options = null;
            onProgress = null;
        }
        if (onProgress !== undefined && isCallback) {
            onProgress = options;
            options = null;
        }
    }
    options = options || Object.create(null);
    return { options, onProgress, onComplete };
}

function doNothing (url, options, onComplete) {
    onComplete(null, url);
}

downloader.downloadDomAudio = doNothing;

function downloadImage (url, options, onComplete) {
    const parameters = parseParameters(options, undefined, onComplete);
    options = parameters.options;
    onComplete = parameters.onComplete;

    const img =  screencanvas.createImage();

    const timer = setTimeout(() => {
        clearEvent();
        onComplete && onComplete(new Error(cc.debug.getError(4930, url)));
    }, 8000);
    function clearEvent () {
        img.onload = null;
        // img.onerror = null;
    }
    function loadCallback () {
        clearEvent();
        clearTimeout(timer);
        onComplete && onComplete(null, img);
    }
    
    function errorCallback () {
        clearEvent();
        clearTimeout(timer);
        onComplete && onComplete(new Error(cc.debug.getError(4930, url)));
    }

    img.onload = loadCallback;
    // NOTE: crash when registering error callback
    // img.onerror = errorCallback;
    img.src = url;
    return img;
}
downloader.downloadDomImage = downloadImage;

downloader.register({
    // Audio
    '.mp3' : doNothing,
    '.ogg' : doNothing,
    '.wav' : doNothing,
    '.m4a' : doNothing,

    // Image
    '.png' : doNothing,
    '.jpg' : doNothing,
    '.bmp' : doNothing,
    '.jpeg' : doNothing,
    '.gif' : doNothing,
    '.ico' : doNothing,
    '.tiff' : doNothing,
    '.image' : doNothing,
    '.webp' : doNothing,
    '.pvr': doNothing,
    '.pkm': doNothing,
    '.astc': doNothing,
});

parser.register({
    // Audio
    '.mp3' : doNothing,
    '.ogg' : doNothing,
    '.wav' : doNothing,
    '.m4a' : doNothing,

    // Image
    '.png' : downloadImage,
    '.jpg' : downloadImage,
    '.bmp' : downloadImage,
    '.jpeg' : downloadImage,
    '.gif' : downloadImage,
    '.ico' : downloadImage,
    '.tiff' : downloadImage,
    '.image' : downloadImage,
    '.webp' : downloadImage,
});
