// TODO: lazy-loading of denodified functions

// Convert node.js async functions into Promises
module.exports = function denodeify(thisArg, nodeFn) {
	return function() {
		var args = Array.prototype.slice.call(arguments);
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