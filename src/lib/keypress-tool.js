var keyCodeMap = {
	'backspace': 8,
	'tab': 9,
	'clear': 12,
	'enter': 13,
	'return': 13,
	'esc': 27,
	'space': 32,
	'left': 37,
	'up': 38,
	'right': 39,
	'down': 40,
	'del': 46,
	'home': 36,
	'end': 35,
	'pageup': 33,
	'pagedown': 34,
	',': 188,
	'.': 190,
	'/': 191,
	'`': 192,
	'-': 189,
	'=': 187,
	';': 186,
	'\'': 222,
	'[': 219,
	']': 221,
	'\\': 220,
	'a': 65, 'b': 66, 'c': 67, 'd': 68,
	'e': 69, 'f': 70, 'g': 71, 'h': 72,
	'i': 73, 'j': 74, 'k': 75, 'l': 76,
	'm': 77, 'n': 78, 'o': 79, 'p': 80,
	'q': 81, 'r': 82, 's': 83, 't': 84,
	'u': 85, 'v': 86, 'w': 87, 'x': 88,
	'y': 89, 'z': 90
};
var bindings = {};
var handlerAdded = false;

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
		throw new Error('unknown char condition ' + char)
	}

	// Re-use the conditions object for the binding
	conditions.fn = fn;

	// If this is the first binding
	if (!handlerAdded) {
		addEventListener('keydown', handleDown);
		handlerAdded = true;
	}

	// Do the binding
	if (bindings[keyCode] === undefined) {
		bindings[keyCode] = [conditions];
	} else {
		bindings[keyCode].push(conditions);
	}
}

function handleDown(e) {
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
