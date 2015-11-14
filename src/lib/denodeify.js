/**
 * Converts node's async functions into Promises
 */
export default function denodeify(thisArg, nodeFn) {
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
