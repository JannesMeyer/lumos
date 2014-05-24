'use strict';

addEventListener('DOMContentLoaded', function() {
	let prevUrl, nextUrl;
	let links = document.getElementsByTagName('link');
	for (let i = 0; i < links.length; ++i) {
		let link = links[i];
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