
'use strict';

// Provide a few global variables to be used by the page
// var $page;

addEventListener('DOMContentLoaded', function() {
	function getFirstOfClass(className) {
		return document.getElementsByClassName(className)[0];
	}

	var page = getFirstOfClass('m-page');
	var fullscreenButton = getFirstOfClass('button-fullscreen');
	var editButton = getFirstOfClass('edit-button');
	var searchBox = getFirstOfClass('m-search');

	function toggleFullscreen(el) {
		var fullscreenEnabled =
			document.fullscreenEnabled ||
			document.mozFullScreenEnabled ||
			document.webkitFullscreenEnabled ||
			document.msFullscreenEnabled;
		if (!fullscreenEnabled) {
			return;
		}

		var fullscreenElement =
			document.fullscreenElement ||
			document.mozFullScreenElement ||
			document.webkitFullscreenElement ||
			document.msFullscreenElement;
		var exitFullscreen =
			document.exitFullscreen ||
			document.mozCancelFullScreen ||
			document.webkitExitFullscreen ||
			document.msExitFullscreen;
		var requestFullscreen =
			el.requestFullscreen ||
			el.mozRequestFullScreen ||
			el.webkitRequestFullscreen ||
			el.msRequestFullscreen;
		if (fullscreenElement === el) {
			exitFullscreen.call(document);
		} else {
			requestFullscreen.call(el);
		}
	}

	// document.addEventListener("fullscreenerror", FSerrorhandler);
	// document.addEventListener("webkitfullscreenerror", FSerrorhandler);
	// document.addEventListener("mozfullscreenerror", FSerrorhandler);
	// document.addEventListener("MSFullscreenError", FSerrorhandler);


	fullscreenButton.addEventListener('click', function(e) {
		toggleFullscreen(document.documentElement);
		fullscreenButton.blur();
		e.preventDefault();
	});

	var prevUrl, nextUrl;
	var links = document.getElementsByTagName('link');
	var i, link;
	for (i = 0; i < links.length; ++i) {
		link = links[i];
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
			console.log('Unrecognized key:', e.keyCode);
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

	// AUTOCOMPLETE
	// searchBox.typeahead([]);

});