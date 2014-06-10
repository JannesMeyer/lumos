// https://github.com/madrobby/keymaster/blob/master/keymaster.js

var keyCodeMap = {
	'esc': 27,
	'space': 32,
	'left': 37,
	'up': 38,
	'right': 39,
	'down': 40,
	'e': 69,
	'f': 70,
	'j': 74,
	'k': 75,
	'r': 82,
	'/': 191
};
var bindings = {};

export function bind(conditions, char, fn) {
	if (fn === undefined) {
		throw new Error('missing callback function');
	}
	if (char === undefined) {
		throw new Error('missing char condition');
	}
	if (conditions === undefined) {
		conditions = {};
	}
	conditions.inputEl = !!conditions.inputEl;
	conditions.ctrl = !!conditions.ctrl;
	conditions.shift = !!conditions.shift;
	conditions.alt = !!conditions.alt;
	conditions.meta = !!conditions.meta;

	// Parse char parameter
	var keyCode = keyCodeMap[char];
	if (keyCode === undefined && typeof char === 'number') {
		keyCode = char;
	}
	if (keyCode === undefined) {
		throw new Error('unknown char condition')
	}

	// Re-use the conditions object for the binding
	conditions.fn = fn;

	// Do the binding
	if (bindings[keyCode] === undefined) {
		bindings[keyCode] = [conditions];
	} else {
		bindings[keyCode].push(conditions);
	}
}

export function handleDown(e) {
	var bucket = bindings[e.keyCode];
	if (bucket === undefined) {
		// console.log('Unrecognized key:', e.keyCode);
		return;
	}

	var target = e.target;
	var inputEl = target.tagName === 'INPUT' ||
		target.tagName === 'TEXTAREA' ||
		target.tagName === 'SELECT' ||
		target.isContentEditable;

	for (var i = 0; i < bucket.length; ++i) {
		var binding = bucket[i];
		if (binding.inputEl === inputEl &&
			binding.ctrl === e.ctrlKey &&
			binding.shift === e.shiftKey &&
			binding.alt === e.altKey &&
			binding.meta === e.metaKey) {
			// Match found
			binding.fn(e);
			break;
		}
	}
}
