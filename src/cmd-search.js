import { execFile } from 'child_process';
// import minimist from 'minimist';
import search from './lib/search-spotlight';
import debug from './lib/debug';

export function cmd(args) {
	// var argv = minimist(args);
	// if (argv._.length === 0) {
	// 	throw new Error('Not enough arguments');
	// }

	var directory = '/Users/jannes/Dropbox/Notes';

	search(directory, args)
	.then(results => {
		console.timeEnd('command');
		debug(results.slice(0, 10));
	})
	.catch(debug);
}