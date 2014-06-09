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

var mapping = {};


window.addEventListener('keydown', function(e) {
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