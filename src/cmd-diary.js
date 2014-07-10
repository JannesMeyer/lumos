module Promise from 'bluebird';
var fs = Promise.promisifyAll(require('fs'));
module path from 'path';
module childProcess from 'child_process';
module dateTool from './lib/date-tool';
import { config } from '../package.json';

function isDefined(value) {
	return value !== undefined;
}

function editor(files) {
	if (files === undefined) {
		files = [];
	}
	// console.log(config.editorArgs.concat(files));
	childProcess.spawn(config.editor, config.editorArgs.concat(files), { stdio: 'inherit' });
}

function createFiles(files) {
	// TODO: create recursively
	// https://www.npmjs.org/package/mkdirp

	return Promise.all(files.map(f => {
			var dir = path.dirname(f);

			return fs.statAsync(dir)
			.then(stat => {
				if (stat.isFile()) {
					throw new Error('Found a file instead of a directory');
				}
			}, err => {
				// TODO: Does fs.statAsync throw if the directory doesn't exist?
				return fs.mkdirAsync(dir);
			});
		}
	));
}

export function cmd(args) {
	if (args.length === 0) {
		var days = [dateTool.today()];
	} else {
		var days = args.map(day => {
			return dateTool.parseIsoDate(day)
		});
	}

	// Convert to paths
	var files = days.map(d => {
		var fileName = dateTool.getMonthName(d) + ' ' + d.day + config.mdSuffix;
		var filePath = path.join(config.diaryBaseDir, d.year.toString(), d.month.toString(), fileName);
		return filePath;
	});

	// Open the files in an editor
	createFiles(files)
	.then(() => {
		// TODO: respect errors
		editor(files);
	});
}