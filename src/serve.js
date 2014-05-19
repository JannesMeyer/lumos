module util from 'util'
module marked from 'marked'

module fs from 'fs'
module denodeify from './denodeify'
let fsStat     = denodeify(fs, fs.stat);
let fsReadDir  = denodeify(fs, fs.readdir);
let fsReadFile = denodeify(fs, fs.readFile);

module cfg from '../config.json'
import { SegmentedPath } from './SegmentedPath'
import { Directory } from './Directory'

module.exports = function(req, res, next) {
	let processedPath = decodeURIComponent(req.path);
	let requestPath = new SegmentedPath(cfg.baseDir, processedPath);
	if (!requestPath.verifyDescendance()) {
	    next(mMakeError(400, 'Bad Request'));
	    return;
	}

	// Prepare data to render
	let data = {
		brandName: cfg.brandName
		// title
		// breadcrumbs
		// items
		// content
	};

	if (requestPath.isDir)
	{
		// Read directory
		return readDir(requestPath)
		.then(dir => {
			data.breadcrumbs = requestPath.makeBreadcrumbs();
			data.items = dir.filteredContents;
			data.title = dir.path.name === '' ? cfg.brandName : dir.path.name;

			// Include index file if available
			if (dir.hasFile(cfg.indexFile)) {
				let indexPath = dir.path.makeDescendant(cfg.indexFile);
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
		requestPathMd.leaf += cfg.mdSuffix;
		requestPathMd.makeFile();
		data.breadcrumbs = requestPathMd.makeBreadcrumbs();

		// Read file
		return readFile(requestPathMd)
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
		// TODO: don't swallow errors in file rendering
		.catch(err => mHTTPError(404, 'File Not Found'));
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
 * Read: https://github.com/chjj/marked/blob/master/README.md
 */
const hljs = require('highlight.js');
marked.setOptions({
		gfm: true,
		breaks: true,
		highlight: (code, lang) => lang ? hljs.highlight(lang, code).value : code
	});
function convertToHtml(content) {
	let md = marked(content);
	// TODO: Fix html
	md = md.replace(/(<table>)/g, '<div class="table-responsive"><table class="table table-hover"></div>');
	// md = md.replace(/(<pre>)/g, '<pre class="hljs">');
	return md;
}

/**
 * Filter function for SegmentedPath objects
 */
function itemFilterFn(item) {
	if (item.isHidden) { return false; }
	if (!item.isDir) {
		if (item.fullName === cfg.indexFile) { return false; }
		if (item.extension !== cfg.mdSuffix) { return false; }
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