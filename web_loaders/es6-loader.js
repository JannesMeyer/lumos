'use strict';
var transform = require('jstransform').transform;
var visitors = require('../mytransform').visitorList;

module.exports = function(source) {
	this.cacheable();

	return transform(visitors, source).code; // { sourceMap: true, filename: 'source.js' }
};