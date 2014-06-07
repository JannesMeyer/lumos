var child;
function startNode() {
	var spawn = require('child_process').spawn;

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

module.exports.fn = function() {
	stopNode();
	startNode();
};
process.on('exit', stopNode);


// gulp.task('node-inspector', function() {
// 	childs.node = spawn('node', ['--harmony', '--debug', './bin/lumos', 'serve'], options);
// 	childs.inspector = spawn('node-inspector', { stdio: 'inherit' });
// });