var html = document.documentElement;
var body = document.body;


export function isAtTop() {
	// var scrollY = document.body.scrollTop || document.documentElement.scrollTop;
	return window.scrollY <= 0;
}

// TODO: this cannot determined accurately until the document has finished loading
export function isAtBottom() {
	// Don't work well with html and body at 100% height:
	// html.getBoundingClientRect()
	// html.getClientRects()

	return html.scrollHeight - html.clientHeight - window.scrollY <= 0;
}

export function ifAtTop(callback) {
	return function(event) {
		if (isAtTop()) {
			callback(event);
		}
	};
}

export function ifAtBottom(callback) {
	return function(event) {
		if (isAtBottom()) {
			callback(event);
		}
	};
}