var debug = require('../src/lib/debug')(undefined, { showStack: true });

var serve = require('./cmd-serve');
var view = require('./cmd-view');
var edit = require('./cmd-edit');
var diary = require('./cmd-diary');
var search = require('./cmd-search');

var commands = {
	serve,
	view,
	edit,
	diary,
	search
};

function getHelp() {
	return 'usage: lumos <command> [<args>]\n'
	     + '\n'
	     + 'Available commands:\n'
	     + '   ' + Object.keys(commands).join('\n   ');
}

// Main
var args = process.argv.slice(2);
var commandPath = commands[args.shift()];

if (commands.hasOwnProperty(commandPath)) {
	// Execute command
	commands[commandPath].cmd(args);
} else {
	console.log(getHelp());
}