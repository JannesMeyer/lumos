'use strict';

global.React = require('react');

/********************************
   Helper functions
 ********************************/

function getFirstOfClass(className) {
	return document.getElementsByClassName(className)[0];
}

function toggleFullscreen(el) {
	var fullscreenEnabled = document.fullscreenEnabled ||
	    document.mozFullScreenEnabled ||
	    document.webkitFullscreenEnabled ||
	    document.msFullscreenEnabled;
	if (!fullscreenEnabled) { return; }

	var fullscreenElement = document.fullscreenElement ||
	    document.mozFullScreenElement ||
	    document.webkitFullscreenElement ||
	    document.msFullscreenElement;
	var exitFullscreen = document.exitFullscreen ||
	    document.mozCancelFullScreen ||
	    document.webkitExitFullscreen ||
	    document.msExitFullscreen;
	var requestFullscreen = el.requestFullscreen ||
	    el.mozRequestFullScreen ||
	    el.webkitRequestFullscreen ||
	    el.msRequestFullscreen;

	if (fullscreenElement === el) {
		exitFullscreen.apply(document);
	} else {
		requestFullscreen.apply(el);
	}
}

function fullscreenErrorHandler() {
	alert('Fullscreen operation failed');
}

/********************************
   onload
 ********************************/

document.addEventListener('fullscreenerror', fullscreenErrorHandler);
document.addEventListener('webkitfullscreenerror', fullscreenErrorHandler);
document.addEventListener('mozfullscreenerror', fullscreenErrorHandler);
document.addEventListener('MSFullscreenError', fullscreenErrorHandler);

addEventListener('DOMContentLoaded', function() {

	var fullscreenButton = getFirstOfClass('button-fullscreen');
	var editButton = getFirstOfClass('edit-button');
	var searchBox = getFirstOfClass('m-search');

	// fullscreenButton.addEventListener('click', function(e) {
	// 	toggleFullscreen(document.documentElement);
	// 	fullscreenButton.blur();
	// 	e.preventDefault();
	// });

	var prevUrl;
	var nextUrl;
	var linkElements = document.getElementsByTagName('link');
	for (var i = 0; i < linkElements.length; ++i) {
		var link = linkElements[i];
		if (link.rel === 'prev') {
			prevUrl = link.href;
		} else if (link.rel === 'next') {
			nextUrl = link.href;
		}
	}

	var KEYMAP = {
		27: 'esc',
		32: 'space',
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down',
		69: 'e',
		70: 'f',
		74: 'j',
		75: 'k',
		82: 'r',
		191: '/'
	};
	addEventListener('keydown', function(e) {
		var char;
		if (KEYMAP[e.keyCode]) {
			char = KEYMAP[e.keyCode];
		} else {
			// console.log('Unrecognized key:', e.keyCode);
			return;
		}

		// Disable when an input element is focused
		var element = e.target;
		if (element.tagName === 'INPUT' ||
			element.tagName === 'TEXTAREA' ||
			element.tagName === 'SELECT' ||
			element.isContentEditable) {
			if (char === 'esc' && element.blur) {
				element.blur();
			}
			return;
		}

		var ctrl = e.ctrlKey;
		var shift = e.shiftKey;
		var alt = e.altKey;
		var meta = e.metaKey;
		var modifiers = ctrl + shift + alt + meta;

		if (char === '/' && modifiers === 0) {
			searchBox.focus();
			e.preventDefault();
			return;
		}
		if (char === 'j' && modifiers === 0 && nextUrl) {
			location.href = nextUrl;
			return;
		}
		if (char === 'k' && modifiers === 0 && prevUrl) {
			location.href = prevUrl;
			return;
		}
		if (char === 'e' && modifiers === 0) {
			location.href= editButton.href;
			return;
		}
		if (char === 'f' && modifiers === 0) {
			toggleFullscreen(document.documentElement);
			return;
		}
		if (char === 'r' && modifiers === 0) {
			location.href = '/';
			return;
		}
		if (char === 'up' && meta && modifiers === 1) {
			location.href = '..';
			return;
		}
	});

});