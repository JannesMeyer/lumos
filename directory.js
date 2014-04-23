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
// Stat all of these fuckers
function endsWith(str, search) {
	// no type checking or null checking
	return str.length >= search.length && str.slice(str.length - search.length) === search;
}

// Main
let Directory = {

	settings: {
		brandName: 'Notes',
		root: path.join(__dirname, 'markdown'),
		mdSuffix: '.md'
	},

	getIndexFilename: function() {
		let self = this;
		return 'index' + self.settings.mdSuffix;
	},

	getAbsolutePath: function(relativePath) {
		let self = this;
		return path.join(self.settings.root, relativePath);
	},

	stripMdSuffix: function(name) {
		let self = this;
		return path.basename(name, self.settings.mdSuffix);
	},

	parseDirectory: function(dirPath) {
		let self = this;

		let dirContent;
		return FS.readDir(dirPath)
		.then(function(names) {
			// Create item objects
			dirContent = names.map(function(name) {
				return {
					name: name,
					extension: path.extname(name).toLowerCase(),
					path: path.join(dirPath, name),
					isHidden: startsWith(name, '.')
				};
			});

			// Stat all of these fuckers
			return Promise.all(dirContent.map(function(item) {
				return FS.stat(item.path);
			}));
		})
		.then(function(stats) {
			dirContent.forEach(function(it, i) {
				// Get corresponding stat object
				let stat = stats[i];

				// Append item objects
				let isDir = stat.isDirectory();
				it.isDirectory = isDir;
				// Add other properties for directories/files
				if (isDir) {
					it.basename = it.name;
					it.sortIndex = it.name.toLowerCase();
					it.link = encodeURIComponent(it.name) + '/';
				} else {
					let basename = self.stripMdSuffix(it.name);
					it.basename = basename;
					it.sortIndex = it.name.toLowerCase();
					it.link = encodeURIComponent(basename);
				}
			});
			return dirContent;
		});
	},

	// Directories have to end with a slash
	makeBreadcrumbs: function(relativePath, emptyLeaf) {
		let self = this;

		let pathSegments = relativePath.split('/');

		if (emptyLeaf && pathSegments.length > 2) {
			// Remove last element if it's empty
			pathSegments.pop()
		}
		let lastSegment = pathSegments.length - 1;

		let currentPath = '';
		let breadcrumbs = [];
		pathSegments.forEach(function(segment, i) {
			let value = {
				name: segment,
				isActive: false
			};

			// Replace the first segment '' with 'Home'
			if (i === 0) {
				value.name = 'Home';
			}

			if (i === lastSegment) {
				// Directory
				if (emptyLeaf) {
					value.name = segment;
					// value.path = currentPath + segment;
					value.isActive = true;
				} else {
					// File
					value.name = self.stripMdSuffix(segment);
					// value.path = currentPath + self.stripMdSuffix(segment);
					value.isActive = true;
				}
			} else {
				currentPath += segment + '/';
				value.path = currentPath;
			}

			breadcrumbs.push(value);
		});

		return breadcrumbs;
	},

	filterDirectory: function(items) {
		let self = this;
		let indexFilename = self.getIndexFilename();

		return items.filter(function(item) {
			return !item.isHidden
				// Filter files
				&& (item.isDirectory || (!item.isDirectory
					&& item.name !== indexFilename && item.extension === self.settings.mdSuffix));
		});
	},

	sortDirectory: function(items) {
		return items.sort(function(a, b) {
			// Arrange directories on top
			if (a.isDirectory && !b.isDirectory) { return -1; }
			if (!a.isDirectory && b.isDirectory) { return 1; }
			// And sort case-insensitively by name
			return a.sortIndex.localeCompare(b.sortIndex);
		});
	},

	viewDirectory: function(res, relativePath) {
		let self = this;
		let absolutePath = self.getAbsolutePath(relativePath);

		// Read directory contents
		return self.parseDirectory(absolutePath)
		.then(function(items) {
			let filtered = self.sortDirectory(self.filterDirectory(items));

			let basename = path.basename(relativePath); // could be empty at the root
			let data = {
				brandName: self.settings.brandName,
				title: basename,
				items: filtered,
				breadcrumbs: self.makeBreadcrumbs(relativePath, true)
			};
			res.render('directory', data);
		});
	},

	viewFile: function(res, relativePath) {
		let self = this;
		let absolutePath = self.getAbsolutePath(relativePath);

		return FS.readFile(absolutePath, { encoding: 'utf-8' })
		.then(function(content) {
			let data = {
				brandName: self.settings.brandName,
				title: path.basename(relativePath, self.settings.mdSuffix),
				content: marked(content),
				breadcrumbs: self.makeBreadcrumbs(relativePath, false)
			};

			res.render('document', data);
		});
	},

	handleRequest: function(req, res, next) {
		let self = this;
		let relativePath = decodeURIComponent(req.path);
		let absolutePath = self.getAbsolutePath(relativePath);

		// Make sure the sandbox isn't left
		if (!startsWith(absolutePath, self.settings.root)) {
			let err = new Error('Bad Request');
		    err.status = 400;
		    next(err);
		}

		// text/html; charset=utf-8
		// Checking for direct match
		FS.stat(absolutePath)
		.then(function(stat) {
			if (stat.isDirectory()) {
				// The URL standard only allows / as a path separator
				// Make sure directory requests end with a slash
				if (!endsWith(relativePath, '/')) {
					res.redirect(301, relativePath + '/');
					return;
				}

				return self.viewDirectory(res, relativePath);
			} else {
				return self.viewFile(res, relativePath);
			}
		}, function(err) {
			let relativePathMd = relativePath + self.settings.mdSuffix;
			let absolutePathMd = absolutePath + self.settings.mdSuffix;

			// Checking for [path].md
			return FS.stat(absolutePathMd)
			.then(function(stat) {
				if (stat.isDirectory()) {
					return new Error('Found directory instead of file');
				}

				return self.viewFile(res, relativePathMd);
			}, function(err) {
				// Definitely nothing found
				err = new Error('Not Found');
				err.status = 404;
				next(err);
			});
		})
		.catch(function(err) {
			next(err);
		});
	}

};

module.exports = function(req, res, next) {
	Directory.handleRequest(req, res, next);
};