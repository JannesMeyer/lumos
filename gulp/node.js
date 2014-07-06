var spawn = require('child_process').spawn;

var child;
function startNode() {
	process.env.LUMOSPATH = '/Users/jannes/Dropbox/Notes';
	var options = {
		env: process.env,
		stdio: 'inherit'
	};
	child = spawn('./bin/lumos', ['serve'], options);
}
function stopNode() {
	if (child) {
		child.kill();
	}
}
process.on('exit', stopNode);

exports.dep = ['build-js-server'];
exports.fn = function() {
	stopNode();
	startNode();
};


// gulp.task('node-inspector', function() {
// 	childs.node = spawn('node', ['--harmony', '--debug', './bin/lumos', 'serve'], options);
// 	childs.inspector = spawn('node-inspector', { stdio: 'inherit' });
// });