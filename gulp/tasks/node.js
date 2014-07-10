var debug, startServer, config, server;

function importModules() {
	debug = require('../../dist/lib/debug');
	debug.filename = __filename;
	startServer = require('../../dist/server-main');
	config = require('../../package.json').config;
}

function forgetModules() {
	clearProperties(require.cache);
}

function clearProperties(object) {
	Object.getOwnPropertyNames(object).forEach(function(property) {
		delete object[property];
	});
}

exports.dep = ['build-js-server'];
exports.fn = function() {
	if (server) {
		server.close();
		forgetModules();
	}

	try {
		importModules();
		server = startServer({
			directory: '/Users/jannes/Dropbox/Notes',
			port: config.defaultPort
		});
	} catch(err) {
		debug(err);
	}

};