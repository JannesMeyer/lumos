// If you want your file lists to sort correctly you have to compile Node.js with libicu i18n support.

let fs = require('fs');
let path = require('path');
let util = require('util');
let marked = require('marked');
let denodeify = require('./denodeify');

// Convert async functions
let FS = {
	stat: denodeify(fs, fs.stat),
	readDir: denodeify(fs, fs.readdir),
	readFile: denodeify(fs, fs.readFile)
};

// class Directory {

// }

// Main
let Directory = {

	settings: {
		brandName: 'Notes',
		root: '/Users/jannes/Dropbox/Notes', // __dirname
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
					isHidden: name.startsWith('.')
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
					it.sortString = it.name.toLowerCase();
					it.link = encodeURIComponent(it.name) + '/';
				} else {
					let basename = self.stripMdSuffix(it.name);
					it.basename = basename;
					it.sortString = it.name.toLowerCase();
					it.link = encodeURIComponent(basename);
				}
			});
			return dirContent;
		});
	},

	// Directories have to end with a slash
	makeBreadcrumbs: function(relativePath, lastIsFile) {
		let self = this;
		let breadcrumbs = [];
		// Split path
		let pathSegments = relativePath.split('/').filter(function(item) {
			return item !== ''; // Remove all empty segments
		});
		// Home item
		let item = {
			name: 'Home',
			path: '/',
			isActive: (pathSegments.length === 0)
		};
		breadcrumbs.push(item);
		// The rest of the path
		pathSegments.forEach(function(segment, i) {
			let isLast = (i === pathSegments.length - 1);
			let isFile = (isLast && lastIsFile);

			let beautifulName = isFile ? self.stripMdSuffix(segment) : segment;
			item = {
				name: beautifulName,
				path: item.path + beautifulName + (isFile ? '' : '/'),
				isActive: isLast
			};
			breadcrumbs.push(item);
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
		// TODO use Intl.Collator
		return items.sort(function(a, b) {
			// Arrange directories on top
			if (a.isDirectory && !b.isDirectory) { return -1; }
			if (!a.isDirectory && b.isDirectory) { return 1; }
			// And sort case-insensitively by name
			return a.sortString.localeCompare(b.sortString, undefined, { numeric: true });
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
				breadcrumbs: self.makeBreadcrumbs(relativePath, false)
			};
			res.render('document', data);
		});
	},

	viewFile: function(res, relativePath) {
		let self = this;
		let absolutePath = self.getAbsolutePath(relativePath);
		var absoluteDirPath = path.dirname(absolutePath);

		let data = {
			brandName: self.settings.brandName,
			title: path.basename(relativePath, self.settings.mdSuffix),
			breadcrumbs: self.makeBreadcrumbs(relativePath, true)
			// self.makeBreadcrumbs(relativePath, false)
		};

		return FS.readFile(absolutePath, { encoding: 'utf-8' })
		.then(function(content) {
			data.content = marked(content);
			// Get the directory contents, too
			return self.parseDirectory(absoluteDirPath);
		})
		.then(function(items) {
			data.title = path.basename(relativePath); // could be empty at the root
			data.items = self.sortDirectory(self.filterDirectory(items));

			// Find active file
			for (let item of data.items) {
				item.isActive = !item.isDirectory && item.path === absolutePath;
			}

			res.render('document', data);
		});
	},

	handleRequest: function(req, res, next) {
		let self = this;
		let relativePath = decodeURIComponent(req.path);
		let absolutePath = self.getAbsolutePath(relativePath);

		// Make sure the sandbox isn't left
		if (!absolutePath.startsWith(self.settings.root)) {
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
				if (!relativePath.endsWith('/')) {
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