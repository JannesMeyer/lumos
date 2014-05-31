module util from 'util'
module marked from 'marked'
module path from 'path'
module fs from 'fs'
module denodeify from './denodeify'
let fsStat     = denodeify(fs, fs.stat);
let fsReadDir  = denodeify(fs, fs.readdir);
let fsReadFile = denodeify(fs, fs.readFile);

module cfg from '../config.json'
import { SegmentedPath } from './SegmentedPath'
import { Directory } from './Directory'

const baseDir = process.env.LUMOSPATH || process.cwd(); // Default to current working directory
const baseDirName = path.basename(baseDir);

function padZero(number) {
	let str = number.toString();
	return str.length < 2 ? '0' + str : str;
}

module.exports = function(req, res, next) {
	let processedPath = decodeURIComponent(req.path);
	let requestPath = new SegmentedPath(baseDir, processedPath);
	if (!requestPath.verifyDescendance()) {
	    next(mMakeError(400, 'Bad Request'));
	    return;
	}

	// Prepare data to render
	let data = {
		baseDirName: baseDirName
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
			data.items = dir.files;
			data.dirs = dir.dirs;
			data.title = dir.path.name === '' ? baseDirName : dir.path.name;
			if (dir.files.length > 0) {
				data.nextItem = dir.files[0];
			}
			// Include index file if available
			if (dir.hasFile(cfg.indexFile)) {
				dir.removeFile(cfg.indexFile);
				let indexPath = dir.path.makeDescendant(cfg.indexFile);
				return readFile(indexPath)
				.then(file => {
					data.filePath = indexPath.absolute;
					data.content = fileContentToHtml(file.content);
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
		.then(file => {
			data.title = requestPathMd.name;
			data.filePath = requestPathMd.absolute;
			data.content = fileContentToHtml(file.content);

			let c = file.stat.birthtime;
			// data.creationDate = `${padZero(c.getDate())}.${padZero(c.getMonth() + 1)}.${c.getFullYear()}`;
			data.creationDate = `${cfg.monthNames[c.getMonth()]} ${c.getDate()}, ${c.getFullYear()}`;
			data.creationTime = `${padZero(c.getHours())}:${padZero(c.getMinutes())}`;

			// Read directory
			return readDir(requestPathMd.makeParent())
			.then(dir => {
				dir.removeFile(cfg.indexFile);
				data.items = dir.files;
				data.dirs = dir.dirs;

				// Find active file
				let activeItem;
				for (let i = 0; i < data.items.length; ++i) {
					let item = data.items[i];
					// TODO: make this a normalized representation,
					// so that there can be no mistake between
					// folders and files
					item.isActive = item.absolute === requestPathMd.absolute;
					if (item.isActive) {
						activeItem = i;
						item.link = path.dirname(item.link);
					}
				}
				let prevItem = activeItem - 1;
				if (prevItem >= 0) {
					data.prevItem = data.items[prevItem];
				}
				let nextItem = activeItem + 1;
				if (nextItem < data.items.length) {
					data.nextItem = data.items[nextItem];
				}
			})
			.then(() => res.render('document', data))
			.catch(err => next(err));
		}, err => {
			console.error(err);
			// Document not found, try to deliver the file at the original path
			return denodeify(res, res.sendfile)(requestPath.absolute);
		})
		.catch(err => {
			console.error(err);
			next(mHTTPError(404, 'File Not Found'));
		});
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
	});
}

function readFile(filePath) {
	return fsStat(filePath.absolute)
	.then(stat => {
		if (stat.isDirectory()) {
			throw new Error('Is a directory');
		}
		return fsReadFile(filePath.absolute, { encoding: 'utf-8' })
		.then(content => ({ stat, content }));
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
function fileContentToHtml(content) {
	let md = marked(content);
	// TODO: Fix html
	md = md.replace(/(<table>)/g, '<div class="table-responsive"><table class="table table-hover"></div>');
	// md = md.replace(/(<pre>)/g, '<pre class="hljs">');
	return md;
}

/**
 * Shorthand to create an Error object with a status code
 */
function mHTTPError(status, message) {
	let error = new Error(message);
	error.status = status;
	return error;
}