'use strict';

// Provide a few global variables to be used by the page
// var $page;

addEventListener('DOMContentLoaded', function() {
	function getFirstOfClass(className) {
		return document.getElementsByClassName(className)[0];
	}

	var page = getFirstOfClass('m-page');
	var fullscreenButton = getFirstOfClass('button-fullscreen');
	var searchBox = getFirstOfClass('m-search');

	function startFullscreen(el) {
		var requestFullscreen = el.requestFullscreen || el.mozRequestFullScreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
		requestFullscreen.call(el);
	}

	// document.addEventListener("fullscreenerror", FSerrorhandler);
	// document.addEventListener("webkitfullscreenerror", FSerrorhandler);
	// document.addEventListener("mozfullscreenerror", FSerrorhandler);
	// document.addEventListener("MSFullscreenError", FSerrorhandler);

	var fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled || document.msFullscreenEnabled;
	if (fullscreenEnabled) {
		fullscreenButton.addEventListener('click', function(e) {
			startFullscreen(page);
			fullscreenButton.blur();
			e.preventDefault();
		});
	}

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
		74: 'j',
		75: 'k',
		191: '/'
	};
	addEventListener('keydown', function(e) {
		var character;
		if (KEYMAP[e.keyCode]) {
			character = KEYMAP[e.keyCode];
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
			if (character === 'esc' && element.blur) {
				element.blur();
			}
			return;
		}

		if (character === '/') {
			searchBox.focus();
			e.preventDefault();
			return;
		}
		if (character === 'j' && nextUrl) {
			location.href = nextUrl;
			return;
		}
		if (character === 'k' && prevUrl) {
			location.href = prevUrl;
			return;
		}
		if (character === 'e') {
			location.href= test.attr('href');
			return;
		}
	});

	// AUTOCOMPLETE
	// searchBox.typeahead([]);

});