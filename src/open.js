module child_process from 'child_process'
module fs from 'fs'
module path from 'path'

module denodeify from './denodeify';
const fsStat = denodeify(fs, fs.stat);

// Config
// const settings = {
// };
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const baseDir = '/Users/jannes/Dropbox/Notes/Tagebuch';
const mdSuffix = '.md';
const editor = 'subl';
const editorArgs = ['--project', '/Users/jannes/Dropbox/Notes/notes.sublime-project'];

function ignoreUndefined(value) {
	return value !== undefined;
}

function mkdir(dirName) {
	// TODO: create recursively
	console.log(`Creating directory '${dirName}'`);
	fs.mkdirSync(dirName);
}

function openFiles(...days) {
	let files = days.map(function(day) {
		let year = day.getFullYear().toString();
		let month = (day.getMonth() + 1).toString();

		// Generate paths
		let dirName = path.join(baseDir, year, month);
		let fileName = months[day.getMonth()] + ' ' + day.getDate() + mdSuffix;
		let filePath = path.join(dirName, fileName);

		// Make sure the directory exists
		try {
			let stat = fs.statSync(dirName);
			if (stat.isFile()) {
				console.error('Found a file instead of a directory');
				return;
			}
		} catch(e) {
			try {
				mkdir(dirName);
			} catch(e2) {
				console.error(e2.message);
				return;
			}
		}

		return filePath;
	})
	.filter(ignoreUndefined);

	// Stop, if there are no files left
	if (files.length === 0) {
		return;
	}

	// Otherwise, open sublime text
	console.log('Opening files...\n' + files.join('\n'));
	let args = new Array(...editorArgs, ...files);
	child_process.spawn(editor, args);
}


const dateRegex1 = /^([\d]{1,4})-([\d]{1,2})-([\d]{1,2})$/;
const dateRegex2 = /^([\d]{1,2})-([\d]{1,2})$/;
const dateRegex3 = /^([\d]{1,2})$/;
function parseIsoDate(dateStr) {
	let result = dateRegex1.exec(dateStr);
	if (result) {
		let y = result[1];
		let m = result[2] - 1;
		let d = result[3];
		return new Date(y, m, d);
	}
	let date = new Date();
	result = dateRegex2.exec(dateStr);
	if (result) {
		date.setMonth(result[1] - 1);
		date.setDate(result[2]);
		return date;
	}
	result = dateRegex3.exec(dateStr);
	if (result) {
		date.setDate(result[1]);
		return date;
	}
}

module.exports = function(args) {
	if (args.length === 0) {
		openFiles(new Date());
	} else {
		let days = [];
		args.forEach(function(arg) {
			// Try to parse each argument as a date
			let day = parseIsoDate(arg);
			if (day !== undefined) {
				days.push(day);
			} else {
				console.log('could not parse date');
			}
		});
		openFiles(...days);
	}
}