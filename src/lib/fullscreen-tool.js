export function initializeErrorHandler() {
	function fullscreenErrorHandler() {
		alert('Fullscreen operation failed');
	}
	document.addEventListener('fullscreenerror', fullscreenErrorHandler);
	document.addEventListener('webkitfullscreenerror', fullscreenErrorHandler);
	document.addEventListener('mozfullscreenerror', fullscreenErrorHandler);
	document.addEventListener('MSFullscreenError', fullscreenErrorHandler);
}

var fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled || document.msFullscreenEnabled;
var exitFullscreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen;

export function toggle(element) {
	if (!fullscreenEnabled) {
		return;
	}
	var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
	var requestFullscreen = element.requestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen || element.msRequestFullscreen;

	if (fullscreenElement === element) {
		exitFullscreen.apply(document);
	} else {
		requestFullscreen.apply(element);
	}
}