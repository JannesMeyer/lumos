module.exports =
/******/ (function(modules) { // webpackBootstrap
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

	var config = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../package.json\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).config;
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
			var argv = __webpack_require__(1)(args);
			var spawn = __webpack_require__(2).spawn;

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
			var open = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../src/open\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
			var argv = __webpack_require__(1)(args);

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
			__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../src/open\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).openDiary(days);
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

	module.exports = require("minimist");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("child_process");

/***/ },
/* 3 */,
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {var path = __webpack_require__(6);var express = __webpack_require__(7);var ejsLocals = __webpack_require__(8);var morgan = __webpack_require__(9);var serve = __webpack_require__(10);var api = __webpack_require__(11);var app = express();

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
/* 5 */,
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

	var util = __webpack_require__(12);var marked = __webpack_require__(13);var path = __webpack_require__(6);var fs = __webpack_require__(14);var layout = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./templates/layout\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));var denodeify = __webpack_require__(18);var React = __webpack_require__(15);var fsStat     = denodeify(fs, fs.stat);
	var fsReadDir  = denodeify(fs, fs.readdir);
	var fsReadFile = denodeify(fs, fs.readFile);

	var config = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../package.json\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).config;
	var SegmentedPath = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./SegmentedPath\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).SegmentedPath;
	var Directory = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./Directory\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).Directory;

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

				var datetool = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./lib/date-tool\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
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
	var hljs = __webpack_require__(16);
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
/* 11 */
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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("util");

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("marked");

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("fs");

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("react");

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("highlight.js");

/***/ },
/* 17 */,
/* 18 */
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

/***/ }
/******/ ])