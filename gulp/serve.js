var server;

function clearProperties(object) {
	Object.getOwnPropertyNames(object).forEach(function(property) {
		delete object[property];
	});
}

exports.dep = ['build-js-server'];
exports.fn = function() {
	if (server) {
		server.close();
		clearProperties(require.cache);
	}

	var startServer = require('../dist/server-main');
	var config = require('../package.json').config;
	var options = {
		directory: '/Users/jannes/Dropbox/Notes',
		port: config.defaultPort
	};
	server = startServer(options);
};