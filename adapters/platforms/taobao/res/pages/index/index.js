var touchstartCB;
var touchcancelCB;
var touchendCB;
var touchmoveCB;

function handleTouchEvent (event) {
	let changedTouches = event.changedTouches;
	if (changedTouches) {
		for (let touch of changedTouches) {
			touch.clientX = touch.x;
			touch.clientY = touch.y;
		}
	}
}

Page({
	onReady () {
		__globalAdapter.onTouchStart = function (cb) {
			touchstartCB = cb;
		}
		__globalAdapter.onTouchCancel = function (cb) {
			touchcancelCB = cb;
		}
		__globalAdapter.onTouchEnd = function (cb) {
			touchendCB = cb;
		}
		__globalAdapter.onTouchMove = function (cb) {
			touchmoveCB = cb;
		}
	},
	onError (err) {
		console.error('error in page: ', err);
	},
	onTouchStart (event) {
		handleTouchEvent(event);
		touchstartCB && touchstartCB(event);
	},
	onTouchCancel (event) {
		handleTouchEvent(event);
		touchcancelCB && touchcancelCB(event);
	},
	onTouchEnd (event) {
		handleTouchEvent(event);
		touchendCB && touchendCB(event);
	},
	onTouchMove (event) {
		handleTouchEvent(event);
		touchmoveCB && touchmoveCB(event);
	},
	canvasOnReady () {
		my.createCanvas({
			id:'GameCanvas', 
			success(canvas){
			        if (!canvas) {
    				        console.error('failed to create canvas.');
			                return;
			        }
				$global.screencanvas = canvas;
				$global.__cocosCallback();
			},
			fail (err) {
				console.error('failed to init on screen canvas', err)
			}
		});
	}
});
