String.prototype.startsWith = function(search) {
	// no type checking or null checking
	return this.length >= search.length && this.slice(0, search.length) === search;
}
String.prototype.endsWith = function(search) {
	// no type checking or null checking
	return this.length >= search.length && this.slice(this.length - search.length) === search;
}