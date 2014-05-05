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

	if (requestPath.isDir)
	{
		// Read directory
		readDir(requestPath)
		.then(dir => {
			data.breadcrumbs = requestPath.makeBreadcrumbs();
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
		})
		.then(() => res.render('document', data))
		.catch(err => next(err));
	} else {
		requestPath.makeFile();
		let requestPathMd = requestPath.makeClone();
		requestPathMd.leaf += settings.mdSuffix;
		requestPathMd.makeFile();
		data.breadcrumbs = requestPathMd.makeBreadcrumbs();

		// Read file
		readFile(requestPathMd)
		.then(content => {
			data.content = convertToHtml(content);
			data.title = requestPathMd.name;

			// Read directory
			return readDir(requestPathMd.makeParent())
			.then(dir => {
				data.items = dir.filteredContents;

				// Find active file
				for (let item of data.items) {
					// TODO: make this a normalized representation,
					// so that there can be no mistake between
					// folders and files
					item.isActive = !item.isDir && item.absolute === requestPathMd.absolute;
					// TODO: re-implement path
					if (item.isActive) {
						// strip filename
						let path = require('path');
						item.link = path.dirname(item.link);
					}
				}
			})
			.then(() => res.render('document', data))
			.catch(err => next(err));
		}, err => {
			// Document not found, try to deliver the file at the original path
			let send = denodeify(res, res.sendfile);
			return send(requestPath.absolute);
		})
		.catch(err => next(mHTTPError(404, 'File Not Found')));
	}
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