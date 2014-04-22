'use strict';

let Promise = require('es6-promise').Promise;

// Convert node.js async functions into Promises
module.exports = function denodeify(thisArg, nodeFn) {
	return function() {
		let args = Array.prototype.slice.call(arguments);
		return new Promise(function(resolve, reject) {
			args.push(function callback(err, data) {
				if (err) {
					reject(new Error(err));
				} else {
					resolve(data);
				}
			});
			nodeFn.apply(thisArg, args);
		});
	};
};