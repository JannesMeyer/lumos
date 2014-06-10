// https://github.com/madrobby/keymaster/blob/master/keymaster.js

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

export function bind(condition, fn) {

}

export function handleKeyDown(e) {
	var char;
	if (KEYMAP[e.keyCode]) {
		char = KEYMAP[e.keyCode];
	} else {
		// console.log('Unrecognized key:', e.keyCode);
		return;
	}

	var target = e.target;
	var input = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable;
	var ctrl = e.ctrlKey;
	var shift = e.shiftKey;
	var alt = e.altKey;
	var meta = e.metaKey;
	var modifiers = ctrl + shift + alt + meta;

	if (input && char === 'esc' && target.blur) {
		target.blur();
	}
	if (!input && char === '/' && modifiers === 0) {
		searchBox.focus();
		e.preventDefault();
		return;
	}
	if (!input && char === 'j' && modifiers === 0 && nextUrl) {
		location.href = nextUrl;
		return;
	}
	if (!input && char === 'k' && modifiers === 0 && prevUrl) {
		location.href = prevUrl;
		return;
	}
	if (!input && char === 'e' && modifiers === 0) {
		location.href= editButton.href;
		return;
	}
	if (!input && char === 'f' && modifiers === 0) {
		toggleFullscreen(document.documentElement);
		return;
	}
	if (!input && char === 'r' && modifiers === 0) {
		location.href = '/';
		return;
	}
	if (!input && char === 'up' && meta && modifiers === 1) {
		location.href = '..';
		return;
	}
}
