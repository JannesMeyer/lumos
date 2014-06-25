var html = document.documentElement;
var body = document.body;

export function isAtTop() {
	// var scrollY = body.scrollTop || html.scrollTop;
	return window.scrollY <= 0;
}

// TODO: this cannot determined accurately until the document has finished loading
export function isAtBottom() {
	// Don't work well with html and body at 100% height:
	// html.getBoundingClientRect()
	// html.getClientRects()

	return html.scrollHeight - html.clientHeight - window.scrollY <= 0;
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