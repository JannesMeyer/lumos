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

	/** @jsx React.DOM */var key = __webpack_require__(1);
	var fullscreen = __webpack_require__(2);

	// initialize
	addEventListener('keydown', key.handleDown);
	fullscreen.initializeErrorHandler();

	var Header = React.createClass({displayName: 'Header',
		render:function() {
			return (
				React.DOM.header( {className:"m-header"}, 
					BreadcrumbList( {breadcrumbs:this.props.breadcrumbs, dirs:this.props.dirs} ),
					SearchBar(null )
				)
			);
		}
	});

	var BreadcrumbList = React.createClass({displayName: 'BreadcrumbList',
		render:function() {
			var breadcrumbs = this.props.breadcrumbs.map(function(item) 
				{return React.DOM.li( {key:item.name}, React.DOM.a( {href:item.link}, item.name));}
			);
			var dirs = this.props.dirs.map(function(item) 
				{return React.DOM.li( {key:item.relative}, React.DOM.a( {href:item.link}, item.relative));}
			);
			return (
				React.DOM.ol(null, 
					breadcrumbs,
					React.DOM.li( {className:"more"}, React.DOM.ol(null, dirs))
				)
			);
		}
	});

	var SearchBar = React.createClass({displayName: 'SearchBar',
		render:function() {
			return (
				React.DOM.form( {method:"get"}, 
					React.DOM.input(
						{className:"m-search",
						type:"text",
						name:"q",
						autoComplete:"off",
						spellCheck:"false",
						dir:"auto"} )
				)
			);
		}
	});

	var Navigation = React.createClass({displayName: 'Navigation',
		render:function() {
			var items = this.props.items;
			return (
				React.DOM.nav( {className:"m-navigation"}, 
					React.DOM.ul(null, items.map(function(item) 
						{return React.DOM.li( {className:item.isActive ? 'active' : '', key:item.name}, 
							React.DOM.a( {href:item.link}, item.name)
						);}
					))
				)
			);
		}
	});

	var Page = React.createClass({displayName: 'Page',
		render:function() {
			return (
				React.DOM.section( {className:"m-page", role:"content"}, 
					React.DOM.div( {className:"m-page-buttons"}, 
						PageButton( {name:"edit", icon:"pencil", href:'lumos-connect://' + this.props.filePath, title:"Edit page (E)"} ),
						PageButton( {name:"fullscreen", icon:"resize-full", href:"", title:"Toggle fullscreen (F)"} )
					),
					React.DOM.div( {className:"m-page-title"}, 
						React.DOM.h1(null, this.props.title),
						React.DOM.p(null, this.props.creationDate)
					),
					React.DOM.article( {dangerouslySetInnerHTML:{ __html: this.props.content }} )
				)
			);
		}
	});

	var PageButton = React.createClass({displayName: 'PageButton',
		handleClick:function(e) {
			if (this.props.name === 'fullscreen') {
				// TODO: fullscreen as state
				toggleFullscreen(document.documentElement);
				e.currentTarget.blur();
				e.preventDefault();
			}
		},
		render:function() {
			return (
				React.DOM.a( {className:'button-' + this.props.name, href:this.props.href, title:this.props.title, onClick:this.handleClick}, 
					React.DOM.span( {className:'glyphicon glyphicon-' + this.props.icon})
				)
			);
		}
	});

	var LumosApplication = React.createClass({displayName: 'LumosApplication',
		pickRandomColor:function() {
			var colors = ['purple-mist', 'orange', 'blue', 'apple', 'cyan'];
			return colors[Math.floor(Math.random() * colors.length)];
		},
		getInitialState:function() {
			return {
				color: this.pickRandomColor()
			};
		},
		componentWillMount:function() {
			key.bind(undefined, '/', function(e) {
				console.log('searchBox.focus()');
				e.preventDefault();
			});
			key.bind(undefined, 'e', function(e) {
				console.log('location.href = editButton.href;');
			});
			key.bind(undefined, 'f', function(e) {
				fullscreen.toggle(document.documentElement);
			});
			key.bind(undefined, 'r', function(e) {
				location.href = '/';
			});
			key.bind({ meta: true }, 'up', function(e) {
				location.href = '..';
			});
			key.bind({ inputEl: true }, 'esc', function(e) {
				if (e.target.blur) {
					e.target.blur();
				}
			});
			// if (nextUrl) {
			// 	key.bind(undefined, 'j', function(e) {
			// 		location.href = nextUrl;
			// 	});
			// }
			// if (prevUrl) {
			// 	key.bind(undefined, 'k', function(e) {
			// 		location.href = prevUrl;
			// 	});
			// }
		},
		render:function() {
			var data = this.props.data;
			return (
				React.DOM.div( {className:'m-container s-' + this.state.color}, 
					Header( {breadcrumbs:data.breadcrumbs, dirs:data.dirs} ),
					React.DOM.div(null, 
						Page( {title:data.title, creationDate:data.creationDate, content:data.content, filePath:data.filePath} ),
						Navigation( {items:data.items} )
					)
				)
			);
		}
	});
	React.renderComponent(LumosApplication( {data:data} ), document.body);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/madrobby/keymaster/blob/master/keymaster.js

	var keyCodeMap = {
		'esc': 27,
		'space': 32,
		'left': 37,
		'up': 38,
		'right': 39,
		'down': 40,
		'e': 69,
		'f': 70,
		'j': 74,
		'k': 75,
		'r': 82,
		'/': 191
	};
	var bindings = {};

	function bind(conditions, char, fn) {
		if (fn === undefined) {
			throw new Error('missing callback function');
		}
		if (char === undefined) {
			throw new Error('missing char condition');
		}
		if (conditions === undefined) {
			conditions = {};
		}
		conditions.inputEl = !!conditions.inputEl;
		conditions.ctrl = !!conditions.ctrl;
		conditions.shift = !!conditions.shift;
		conditions.alt = !!conditions.alt;
		conditions.meta = !!conditions.meta;

		// Parse char parameter
		var keyCode = keyCodeMap[char];
		if (keyCode === undefined && typeof char === 'number') {
			keyCode = char;
		}
		if (keyCode === undefined) {
			throw new Error('unknown char condition')
		}

		// Re-use the conditions object for the binding
		conditions.fn = fn;

		// Do the binding
		if (bindings[keyCode] === undefined) {
			bindings[keyCode] = [conditions];
		} else {
			bindings[keyCode].push(conditions);
		}
	} module.exports.bind = bind;

	function handleDown(e) {
		var bucket = bindings[e.keyCode];
		if (bucket === undefined) {
			// console.log('Unrecognized key:', e.keyCode);
			return;
		}

		var target = e.target;
		var inputEl = target.tagName === 'INPUT' ||
			target.tagName === 'TEXTAREA' ||
			target.tagName === 'SELECT' ||
			target.isContentEditable;

		for (var i = 0; i < bucket.length; ++i) {
			var binding = bucket[i];
			if (binding.inputEl === inputEl &&
				binding.ctrl === e.ctrlKey &&
				binding.shift === e.shiftKey &&
				binding.alt === e.altKey &&
				binding.meta === e.metaKey) {
				// Match found
				binding.fn(e);
				break;
			}
		}
	} module.exports.handleDown = handleDown;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	function initializeErrorHandler() {
		function fullscreenErrorHandler() {
			alert('Fullscreen operation failed');
		}
		document.addEventListener('fullscreenerror', fullscreenErrorHandler);
		document.addEventListener('webkitfullscreenerror', fullscreenErrorHandler);
		document.addEventListener('mozfullscreenerror', fullscreenErrorHandler);
		document.addEventListener('MSFullscreenError', fullscreenErrorHandler);
	} module.exports.initializeErrorHandler = initializeErrorHandler;

	var fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled || document.msFullscreenEnabled;
	var exitFullscreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen;

	function toggle(element) {
		if (!fullscreenEnabled) {
			return;
		}
		var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
		var requestFullscreen = element.requestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen || element.msRequestFullscreen;

		if (fullscreenElement === element) {
			exitFullscreen.apply(document);
		} else {
			requestFullscreen.apply(element);
		}
	} module.exports.toggle = toggle;

/***/ }
/******/ ])