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

	/** @jsx React.DOM */

	var keypress = __webpack_require__(1);
	var fullscreen = __webpack_require__(2);
	var scroll = __webpack_require__(3);
	// Replace native promises
	// import Promise from 'bluebird';

	console.log('load');

	addEventListener('popstate', function() {
		console.log('popstate');
	});

	/* Chrome sucks for this XHR stuff:

	https://code.google.com/p/chromium/issues/detail?id=108425
	https://code.google.com/p/chromium/issues/detail?id=108766
	https://code.google.com/p/chromium/issues/detail?id=94369#c65
	http://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html#sec13.13

	[JSON breaking back button in Chrome, Reload Button in IE (Showing as naked data) - Stack Overflow](http://stackoverflow.com/questions/10715852/json-breaking-back-button-in-chrome-reload-button-in-ie-showing-as-naked-data)

	Cache-Control: no-cache, no-store, max-age=0, must-revalidate
	Pragma: no-cache
	Expires: Fri, 01 Jan 1990 00:00:00 GMT

	IE sucks when using vary:
	http://crisp.tweakblogs.net/blog/311/internet-explorer-and-cacheing-beware-of-the-vary.html

	Chrome sucks for link rel="subresource":
	https://code.google.com/p/chromium/issues/detail?id=312327
	http://caffeinatetheweb.com/baking-acceleration-into-the-web-itself/
	https://docs.google.com/document/d/1HeTVglnZHD_mGSaID1gUZPqLAa1lXWObV-Zkx6q_HF4/edit

	*/

	/*
	- [XMLHttpRequest | MDN](https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest)
	- [XMLHttpRequest wrapped into a promise](https://gist.github.com/matthewp/3099268)
	 */
	function getJSON(path) {
		var req = new XMLHttpRequest();
		req.open('GET', path);
		req.setRequestHeader('Accept', 'application/json');
		// req.dataType = 'json';

		return new Promise(function(resolve, reject) {
			req.onload = function(event)  {
				try {
					resolve(JSON.parse(req.response));
				} catch(e) {
					reject(e);
				}
			};
			req.onerror = function(event)  { reject(new Error(req.status)); };
			req.ontimeout = function(event)  { reject(new Error('Timed out')); };
			// req.onabort
			req.send();
		});
	}

	addEventListener('popstate', function(event)  {
		if (event.state) {
			data = event.state;
			renderBody();
		} else {
			console.warn('state is null after popstate event');
		}
	});

	// TODO: links inside the page
	function navigateTo(path) {
		// TODO: Queue push state when in fullscreen, because it would exit fullscreen mode
		history.pushState(undefined, undefined, path);
		getJSON(path)
		.then(function(newData)  {
			history.replaceState(newData, undefined, path);
			data = newData;
			// TODO: Scroll to top
			renderBody();
		})
		.catch(function(err)  {
			console.error(err);
			throw err;
		});
	}

	/**
	 * Key events
	 */

	keypress.bind({}, 'e', function(event)  {
		if (data.editURL) {
			location.href = data.editURL;
		}
	});
	function navigateToNext(e) {
		if (data.nextItem) {
			navigateTo(data.nextItem.link);
		}
		e.preventDefault();
	}
	function navigateToPrev(e) {
		if (data.prevItem) {
			navigateTo(data.prevItem.link);
		}
		e.preventDefault();
	}
	keypress.bind({}, 'j', navigateToNext);
	keypress.bind({}, 'k', navigateToPrev);
	keypress.bind({}, 'right', navigateToNext);
	keypress.bind({}, 'left', navigateToPrev);
	keypress.bind({}, 'enter', navigateToNext);
	keypress.bind({shift: true}, 'enter', navigateToPrev);

	// Only go further if we are at the bottom of the current page
	keypress.bind({}, 'down', scroll.ifAtBottom(navigateToNext));
	keypress.bind({}, 'space', scroll.ifAtBottom(navigateToNext));
	// TODO: sroll the new page to the bottom when going back
	keypress.bind({shift: true}, 'space', scroll.ifAtTop(navigateToPrev));
	keypress.bind({}, 'up', scroll.ifAtTop(navigateToPrev));

	keypress.bind({}, 'r', function(event)  {
		navigateTo('/');
	});
	keypress.bind({meta: true}, 'up', function(event)  {
		navigateTo('..');
	});
	keypress.bind({}, 'f', function(event)  {
		fullscreen.toggle(document.documentElement);
	});
	keypress.bind({inputEl: true}, 'esc', function(event)  {
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
		handleClick:function(e) {
			navigateTo(e.currentTarget.pathname);
			e.preventDefault();
		},
		render:function() {
			var breadcrumbs = this.props.breadcrumbs.map(function(item) 
				{return React.DOM.li( {key:item.path}, React.DOM.a( {href:item.path, onClick:this.handleClick}, item.name));}.bind(this)
			);
			var dirs = this.props.dirs.map(function(item) 
				{return React.DOM.li( {key:item.relative}, React.DOM.a( {href:item.link, onClick:this.handleClick}, item.relative));}.bind(this)
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
			keypress.bind({}, '/', function(event)  {
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
		handleClick:function(e) {
			navigateTo(e.currentTarget.pathname);
			e.preventDefault();
		},
		render:function() {
			var items = this.props.items;
			return (
				React.DOM.nav( {className:"m-navigation"}, 
					React.DOM.ul(null, items.map(function(item, i) 
						{return React.DOM.li( {className:item.isActive ? 'active' : '', key:item.name}, 
							React.DOM.a( {href:item.link, onClick:this.handleClick}, item.name)
						);}.bind(this)
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
						PageButton( {name:"edit", icon:"pencil", href:this.props.editURL, title:"Edit page (E)"} ),
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
			var colors = ['purple-mist', 'orange', 'blue', 'cyan']; // apple
			return colors[Math.floor(Math.random() * colors.length)];
		},
		getInitialState:function() {
			return {
				color: 'blue',
				path: ''
			};
		},
		componentDidMount:function() {
			console.log('componentDidMount');
			history.replaceState(this.props.data, null, location.pathname);
		},
		componentWillUpdate:function() {
			console.log('componentWillUpdate');
			// Scroll to the top before
			document.body.scrollTop = 0;
		},
		render:function() {
			console.log('render');
			var data = this.props.data;

			return (
				React.DOM.div( {className:'m-container s-' + this.state.color}, 
					Header( {breadcrumbs:data.breadcrumbs, dirs:data.dirs} ),
					React.DOM.div(null, 
						Page( {title:data.title, creationDate:data.creationDate, content:data.content, editURL:data.editURL} ),
						Navigation( {items:data.items} )
					)
				)
			);
		}
	});

	function renderBody() {
		React.renderComponent(LumosApplication( {data:data} ), document.body);
	}

	// Initial render
	renderBody(data);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
		Only some keys work in Safari in fullscreen mode
		9	tab
		13	enter
		32	space
		37	left
		38	up
		39	right
		40	down

		112	F1
		123 F12

		186	;
		187	=
		188	,
		189	-
		190	.
		191	/
		192 `
		219	[
		220	\
		221	]
		222	"
	 */

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

	// webkitRequestFullScreen fails when passing Element.ALLOW_KEYBOARD_INPUT in Safari 5.1.2
	// http://stackoverflow.com/questions/8427413/webkitrequestfullscreen-fails-when-passing-element-allow-keyboard-input-in-safar

	var fullscreenEnabled = getEnabled();
	var exitFullscreen = getExitFunc();

	function errorHandler() {
		alert('Fullscreen operation failed');
	}

	// function stateChangeHandler() {
	// 	state = getElement() !== undefined;
	// }

	function getElement() {
		return document.fullscreenElement ||
		       document.mozFullScreenElement ||
		       document.webkitFullscreenElement ||
		       document.msFullscreenElement;
	}

	function getRequestFunc(element) {
		var fn = element.requestFullscreen ||
		         element.mozRequestFullScreen ||
		         element.webkitRequestFullscreen ||
		         element.msRequestFullscreen;
		return fn.bind(element);
	}

	function getExitFunc() {
		var fn = document.exitFullscreen ||
		         document.mozCancelFullScreen ||
		         document.webkitExitFullscreen ||
		         document.msExitFullscreen;
		return fn.bind(document);
	}

	function getEnabled() {
		return document.fullscreenEnabled ||
		       document.mozFullScreenEnabled ||
		       document.webkitFullscreenEnabled ||
		       document.msFullscreenEnabled;
	}

	function getState() {
		return getElement() !== undefined;
	} module.exports.getState = getState;

	function toggle(element) {
		if (!fullscreenEnabled) {
			console.warn('no fullscreen capability');
			return;
		}

		// If this is the first time
		if (!handlerAdded) {
			document.addEventListener('fullscreenerror', errorHandler);
			document.addEventListener('webkitfullscreenerror', errorHandler);
			document.addEventListener('mozfullscreenerror', errorHandler);
			document.addEventListener('MSFullscreenError', errorHandler);
			// document.addEventListener('fullscreenchange', stateChangeHandler);
			// document.addEventListener('webkitfullscreenchange', stateChangeHandler);
			// document.addEventListener('mozfullscreenchange', stateChangeHandler);
			// document.addEventListener('MSFullscreenChange', stateChangeHandler);
			handlerAdded = true;
		}

		// Toggle fullscreen
		if (getElement() !== element) {
			getRequestFunc(element)(); // Element.ALLOW_KEYBOARD_INPUT
		} else {
			exitFullscreen();
		}
	} module.exports.toggle = toggle;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var html = document.documentElement;
	var body = document.body;


	function isAtTop() {
		// var scrollY = document.body.scrollTop || document.documentElement.scrollTop;
		return window.scrollY <= 0;
	} module.exports.isAtTop = isAtTop;

	// TODO: this cannot determined accurately until the document has finished loading
	function isAtBottom() {
		// Don't work well with html and body at 100% height:
		// html.getBoundingClientRect()
		// html.getClientRects()

		return html.scrollHeight - html.clientHeight - window.scrollY <= 0;
	} module.exports.isAtBottom = isAtBottom;

	function ifAtTop(callback) {
		return function(event) {
			if (isAtTop()) {
				callback(event);
			}
		};
	} module.exports.ifAtTop = ifAtTop;

	function ifAtBottom(callback) {
		return function(event) {
			if (isAtBottom()) {
				callback(event);
			}
		};
	} module.exports.ifAtBottom = ifAtBottom;

/***/ }
/******/ ])