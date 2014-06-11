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

	function getJSON(path) {
		var req = new XMLHttpRequest();
		req.open('GET', path);
		req.setRequestHeader('Accept', 'application/json');

		return new Promise(function(resolve, reject) {
			req.onload = function(e) {
				try {
					resolve(JSON.parse(req.response));
				} catch(e) {
					reject(e);
				}
			};
			req.onerror = function(e) {
				reject(new Error(req.status));
			};
			req.send();
		});
	}

	function navigateTo(path) {
		getJSON(path)
		.then(renderBody)
		.catch(console.error.bind(console));
	}

	key.bind({}, 'e', function(event)  {
		location.href = data.editLink;
	});
	key.bind({}, 'j', function(event)  {
		if (data.nextItem) {
			navigateTo(data.nextItem.link);
		}
	});
	key.bind({}, 'k', function(event)  {
		if (data.prevItem) {
			navigateTo(data.prevItem.link);
		}
	});
	key.bind({}, 'r', function(event)  {
		navigateTo('/');
	});
	key.bind({ meta: true }, 'up', function(event)  {
		navigateTo('..');
	});
	key.bind({}, 'f', function(event)  {
		fullscreen.toggle(document.documentElement);
	});
	key.bind({ inputEl: true }, 'esc', function(event)  {
		if (event.target.blur) {
			event.target.blur();
		}
	});


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
		componentDidMount:function() {
			key.bind(undefined, '/', function(event)  {
				this.refs.searchBox.getDOMNode().focus();
				event.preventDefault();
			}.bind(this));
		},
		render:function() {
			return (
				React.DOM.form( {method:"get"}, 
					React.DOM.input(
						{className:"m-search",
						ref:"searchBox",
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
						PageButton( {name:"edit", icon:"pencil", href:this.props.editLink, title:"Edit page (E)"} ),
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
		handleClick:function(event) {
			if (this.props.name === 'fullscreen') {
				// TODO: fullscreen as state
				fullscreen.toggle(document.documentElement);
				event.currentTarget.blur();
				event.preventDefault();
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
			console.log('componentWillMount');

			var data = this.props.data;
			data.editLink = 'lumos-connect://' + data.filePath;


		},
		render:function() {
			console.log('rendering');
			var data = this.props.data;

			return (
				React.DOM.div( {className:'m-container s-' + this.state.color}, 
					Header( {breadcrumbs:data.breadcrumbs, dirs:data.dirs} ),
					React.DOM.div(null, 
						Page( {title:data.title, creationDate:data.creationDate, content:data.content, editLink:data.editLink} ),
						Navigation( {items:data.items} )
					)
				)
			);
		}
	});

	function renderBody(data) {
		React.renderComponent(LumosApplication( {data:data} ), document.body);
	}

	// Initial render
	renderBody(data);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var keyCodeMap = {
		'backspace': 8,
		'tab': 9,
		'clear': 12,
		'enter': 13,
		'return': 13,
		'esc': 27,
		'space': 32,
		'left': 37,
		'up': 38,
		'right': 39,
		'down': 40,
		'del': 46,
		'home': 36,
		'end': 35,
		'pageup': 33,
		'pagedown': 34,
		',': 188,
		'.': 190,
		'/': 191,
		'`': 192,
		'-': 189,
		'=': 187,
		';': 186,
		'\'': 222,
		'[': 219,
		']': 221,
		'\\': 220,
		'a': 65, 'b': 66, 'c': 67, 'd': 68,
		'e': 69, 'f': 70, 'g': 71, 'h': 72,
		'i': 73, 'j': 74, 'k': 75, 'l': 76,
		'm': 77, 'n': 78, 'o': 79, 'p': 80,
		'q': 81, 'r': 82, 's': 83, 't': 84,
		'u': 85, 'v': 86, 'w': 87, 'x': 88,
		'y': 89, 'z': 90
	};
	var bindings = {};
	var handlerAdded = false;

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
			throw new Error('unknown char condition ' + char)
		}

		// Re-use the conditions object for the binding
		conditions.fn = fn;

		// If this is the first binding
		if (!handlerAdded) {
			window.addEventListener('keydown', handleDown);
			handlerAdded = true;
		}

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
		var inputEl =
			target.tagName === 'INPUT' ||
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
	}


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var handlerAdded = false;

	function fullscreenErrorHandler() {
		alert('Fullscreen operation failed');
	}

	var fullscreenEnabled =
		document.fullscreenEnabled ||
		document.mozFullScreenEnabled ||
		document.webkitFullscreenEnabled ||
		document.msFullscreenEnabled;
	var exitFullscreen =
		document.exitFullscreen ||
		document.mozCancelFullScreen ||
		document.webkitExitFullscreen ||
		document.msExitFullscreen;

	function toggle(element) {
		if (!fullscreenEnabled) {
			return;
		}
		var fullscreenElement =
			document.fullscreenElement ||
			document.mozFullScreenElement ||
			document.webkitFullscreenElement ||
			document.msFullscreenElement;
		var requestFullscreen =
			element.requestFullscreen ||
			element.mozRequestFullScreen ||
			element.webkitRequestFullscreen ||
			element.msRequestFullscreen;

		// If this is the first time
		if (!handlerAdded) {
			document.addEventListener('fullscreenerror', fullscreenErrorHandler);
			document.addEventListener('webkitfullscreenerror', fullscreenErrorHandler);
			document.addEventListener('mozfullscreenerror', fullscreenErrorHandler);
			document.addEventListener('MSFullscreenError', fullscreenErrorHandler);
			handlerAdded = true;
		}

		// Toggle fullscreen
		if (fullscreenElement === element) {
			exitFullscreen.apply(document);
		} else {
			requestFullscreen.apply(element);
		}
	} module.exports.toggle = toggle;

/***/ }
/******/ ])