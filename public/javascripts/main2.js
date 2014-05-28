'use strict';

addEventListener('DOMContentLoaded', function() {
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

	// TODO: disable when input element is focused (use Mousetrap.js)
	addEventListener('keydown', function(e) {
		if (e.keyCode === 74 && nextUrl) { // j
			location.href = nextUrl;
		} else
		if (e.keyCode === 75 && prevUrl) { // k
			location.href = prevUrl;
		}
	});


});