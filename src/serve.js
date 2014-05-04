// If you want your file lists to sort correctly you have to compile Node.js with libicu i18n support.

module util from 'util'
module marked from 'marked'

module fs from 'fs'
module denodeify from './denodeify'
let fsStat     = denodeify(fs, fs.stat);
let fsReadDir  = denodeify(fs, fs.readdir);
let fsReadFile = denodeify(fs, fs.readFile);

import { SegmentedPath } from './SegmentedPath'
import { Directory } from './Directory'

let settings = {
	brandName: 'Notes',
	root: '/Users/jannes/Dropbox/Notes', // __dirname
	mdSuffix: '.md',
	indexFile: 'index.md',
	markedOptions: { gfm: true, breaks: true }
};

// Read: https://github.com/chjj/marked/blob/master/README.md

module.exports = function(req, res, next) {
	let requestPath = new SegmentedPath(settings.root, decodeURIComponent(req.path));
	if (!requestPath.verifyDescendance()) {
	    next(mMakeError(400, 'Bad Request'));
	    return;
	}

	// Prepare data to render
	let data = {
		brandName: settings.brandName
		// title
		// breadcrumbs
		// items
		// content
	};

	let dirPromise;
	let docPromise;

	if (requestPath.isDir)
	{
		data.breadcrumbs = requestPath.makeBreadcrumbs();

		// Read directory
		dirPromise = readDir(requestPath)
		.then(dir => {
			data.items = dir.filteredContents;
			data.title = dir.path.name === '' ? settings.brandName : dir.path.name;

			// Include index file if available
			if (dir.hasFile(settings.indexFile)) {
				let indexPath = dir.path.makeDescendant(settings.indexFile);
				return readFile(indexPath)
				.then(content => {
					data.content = convertToHtml(content);
				});
			}
		}, err => {
			throw mHTTPError(404, 'Directory Not Found');
		});
	} else {
		requestPath.leaf += settings.mdSuffix;
		requestPath.makeFile();
		data.breadcrumbs = requestPath.makeBreadcrumbs();

		// Read file
		docPromise = readFile(requestPath)
		.then(content => {
			data.content = convertToHtml(content);
			data.title = requestPath.name;

			return readDir(requestPath.makeParent());
		}, err => {
			throw mHTTPError(404, 'File Not Found');
		})
		.then(dir => {
			data.items = dir.filteredContents;

			// Find active file
			for (let item of data.items) {
				// TODO: make this a normalized representation,
				// so that there can be no mistake between
				// folders and files
				item.isActive = !item.isDir && item.absolute === requestPath.absolute;
			}
		});
	}

	// Wait for data and render it
	Promise.all([dirPromise, docPromise])
	.then(() => {
		res.render('document', data);
	})
	.catch(err => next(err));
}

function readDir(dirPath) {
	let dir = new Directory(dirPath);

	return fsStat(dirPath.absolute)
	.then(stat => {
		if (!stat.isDirectory()) {
			throw new Error('Is a file');
		}
		// TODO: make readContents a lazy-loading getter
		return dir.readContents();
	})
	.then(content => {
		dir.filter(itemFilterFn);
		return dir;
	});
}

function readFile(filePath) {
	return fsStat(filePath.absolute)
	.then(stat => {
		if (stat.isDirectory()) {
			throw new Error('Is a directory');
		}
		return fsReadFile(filePath.absolute, { encoding: 'utf-8' });
	});
}

/**
 * This function is used to convert the plain text to HTML
 */
function convertToHtml(content) {
	return marked(content, settings.markedOptions);
}

/**
 * Filter function for SegmentedPath objects
 */
function itemFilterFn(item) {
	if (item.isHidden) { return false; }
	if (!item.isDir) {
		if (item.fullName === settings.indexFile) { return false; }
		if (item.extension !== settings.mdSuffix) { return false; }
	}
	return true;
}

/**
 * Shorthand to create an Error object with a status code
 */
function mHTTPError(status, message) {
	let error = new Error(message);
	error.status = status;
	return error;
}