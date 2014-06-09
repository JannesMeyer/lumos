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

	/** @jsx React.DOM */// var keypressTool = require('../dist/lib/keypress-tool');
	var keypressTool = {};
	// var React = require('react');

	/********************************
	   React
	 ********************************/

	// function getPreviousAndNext() {
	// 	var prev, next, i, link;
	// 	var links = document.getElementsByTagName('link');
	// 	for (i = 0; i < links.length; ++i) {
	// 		link = links[i];
	// 		if (link.rel === 'prev') {
	// 			prev = link.href;
	// 		} else if (link.rel === 'next') {
	// 			next = link.href;
	// 		}
	// 	};
	// 	return { prev, next };
	// }

	var Header = React.createClass({displayName: 'Header',
		render: function() {
			return (
				React.DOM.header( {className:"m-header"}, 
					BreadcrumbList( {breadcrumbs:this.props.breadcrumbs, dirs:this.props.dirs} ),
					SearchBar(null )
				)
			);
		}
	});

	var BreadcrumbList = React.createClass({displayName: 'BreadcrumbList',
		render: function() {
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
		render: function() {
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
		render: function() {
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
		render: function() {
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
		handleClick: function(e) {
			if (this.props.name === 'fullscreen') {
				// TODO: fullscreen as state
				toggleFullscreen(document.documentElement);
				e.currentTarget.blur();
				e.preventDefault();
			}
		},
		render: function() {
			return (
				React.DOM.a( {className:'button-' + this.props.name, href:this.props.href, title:this.props.title, onClick:this.handleClick}, 
					React.DOM.span( {className:'glyphicon glyphicon-' + this.props.icon})
				)
			);
		}
	});

	var LumosApplication = React.createClass({displayName: 'LumosApplication',
		getInitialState: function() {
			var colors = ['purple-mist', 'orange', 'blue', 'apple', 'cyan'];
			var color = colors[Math.floor(Math.random() * colors.length)];
			return { color:color };
		},
		componentDidMount: function() {
			window.addEventListener('keydown', keypressTool.handleKeyDown);
			// getPreviousAndNext();
		},
		componentWillUnmount: function() {
		    window.removeEventListener('keydown', keypressTool.handleKeyDown);
		},
		render: function() {
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

/***/ }
/******/ ])