if (typeof document !== 'undefined') {
	var html = document.documentElement;
	var body = document.body;
}

export function isAtTop() {
	// Not part of any standard:
	return window.scrollY <= 0;
	// return (body.scrollTop || html.scrollTop) <= 0;
}

// TODO: this cannot determined accurately until the document has finished loading
export function isAtBottom() {
	return html.scrollHeight - html.clientHeight - window.scrollY <= 0;
}

export function isAtElement(element) {
	if (!element) {
		return false;
	}
	var elemRect = element.getBoundingClientRect();
	var bodyRect = body.getBoundingClientRect();
    return window.scrollY === Math.round(elemRect.top - bodyRect.top);
}

export function ifAtTop(fn) {
	return function() {
		if (isAtTop()) {
			fn.apply(undefined, arguments);
		}
	};
}

export function ifAtBottom(fn) {
	return function() {
		if (isAtBottom()) {
			fn.apply(undefined, arguments);
		}
	};
}

export function to(y) {
	if (y === 0 && isAtTop()) {
		return;
	}
	// Not part of any standard:
	window.scroll(0, y);
	// html.scrollTop = y;
	// body.scrollTop = y;
}

export function toElement(el) {
	el.scrollIntoView(true);
}