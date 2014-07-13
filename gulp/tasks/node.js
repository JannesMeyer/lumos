var server;

function killServer() {
	if (server) {
		server.kill();
	}
}

exports.dep = ['build-js-server'];
exports.fn = function() {
	var child_process = require('child_process');

	killServer();

	var dir = '/Users/jannes/Dropbox/Notes';
	server = child_process.spawn(require.resolve('../../bin/lumos'), ['serve'], {
		cwd: dir,
		stdio: ['ignore', 'inherit', 'inherit']
	});
};
process.on('exit', killServer);

// gulp.task('node-inspector', function() {
// 	childs.node = spawn('node', ['--harmony', '--debug', './bin/lumos', 'serve'], options);
// 	childs.inspector = spawn('node-inspector', { stdio: 'inherit' });
// });