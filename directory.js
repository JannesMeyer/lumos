'use strict';

let fs = require('fs');
let path = require('path');
let util = require('util');
let marked = require('marked');
let denodeify = require('./denodeify');
let Promise = require('es6-promise').Promise;

// Convert async functions
let FS = {
	stat: denodeify(fs, fs.stat),
	readDir: denodeify(fs, fs.readdir),
	readFile: denodeify(fs, fs.readFile)
};

// Helpers
function startsWith(str, search) {
	// no type checking or null checking
	return str.length >= search.length && str.slice(0, search.length) === search;
}
function endsWith(str, search) {
	// no type checking or null checking
	return str.length >= search.length && str.slice(str.length - search.length) === search;
}

// Main
let Directory = {

	settings: {
		root: path.join(__dirname, 'markdown'),
		mdSuffix: '.md'
	},

	viewDirectory: function(res, next, dirPath) {
		let settings = this.settings;
		let indexFile = 'index' + settings.mdSuffix;

		// Read directory contents
		let dirContent;
		FS.readDir(dirPath)
		.then(function(_dirContent) {
			// Remove hidden files/directoies
			dirContent = _dirContent.filter(function(name) {
				return !startsWith(name, '.');
			});

			// let promises = [];
			// for (let i = 0; i < dirContent.length; ++i) {
			// 	promises.push(FS.stat(path.join(dirPath, dirContent[i])));
			// }
			return Promise.all(dirContent.map(function(name) {
				return FS.stat(path.join(dirPath, name));
			}));


			// && name !== indexFile
			// dirContent = dirContent.map(function(file) {
			// 	return path.basename(file, settings.mdSuffix);
			// });

			// let data = {};
			// data.title = path.basename(dirPath);
			// data.path = dirPath;
			// data.files = dirContent;
			// res.render('directory', data);
		})
		.then(function(stats) {
			res.end(util.inspect(stats));
			// let files = [];
			// let directories = [];
		})
		.catch(function(err) {
			next(err);
		});
	},

	viewFile: function(res, next, filePath) {
		let settings = this.settings;

		FS.readFile(filePath, { encoding: 'utf-8' })
		.then(function(content) {
			let data = {};
			data.title = path.basename(filePath, settings.mdSuffix);
			data.content = marked(content)
			res.render('document', data);
		})
		.catch(function(err) {
			next(err);
		});
	}

};



// Find path
module.exports = function(req, res, next) {
	let settings = Directory.settings;
	let absPath = path.join(settings.root, req.path);
	let absPathMd = absPath + settings.mdSuffix;

	// Make sure the sandbox isn't left
	if (!startsWith(absPath, settings.root)) {
		let err = new Error('Bad Request');
	    err.status = 400;
	    next(err);
	}

	// text/html; charset=utf-8
	// Checking for directory
	FS.stat(absPath)
	.then(function(stat) {
		// TODO: endswith / redirect 301
		if (stat.isDirectory()) {
			// The URL standard only allows / as a path separator
			if (!endsWith(absPath, '/')) {
				// Redirect
				res.redirect(301, req.path + '/');
				return;
			}

			return Directory.viewDirectory(res, next, absPath);
		} else if (stat.isFile()) {
			return Directory.viewFile(res, next, absPath);
		}
	})
	.catch(function(err) {
		// Checking for path.md
		FS.stat(absPathMd)
		.then(function(stat) {
			if (stat.isFile()) {
				return Directory.viewFile(res, next, absPathMd);
			}
		})
		.catch(function(err) {
			error = new Error('Not Found');
			error.status = 404;
			next(error);
		});
	});
};