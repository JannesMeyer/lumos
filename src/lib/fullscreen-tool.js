var handlerAdded = false;

// webkitRequestFullScreen fails when passing Element.ALLOW_KEYBOARD_INPUT in Safari 5.1.2
// http://stackoverflow.com/questions/8427413/webkitrequestfullscreen-fails-when-passing-element-allow-keyboard-input-in-safar

var fullscreenEnabled = getEnabled();
var exitFullscreen = getExitFunc();

function errorHandler() {
	alert('Fullscreen operation failed');
}

// function stateChangeHandler() {
// 	state = getElement() !== undefined;
// }

function getElement() {
	return document.fullscreenElement ||
	       document.mozFullScreenElement ||
	       document.webkitFullscreenElement ||
	       document.msFullscreenElement;
}

function getRequestFunc(element) {
	var fn = element.requestFullscreen ||
	         element.mozRequestFullScreen ||
	         element.webkitRequestFullscreen ||
	         element.msRequestFullscreen;
	return fn.bind(element);
}

function getExitFunc() {
	var fn = document.exitFullscreen ||
	         document.mozCancelFullScreen ||
	         document.webkitExitFullscreen ||
	         document.msExitFullscreen;
	return fn.bind(document);
}

function getEnabled() {
	return document.fullscreenEnabled ||
	       document.mozFullScreenEnabled ||
	       document.webkitFullscreenEnabled ||
	       document.msFullscreenEnabled;
}

export function getState() {
	return getElement() !== undefined;
}

export function toggle(element) {
	if (!fullscreenEnabled) {
		console.warn('no fullscreen capability');
		return;
	}

	// If this is the first time
	if (!handlerAdded) {
		document.addEventListener('fullscreenerror', errorHandler);
		document.addEventListener('webkitfullscreenerror', errorHandler);
		document.addEventListener('mozfullscreenerror', errorHandler);
		document.addEventListener('MSFullscreenError', errorHandler);
		// document.addEventListener('fullscreenchange', stateChangeHandler);
		// document.addEventListener('webkitfullscreenchange', stateChangeHandler);
		// document.addEventListener('mozfullscreenchange', stateChangeHandler);
		// document.addEventListener('MSFullscreenChange', stateChangeHandler);
		handlerAdded = true;
	}

	// Toggle fullscreen
	if (getElement() !== element) {
		getRequestFunc(element)(); // Element.ALLOW_KEYBOARD_INPUT
	} else {
		exitFullscreen();
	}
}