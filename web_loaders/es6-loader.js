var loaderUtils = require('loader-utils');
var transform = require('jstransform').transform;
var visitors = require('../mytransform').visitorList;

module.exports = function(source) {
	this.cacheable();

	var query = loaderUtils.parseQuery(this.query);
	if (query.jsx) {
		source = '/** @jsx React.DOM */' + source;
	}

	var es5 = transform(visitors, source); // { sourceMap: true, filename: 'source.js' }
	return es5.code;
};