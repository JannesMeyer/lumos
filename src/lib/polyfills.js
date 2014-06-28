// no type checking or null checking
String.prototype.startsWith = function(search) {
	return this.length >= search.length && this.slice(0, search.length) === search;
}

// no type checking or null checking
String.prototype.endsWith = function(search) {
	return this.length >= search.length && this.slice(this.length - search.length) === search;
}