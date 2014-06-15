var loaderUtils = require('loader-utils');
var transform = require('jstransform').transform;


// visitors = visitors.concat.apply(visitors, arrays);

// TODO: this style requires esprima-fb as a dev dependency
var visitors = [];
[
	require('es6-module-jstransform').visitorList,
	require('jstransform/visitors/es6-arrow-function-visitors').visitorList,
	require('jstransform/visitors/es6-object-concise-method-visitors.js').visitorList,
	require('jstransform/visitors/es6-class-visitors').visitorList,
	require('jstransform/visitors/es6-object-short-notation-visitors').visitorList,
	require('jstransform/visitors/es6-rest-param-visitors').visitorList,
	require('jstransform/visitors/es6-template-visitors').visitorList,
	require('./visitors/react').visitorList,
	require('./visitors/reactDisplayName').visitorList,
	require('es6-destructuring-jstransform').visitorList
].forEach(function(visitor) {
	visitors = visitors.concat(visitor);
});

module.exports = function(source) {
	this.cacheable();

	var query = loaderUtils.parseQuery(this.query);
	if (query.jsx) {
		source = '/** @jsx React.DOM */' + source;
	}

	var es5 = transform(visitors, source); // { sourceMap: true, filename: 'source.js' }

	return es5.code;
};