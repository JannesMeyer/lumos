(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	// #!/usr/bin/env node --harmony
	'use strict';

	var config = __webpack_require__(1).config;
	var baseUrl = 'http://notes';

	// Understand command line arguments
	var commands = {
		serve: function(args) {
			var app = __webpack_require__(4);

			// TODO: make the port a command line argument
			var port = process.env.PORT || config.defaultPort;
			app.listen(port, 'localhost', function() {
				console.log('Listening on port', port);
			});
		},

		view: function(args) {
			var argv = __webpack_require__(2)(args);
			var spawn = __webpack_require__(3).spawn;

			if (argv._.length === 0) {
				throw new Error('Not enough arguments');
			}

			var pathname;
			// convert to pathname
			if (argv['base-path']) {
				var basePath = argv['base-path'];
				var absPath = argv._[0];

				if (absPath.startsWith(basePath)) {
					var baseStripped = absPath.substring(basePath.length);
					pathname = (baseStripped.startsWith('/') ? '' : '/') + baseStripped;
				} else {
					throw new Error('The provided path does not start with <base-path>');
				}
			} else {
				pathname = '/' + argv._[0];
			}

			// Strip "(index).md" from the end
			if (pathname.endsWith(config.indexFile)) {
				pathname = pathname.slice(0, -config.indexFile.length);
			} else if (pathname.endsWith(config.mdSuffix)) {
				pathname = pathname.slice(0, -config.mdSuffix.length);
			}

			// Open URL in browser
			var url = baseUrl + pathname;
			console.log('Opening...', url);
			// TODO: make this cross-platform, but without exec()
			// https://www.npmjs.org/package/open
			spawn('open', [url], {stdio: 'inherit'});
		},

		edit: function(args) {
			var open = __webpack_require__(5);
			var argv = __webpack_require__(2)(args);

			if (argv._.length === 0) {
				open.openEditor();
			} else {
				var filePath = argv._[0];
				// escape() will not encode: @*/+
				// (encodes Unicode characters to Unicode escape sequences, too)
				// encodeURI() will not encode: ~!@#$&*()=:/,;?+'
				// encodeURIComponent() will not encode: ~!*()'
				if (argv['decode-url']) {
					filePath = decodeURI(filePath);
				}

				open.openEditor(filePath);
			}
		},

		diary: function(days) {
			__webpack_require__(5).openDiary(days);
		}
	};

	function showBaseHelp() {
		console.log('usage: lumos <command> [<args>]\n');
		console.log('Available commands:');
		Object.keys(commands).forEach(function(command) {
			console.log('   ', command)
		});
	}

	// Parse command line arguments
	function parseArgs(args) {
		if (args.length < 1 || !commands.hasOwnProperty(args[0])) {
			showBaseHelp();
			return;
		}
		// Execute function
		var command = args.shift();
		commands[command](args);
	}

	parseArgs(process.argv.slice(2));

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("../package.json");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("minimist");

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("child_process");

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {var path = __webpack_require__(6);var express = __webpack_require__(7);var ejsLocals = __webpack_require__(8);var morgan = __webpack_require__(9);var serve = __webpack_require__(11);var api = __webpack_require__(12);var app = express();

	// view engine setup
	app.engine('ejs', ejsLocals);
	app.set('views', path.join(__dirname, '../views'));
	app.set('view engine', 'ejs');

	// logger
	app.use(morgan(':method :url :status (done after :response-time ms)'));

	// static routes
	var oneYear = 31557600000;
	app.use(express.static(path.join(__dirname, '../public'), { maxAge: oneYear }));

	// the app
	app.use(serve);

	// development error handler
	app.use(function(err, req, res, next) {
	    res.status(err.status || 500);
	    res.render('error', { err:err });
	});

	exports = app;
	/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var fs = __webpack_require__(10);var path = __webpack_require__(6);var spawn = __webpack_require__(3).spawn;

	var denodeify = __webpack_require__(13);
	var fsStat = denodeify(fs, fs.stat);
	var fsMkdir = denodeify(fs, fs.mkdir);
	var config = __webpack_require__(1).config;
	var dateInCustomFormat = __webpack_require__(14).dateInCustomFormat;

	function isDefined(value) {
		return value !== undefined;
	}

	function openFiles(files) {
		Promise.all(files.map(function(file)  {
			var dir = path.dirname(file);
			// Make sure the directory exists
			return fsStat(dir)
			.then(function(stat)  {
				if (stat.isFile()) {
					throw new Error('Found a file instead of a directory');
				}
			}, function(err)  {
				console.log(("Creating directory '" + dir + "'"));
				// TODO: create recursively
				// https://www.npmjs.org/package/mkdirp
				return fsMkdir(dir);
			});
		}))
		.then(function()  {
			files.forEach(function(file)  {
				console.log(("Opening '" + file + "'"));
			});
			// Open editor
			spawn(config.editor, config.editorArgs.concat(files), { stdio: 'inherit' });
		});
	}

	/**
	 * Well, this actually doesn't adhere to the standard at all, because
	 * it allows the omission of the year to mean the current year.
	 * (or the omission of the current year and month)
	 * It also doesn't check if the month and the day are within reasonable
	 * bounds.
	 */
	var dateRegex = /^(?:(?:([\d]{4})-)?(0?[1-9]|1[0-2])-)?(0?[1-9]|[12][0-9]|3[01])$/;
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

	function openDiary(days) {
		// Collect Date objects
		if (days.length === 0) {
			days.push(dateInCustomFormat(new Date()));
		} else {
			days = days.map(function(day)  {return dateInCustomFormat(parseIso8601Date(day));});
			if (!days.every(isDefined)) {
				throw new Error("Couldn't parse all dates");
			}
		}

		// Convert to paths
		var files = days.map(function(day)  {
			var filename = day.monthName + ' ' + day.day + config.mdSuffix;
			return path.join(config.diaryBaseDir, day.year.toString(), day.month.toString(), filename)
		});

		// Open the files in an editor
		openFiles(files);
	} module.exports.openDiary = openDiary;

	function openEditor(file) {
		// A promise that returns the arguments for the editor
		var argPromise;
		if (file) {
			argPromise = fsStat(file)
			.then(function(stat)  {
				console.log('Opening...', file);
				return config.editorArgs.concat([file]);
			})
			.catch(function(err)  {
				console.error('File not found');
				throw err;
			});
		} else {
			argPromise = Promise.resolve(config.editorArgs);
		}

		// Open editor
		argPromise.then(function(args)  {
			spawn(config.editor, args, { stdio: 'inherit' });
		});
	} module.exports.openEditor = openEditor;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("path");

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("express");

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("ejs-locals");

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("morgan");

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("fs");

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(15);var marked = __webpack_require__(16);var path = __webpack_require__(6);var fs = __webpack_require__(10);var layout = __webpack_require__(19);var denodeify = __webpack_require__(13);var React = __webpack_require__(17);var fsStat     = denodeify(fs, fs.stat);
	var fsReadDir  = denodeify(fs, fs.readdir);
	var fsReadFile = denodeify(fs, fs.readFile);

	var config = __webpack_require__(1).config;
	var SegmentedPath = __webpack_require__(20).SegmentedPath;
	var Directory = __webpack_require__(21).Directory;

	var baseDir = process.env.LUMOSPATH || process.cwd(); // Default to current working directory
	var baseDirName = path.basename(baseDir);

	function renderToString(data) {
		layout.render(data);
	}

	exports = function(req, res, next) {
		var processedPath = decodeURIComponent(req.path);
		var requestPath = new SegmentedPath(baseDir, processedPath);
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
			.then(function(dir)  {
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
					.then(function(file)  {
						data.filePath = indexPath.absolute;
						// Can't have spaces in AppleScript
						data.editURL = encodeURI(config.editURLProtocol + indexPath.absolute);
						data.content = fileContentToHtml(file.content);
					});
				}
			}, function(err)  {
				throw mHTTPError(404, 'Directory Not Found');
			})
			.then(function()  {
				var acceptHeader = req.get('Accept');
				if (acceptHeader === 'application/json') {
					res.set({
						'Content-Type': 'application/json',
						'Vary': 'Accept'
					});
					res.json(data);
				} else {
					res.render('document', data);
				}
			})
			.catch(function(err)  {return next(err);});
		} else {
			requestPath.makeFile();
			var requestPathMd = requestPath.makeClone();
			requestPathMd.leaf += config.mdSuffix;
			requestPathMd.makeFile();
			data.breadcrumbs = requestPathMd.makeBreadcrumbs();

			// Read file
			return readFile(requestPathMd)
			.then(function(file)  {
				data.title = requestPathMd.name;
				data.filePath = requestPathMd.absolute;
				// Can't have spaces in AppleScript
				data.editURL = encodeURI(config.editURLProtocol + requestPathMd.absolute);
				data.content = fileContentToHtml(file.content);

				var datetool = __webpack_require__(14);
				var creationDate = datetool.dateInCustomFormat(file.stat.birthtime);
				data.creationDate = datetool.dayAsString(creationDate);
				data.creationTime = '';

				// Read directory
				return readDir(requestPathMd.makeParent())
				.then(function(dir)  {
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
				.then(function()  {
					var acceptHeader = req.get('Accept');
					if (acceptHeader === 'application/json') {
						res.set({
							'Content-Type': 'application/json',
							'Vary': 'Accept'
						});
						res.json(data);
					} else {
						res.render('document', data);
					}
				})
				.catch(function(err)  {return next(err);});
			}, function(err)  {
				console.error(err);
				// Document not found, try to deliver the file at the original path
				return denodeify(res, res.sendfile)(requestPath.absolute);
			})
			.catch(function(err)  {
				next(err);
				// console.error(err);
				// next(mHTTPError(404, 'File Not Found'));
			});
		}
	}

	function readDir(dirPath) {
		var dir = new Directory(dirPath);

		return fsStat(dirPath.absolute)
		.then(function(stat)  {
			if (!stat.isDirectory()) {
				throw new Error('Is a file');
			}
			// TODO: make readContents a lazy-loading getter
			return dir.readContents();
		});
	}

	function readFile(filePath) {
		return fsStat(filePath.absolute)
		.then(function(stat)  {
			if (stat.isDirectory()) {
				throw new Error('Is a directory');
			}
			return fsReadFile(filePath.absolute, { encoding: 'utf-8' })
			.then(function(content)  {return { stat:stat, content:content };});
		});
	}

	/**
	 * This function is used to convert the plain text to HTML
	 * Read: https://github.com/chjj/marked/blob/master/README.md
	 */
	var hljs = __webpack_require__(18);
	marked.setOptions({
			gfm: true,
			breaks: true,
			highlight: function(code, lang)  {return lang ? hljs.highlight(lang, code).value : code;}
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

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	// TODO: Add api routes
	// TODO: don't use an api subdirectory, use the 'accepts' http header instead

	// Accept: application/json

	// Also use this for search:
	// http://notes/?q=test
	// http://expressjs.com/api.html

	// app.get('/api-28b8f7cf05fa/', function);
	// module.exports = function(req, res, next) {
	// }

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	// TODO: lazy-loading of denodified functions

	// Convert node.js async functions into Promises
	function denodeify(thisArg, nodeFn) {
		return function() {
			var args = Array.prototype.slice.call(arguments);
			return new Promise(function(resolve, reject) {
				args.push(function callback(err, data) {
					if (err) {
						reject(new Error(err));
					} else {
						resolve(data);
					}
				});
				nodeFn.apply(thisArg, args);
			});
		};
	};

	exports = denodeify;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	function dateInCustomFormat(date) {
		if (date === undefined) { return; }

		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var monthName = monthNames[date.getMonth()];
		var day = date.getDate();
		return {year:year, month:month, monthName:monthName, day:day};
	} module.exports.dateInCustomFormat = dateInCustomFormat;

	function dayAsString(d) {
		return padZero(d.day) + '.' + padZero(d.month) + '.' + d.year;
		// return d.monthName + ' ' + d.day + ', ' + d.year;
	} module.exports.dayAsString = dayAsString;

	function timeAsString(t) {
		return padZero(t.hours) + ':' + padZero(t.minutes);
	} module.exports.timeAsString = timeAsString;

	function padZero(number) {
		var str = number.toString();
		return str.length < 2 ? '0' + str : str;
	} module.exports.padZero = padZero;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("util");

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("marked");

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("react");

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("highlight.js");

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	exports.render = function(title, markupString) 
	{return ("<!DOCTYPE html>\n<html>\n<head>\n  <meta charset=\"utf-8\">\n  <title>" + 



	title + "</title>\n  <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n  <link rel=\"stylesheet\" href=\"/stylesheets/bootstrap.min.css\">\n  <link rel=\"stylesheet\" href=\"/stylesheets/theme-one.css\">\n  <link rel=\"stylesheet\" href=\"/stylesheets/hljs/github.css\">\n  <link rel=\"icon\" href=\"/images/favicon.png\">\n  <script defer src=\"/javascripts/vendor/react.js\"></script>\n  <script defer src=\"/javascripts/main.bundle.js\"></script>\n</head>\n<body>\n" + 










	markupString + "\n</body>\n</html>"

	);};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var path = __webpack_require__(6);

		function SegmentedPath(basePath, segments) {"use strict";
			this.basePath = basePath;
			this.baseDirName = path.basename(basePath);
			this.segments = segments;
			// this.name = String
			// this.extension = String
			// this.basename = String
			// this.sortString = String
			// this.link = String
			// this.isHidden = Boolean
			// this.isDir = Boolean
		}

		SegmentedPath.prototype.segments=function(array) {"use strict";
			this.segments_ = array;
			this.update();
		};

		SegmentedPath.prototype.update=function() {"use strict";
			// Compute the absolute name
			this.absolute = path.join.apply(path, this.basePath.concat(this.segments_));

			// Only use segments [2, ∞)
			this.relative = path.join.apply(path, this.segments_);
			this.name = path.basename(this.relative);
			this.sortStr = this.name.toLowerCase();
			this.isDir = this.relative.endsWith('/');
			this.isHidden = this.name.startsWith('.');
		};

		SegmentedPath.prototype.makeFile=function() {"use strict";
			this.isDir = false;
			this.fullName = this.name;
			this.extension = path.extname(this.fullName); // TODO: toLowerCase()
			this.name = path.basename(this.fullName, this.extension);
			this.sortStr = this.name.toLowerCase();
		};

		SegmentedPath.prototype.removeExtension=function(filename) {"use strict";
			return path.basename(filename, path.extname(filename));
		};

		SegmentedPath.prototype.segments=function() {"use strict";
			return this.segments_;
		};

		SegmentedPath.prototype.makeParent=function() {"use strict";
			if (this.isDir) {

			} else {
				var segmentsJoined = path.join.apply(path, this.segments_);
				return new SegmentedPath(this.basePath, path.dirname(segmentsJoined));
			}
		};

		SegmentedPath.prototype.makeDescendant=function(name) {"use strict";
			// Clone segments
			var segments = this.segments_.slice();
			// Add descendant
			segments.push(name);
			return new SegmentedPath(this.basePath, segments);
		};

		SegmentedPath.prototype.makeClone=function() {"use strict";
			// Clone segments
			var segments = this.segments_.slice();
			return new SegmentedPath(this.basePath, segments);
		};

		SegmentedPath.prototype.makeBreadcrumbs=function() {"use strict";
			var breadcrumbs = [];
			/*{
				name
				path
				isActive
			}*/

			// Split path and remove all empty segments
			var pathSegments = this.relative.split('/').filter(function(s)  {return s !== '';});
			// Home item
			var item = {
				name: this.baseDirName,
				path: '/',
				isActive: false
			};
			breadcrumbs.push(item);
			// The rest of the path
			pathSegments.forEach(function(segment, i)  {
				var isLast = (i === pathSegments.length - 1);

				if (isLast && !this.isDir) {
					return;
				}

				item = {
					name: segment,
					path: item.path + segment + '/',
					isActive: false
				};
				breadcrumbs.push(item);

			}.bind(this));
			return breadcrumbs;
		};

		/**
		 * Makes sure that no segment leaves the base
		 */
		SegmentedPath.prototype.verifyDescendance=function() {"use strict";
			return this.absolute.startsWith(this.basePath);
		};

		SegmentedPath.prototype.leaf=function() {"use strict";
			var segments = this.segments_;
			return segments[segments.length - 1];
		};

		SegmentedPath.prototype.leaf=function(value) {"use strict";
			var segments = this.segments_;
			segments[segments.length - 1] = value;
			this.update();
		};

	module.exports.SegmentedPath = SegmentedPath;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var path = __webpack_require__(6);var fs = __webpack_require__(10);var crypto = __webpack_require__(22);var denodeify = __webpack_require__(13);var fsStat     = denodeify(fs, fs.stat);
	var fsReadDir  = denodeify(fs, fs.readdir);
	var config = __webpack_require__(1).config;
	var SegmentedPath = __webpack_require__(20).SegmentedPath;






	function HSVtoRGB(h, s, v) {
	    var r, g, b, i, f, p, q, t;
	    if (h && s === undefined && v === undefined) {
	        s = h.s, v = h.v, h = h.h;
	    }
	    i = Math.floor(h * 6);
	    f = h * 6 - i;
	    p = v * (1 - s);
	    q = v * (1 - f * s);
	    t = v * (1 - (1 - f) * s);
	    switch (i % 6) {
	        case 0: r = v, g = t, b = p; break;
	        case 1: r = q, g = v, b = p; break;
	        case 2: r = p, g = v, b = t; break;
	        case 3: r = p, g = q, b = v; break;
	        case 4: r = t, g = p, b = v; break;
	        case 5: r = v, g = p, b = q; break;
	    }
	    return {
	        r: Math.floor(r * 255),
	        g: Math.floor(g * 255),
	        b: Math.floor(b * 255)
	    };
	}

	function colorizeName(name) {
		var hash = crypto.createHash('md5').update(name).digest('binary');
		var hue = hash.charCodeAt(2) / 255;
		var color = HSVtoRGB(hue, 0.4, 1);
		return ("rgb(" + color.r + ", " + color.g + ", " + color.b + ")");
	}

	/**
	 * A class that represents a directory
	 */


		function Directory(path) {"use strict";
			this.path = path;
			// this.dirs = [SegmentedPath, ...]
			// this.files = [SegmentedPath, ...]
		}

		Directory.prototype.readContents=function() {"use strict";
			var contents;
			return fsReadDir(this.path.absolute)
			.then(function(names)  {
				contents = names.map(function(name)  {return new SegmentedPath(this.path.absolute, name);}.bind(this));
				// Find out whether these are directories or files
				var promises = contents.map(function(item)  {return fsStat(item.absolute);});
				return Promise.all(promises);
			}.bind(this))
			.then(function(stats)  {
				// TODO: use for..of instead
				// Correct isDir information
				contents.forEach(function(item, i) {
					item.isDir = stats[i].isDirectory();
					if (item.isDir) {
						item.color = colorizeName(item.name);
						item.link = encodeURIComponent(item.name) + '/';
					} else {
						item.makeFile();
						item.link = encodeURIComponent(item.name);
					}
				});

				// sort
				contents.sort(itemSort);
				contents = contents.filter(itemFilterFn);

				// split
				for (var i = 0; i < contents.length; ++i) {
					if (!contents[i].isDir) {
						break;
					}
				}

				this.dirs = contents.slice(0, i);
				this.files = contents.slice(i);
				return this;
			}.bind(this));
		};

		Directory.prototype.hasFile=function(name) {"use strict";
			for (var i = 0; i < this.files.length; ++i) {
				var file = this.files[i];
				if (file.fullName === name) {
					return true;
				}
			}
			return false;
		};

		Directory.prototype.removeFile=function(name) {"use strict";
			for(var i = 0; i < this.files.length; ++i) {
				if (this.files[i].fullName === name) {
					break;
				}
			}
			this.files.splice(i, 1);
		};
	module.exports.Directory = Directory;

	/**
	 * Sort function for Directory objects
	 */
	function itemSort(a, b) {
		// Arrange directories on top
		if (a.isDir && !b.isDir) { return -1; }
		if (!a.isDir && b.isDir) { return 1; }

		// And sort by name
		// TODO: use Intl.Collator
		return a.sortStr.localeCompare(b.sortStr, undefined, { numeric: true });
	}

	/**
	 * Filter function for SegmentedPath objects
	 */
	function itemFilterFn(item) {
		if (item.isHidden) { return false; }
		if (!item.isDir) {
			// if (item.fullName === config.indexFile) { return false; }
			if (item.extension !== config.mdSuffix) { return false; }
		}
		return true;
	}

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("crypto");

/***/ }
/******/ ])))