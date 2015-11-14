import serve from './cmd-serve';
import view from './cmd-view';
import edit from './cmd-edit';
import diary from './cmd-diary';
import search from './cmd-search';

const commands = { serve, view, edit, diary, search };

// Take first argument
let args = process.argv.slice(2);
let command = args.shift();

if (commands.hasOwnProperty(command)) {
	// Execute command
	commands[command](args);
} else {
	// Show help
	console.log('Usage: lumos <command> [<args>]\n');
	console.log('Available commands:');
	console.log('   ' + Object.keys(commands).join('\n   '));
}