/**
 * Visitors orignally from:
 *
 * - [es6-module-jstransform][1]
 * - [es6-destructuring-jstransform][2]
 * - [react, reactDisplayName, xjs][3]
 *
 * [1]: https://github.com/andreypopp/es6-module-jstransform/blob/639fe364f6a3bc1de87d2d3edf5b0dd682b3289b/visitors.js
 * [2]: https://github.com/andreypopp/es6-destructuring-jstransform/blob/aad316ca16b714e9ae614fe81f3c216b9bdb2209/visitors.js
 * [3]: https://github.com/facebook/react/tree/0f7423f31d2f0aaee1c23ed1d86cab66f0dca01e/vendor/fbtransform/transforms
 */

exports.visitorList = Array.prototype.concat.apply([], [
	require('jstransform/visitors/es6-arrow-function-visitors').visitorList,
	require('jstransform/visitors/es6-object-concise-method-visitors.js').visitorList,
	require('jstransform/visitors/es6-class-visitors').visitorList,
	require('jstransform/visitors/es6-object-short-notation-visitors').visitorList,
	require('jstransform/visitors/es6-rest-param-visitors').visitorList,
	require('jstransform/visitors/es6-template-visitors').visitorList,
	require('./visitors/es6-module-jstransform').visitorList,
	require('./visitors/es6-destructuring-jstransform').visitorList,
	require('./visitors/react').visitorList,
	require('./visitors/reactDisplayName').visitorList
]);