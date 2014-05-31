module fs from 'fs'
module path from 'path'
import { spawn } from 'child_process'

module denodeify from './denodeify';
const fsStat = denodeify(fs, fs.stat);
const fsMkdir = denodeify(fs, fs.mkdir);
module cfg from '../config.json'

function isDefined(value) {
	return value !== undefined;
}

function openFiles(files) {
	Promise.all(files.map(file => {
		var dir = path.dirname(file);
		// Make sure the directory exists
		return fsStat(dir)
		.then(stat => {
			if (stat.isFile()) {
				throw new Error('Found a file instead of a directory');
			}
		}, err => {
			console.log(`Creating directory '${dir}'`);
			// TODO: create recursively
			// https://www.npmjs.org/package/mkdirp
			return fsMkdir(dir);
		});
	}))
	.then(() => {
		for (var file of files) {
			console.log(`Opening '${file}'`);
		}
		// Open editor
		spawn(cfg.editor, [...cfg.editorArgs, ...files], { stdio: 'inherit' });
	});
}

/**
 * Well, this actually doesn't adhere to the standard at all, because
 * it allows the omission of the year to mean the current year.
 * (or the omission of the current year and month)
 * It also doesn't check if the month and the day are within reasonable
 * bounds.
 */
const dateRegex = /^(?:(?:([\d]{4})-)?(0?[1-9]|1[0-2])-)?(0?[1-9]|[12][0-9]|3[01])$/;
function parseIso8601Date(dateStr) {
	var result = dateRegex.exec(dateStr);
	if (result) {
		var date = new Date();
		if (result[1]) { date.setFullYear(result[1]); }
		if (result[2]) { date.setMonth(result[2] - 1); }
		date.setDate(result[3]);
		return date;
	}
}

export function openDiary(days) {
	// Collect Date objects
	if (days.length === 0) {
		days.push(new Date());
	} else {
		days = days.map(day => parseIso8601Date(day));
		if (!days.every(isDefined)) {
			throw new Error("Couldn't parse all dates");
		}
	}

	// Convert to paths
	let files = days.map(day => path.join(cfg.diaryBaseDir,
		`${day.getFullYear()}`,
		`${day.getMonth() + 1}`,
		`${cfg.monthNames[day.getMonth()]} ${day.getDate()}${cfg.mdSuffix}`));

	// Open the files in an editor
	openFiles(files);
}

export function openExistingFile(file) {
	fsStat(file)
	.then(stat => {
		// Open editor
		spawn(cfg.editor, [file], { stdio: 'inherit' });
	})
	.catch(err => {
		console.error('File not found');
	});
}