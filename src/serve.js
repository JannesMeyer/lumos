module util from 'util'
module marked from 'marked'
module path from 'path'
module fs from 'fs'
module denodeify from './denodeify'

module layout from './templates/layout'


import { config } from '../package.json'
import { SegmentedPath } from './SegmentedPath'
import { Directory } from './Directory'

var fsStat     = denodeify(fs, fs.stat);
var fsReadDir  = denodeify(fs, fs.readdir);
var fsReadFile = denodeify(fs, fs.readFile);

var baseDir = process.env.LUMOSPATH || process.cwd(); // Default to current working directory
var baseDirName = path.basename(baseDir);


function handleRequest(req, res, next) {
	var processedPath = decodeURIComponent(req.path);
	var requestPath = new SegmentedPath(baseDir, [processedPath]);
	if (!requestPath.verifyDescendance()) {
	    next(mMakeError(400, 'Bad Request'));
	    return;
	}

	// Prepare data to render
	var data = {
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
			if (dir.hasFile(config.indexFile)) {
				dir.removeFile(config.indexFile);
				var indexPath = dir.path.makeDescendant(config.indexFile);
				return readFile(indexPath)
				.then(file => {
					data.filePath = indexPath.absolute;
					// Can't have spaces or quotes in AppleScript
					data.editURL = encodeURI(config.editURLProtocol + indexPath.absolute).replace(/'/g, '%27');
					data.content = fileContentToHtml(file.content);
				});
			}
		}/*, err => {
			// TODO: act accordingly based on error type (ENOENT)
			throw mHTTPError(404, 'Directory Not Found');
		}*/)
		.then(() => {
			var acceptHeader = req.get('Accept');
			if (acceptHeader === 'application/json') {
				res.set({
					'Content-Type': 'application/json',
					'Vary': 'Accept'
				});
				res.json(data);
			} else {
				res.end(layout.render(data));
				// res.render('document', data);
			}
		})
		.catch(err => next(err));
	} else {
		requestPath.makeFile();
		var requestPathMd = requestPath.makeClone();
		requestPathMd.setLeaf(requestPathMd.getLeaf() + config.mdSuffix);
		requestPathMd.makeFile();
		data.breadcrumbs = requestPathMd.makeBreadcrumbs();

		// Read file
		return readFile(requestPathMd)
		.then(file => {
			data.title = requestPathMd.name;
			data.filePath = requestPathMd.absolute;
			// Can't have spaces or quotes in AppleScript
			data.editURL = encodeURI(config.editURLProtocol + requestPathMd.absolute).replace(/'/g, '%27');
			data.content = fileContentToHtml(file.content);

			var datetool = require('./lib/date-tool');
			var creationDate = datetool.dateInCustomFormat(file.stat.birthtime);
			data.creationDate = datetool.dayAsString(creationDate);
			data.creationTime = '';

			// Read directory
			return readDir(requestPathMd.makeParent())
			.then(dir => {
				dir.removeFile(config.indexFile);
				data.items = dir.files;
				data.dirs = dir.dirs;

				// Find active file
				var activeItem;
				for (var i = 0; i < data.items.length; ++i) {
					var item = data.items[i];
					// TODO: make this a normalized representation,
					// so that there can be no mistake between
					// folders and files
					item.isActive = item.absolute === requestPathMd.absolute;
					if (item.isActive) {
						activeItem = i;
						item.link = path.dirname(item.link);
					}
				}
				var prevItem = activeItem - 1;
				if (prevItem >= 0) {
					data.prevItem = data.items[prevItem];
				}
				var nextItem = activeItem + 1;
				if (nextItem < data.items.length) {
					data.nextItem = data.items[nextItem];
				}
			})
			.then(() => {
				var acceptHeader = req.get('Accept');
				if (acceptHeader === 'application/json') {
					res.set({
						'Content-Type': 'application/json',
						'Vary': 'Accept'
					});
					res.json(data);
				} else {
					// res.render('document', data);
					res.end(layout.render(data));
				}
			})
			.catch(err => next(err));
		}, err => {
			console.error(err);
			// Document not found, try to deliver the file at the original path
			return denodeify(res, res.sendfile)(requestPath.absolute);
		})
		.catch(err => {
			next(err);
			// console.error(err);
			// next(mHTTPError(404, 'File Not Found'));
		});
	}
}

function readDir(dirPath) {
	var dir = new Directory(dirPath);

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
var hljs = require('highlight.js');
marked.setOptions({
		gfm: true,
		breaks: true,
		highlight: (code, lang) => lang ? hljs.highlight(lang, code).value : code
	});
function fileContentToHtml(content) {
	var md = marked(content);
	// TODO: Fix html
	md = md.replace(/(<table>)/g, '<div class="table-responsive"><table class="table table-hover"></div>');
	// md = md.replace(/(<pre>)/g, '<pre class="hljs">');
	return md;
}

/**
 * Shorthand to create an Error object with a status code
 */
function mHTTPError(status, message) {
	var error = new Error(message);
	error.status = status;
	return error;
}

module.exports = handleRequest;



/*
var data = { baseDirName: 'Notes',
    breadcrumbs: [ { name: 'Notes', path: '/', isActive: false } ],
    title: 'Google',
    filePath: '/Users/jannes/Dropbox/Notes/Google.md',
    editURL: 'lumos-connect:///Users/jannes/Dropbox/Notes/Google.md',
    content: '<h1 id="list-of-google-searches-to-carry-out">List of Google searches to carry out</h1>\n<ul>\n<li>Konkurrenz von Mobilinga<ul>\n<li>Repetico</li>\n<li><a href="http://www.phase-6.com/">Phase 6</a></li>\n<li><a href="http://babbel.com/">Babbel</a></li>\n</ul>\n</li>\n<li>OmniFocus 2</li>\n</ul>\n',
    creationDate: '24.05.2014',
    creationTime: '',
    items:
     [ { absolute: '/Users/jannes/Dropbox/Notes/Bookmarks.md',
         relative: 'Bookmarks.md',
         name: 'Bookmarks',
         link: 'Bookmarks',
         isActive: false },
       { absolute: '/Users/jannes/Dropbox/Notes/Find launch items.md',
         relative: 'Find launch items.md',
         name: 'Find launch items',
         link: 'Find%20launch%20items',
         isActive: false },
       { absolute: '/Users/jannes/Dropbox/Notes/Finds.md',
         relative: 'Finds.md',
         name: 'Finds',
         link: 'Finds',
         isActive: false },
       { absolute: '/Users/jannes/Dropbox/Notes/Google.md',
         relative: 'Google.md',
         name: 'Google',
         link: '.',
         isActive: true },
       { absolute: '/Users/jannes/Dropbox/Notes/Lumos.md',
         relative: 'Lumos.md',
         name: 'Lumos',
         link: 'Lumos',
         isActive: false },
       { absolute: '/Users/jannes/Dropbox/Notes/OSX TODO.md',
         relative: 'OSX TODO.md',
         name: 'OSX TODO',
         link: 'OSX%20TODO',
         isActive: false },
       { absolute: '/Users/jannes/Dropbox/Notes/Snippets.md',
         relative: 'Snippets.md',
         name: 'Snippets',
         link: 'Snippets',
         isActive: false },
       { absolute: '/Users/jannes/Dropbox/Notes/TabAttack.md',
         relative: 'TabAttack.md',
         name: 'TabAttack',
         link: 'TabAttack',
         isActive: false },
       { absolute: '/Users/jannes/Dropbox/Notes/TV and Movies.md',
         relative: 'TV and Movies.md',
         name: 'TV and Movies',
         link: 'TV%20and%20Movies',
         isActive: false } ],
    dirs:
     [ { absolute: '/Users/jannes/Dropbox/Notes/Archive',
         relative: 'Archive',
         link: 'Archive/' },
       { absolute: '/Users/jannes/Dropbox/Notes/Computer',
         relative: 'Computer',
         link: 'Computer/' },
       { absolute: '/Users/jannes/Dropbox/Notes/GTD',
         relative: 'GTD',
         link: 'GTD/' },
       { absolute: '/Users/jannes/Dropbox/Notes/Learning',
         relative: 'Learning',
         link: 'Learning/' },
       { absolute: '/Users/jannes/Dropbox/Notes/Material',
         relative: 'Material',
         link: 'Material/' },
       { absolute: '/Users/jannes/Dropbox/Notes/Programming',
         relative: 'Programming',
         link: 'Programming/' },
       { absolute: '/Users/jannes/Dropbox/Notes/Tagebuch',
         relative: 'Tagebuch',
         link: 'Tagebuch/' },
       { absolute: '/Users/jannes/Dropbox/Notes/Temporary',
         relative: 'Temporary',
         link: 'Temporary/' } ],
    prevItem:
     { absolute: '/Users/jannes/Dropbox/Notes/Finds.md',
       relative: 'Finds.md',
       link: 'Finds' },
    nextItem:
     { absolute: '/Users/jannes/Dropbox/Notes/Lumos.md',
       relative: 'Lumos.md',
       link: 'Lumos' } };

*/