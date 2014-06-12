var handlerAdded = false;

function fullscreenErrorHandler() {
	alert('Fullscreen operation failed');
}

var fullscreenEnabled =
	document.fullscreenEnabled ||
	document.mozFullScreenEnabled ||
	document.webkitFullscreenEnabled ||
	document.msFullscreenEnabled;
var exitFullscreen =
	document.exitFullscreen ||
	document.mozCancelFullScreen ||
	document.webkitExitFullscreen ||
	document.msExitFullscreen;

export function toggle(element) {
	if (!fullscreenEnabled) {
		console.warn('no fullscreen capability');
		return;
	}
	var fullscreenElement =
		document.fullscreenElement ||
		document.mozFullScreenElement ||
		document.webkitFullscreenElement ||
		document.msFullscreenElement;
	var requestFullscreen =
		element.requestFullscreen ||
		element.mozRequestFullScreen ||
		element.webkitRequestFullscreen ||
		element.msRequestFullscreen;

	// If this is the first time
	if (!handlerAdded) {
		document.addEventListener('fullscreenerror', fullscreenErrorHandler);
		document.addEventListener('webkitfullscreenerror', fullscreenErrorHandler);
		document.addEventListener('mozfullscreenerror', fullscreenErrorHandler);
		document.addEventListener('MSFullscreenError', fullscreenErrorHandler);
		handlerAdded = true;
	}

	// Toggle fullscreen
	if (fullscreenElement === element) {
		exitFullscreen.apply(document);
	} else {
		requestFullscreen.apply(element);
	}
}