/** @jsx React.DOM */

module React from 'react'

var app;
var links = {};
var currentIconColor;
var historyApiSupported = typeof window !== 'undefined' && window.history && !!window.history.pushState;

var Header = React.createClass({
	componentDidUpdate() {
		// Change favicon color based on theme
		var header = this.refs.header.getDOMNode();
		var style = window.getComputedStyle(header);

		// Skip if it's the same color again
		if (style.borderBottomColor === currentIconColor) {
			return;
		}

		var matches = style.borderBottomColor.match(/^rgb\((\d+), (\d+), (\d+)\)$/);
		if (matches) {
			currentIconColor = style.borderBottomColor;
			var favicon = require('client-lib/favicon-tool');
			favicon.load(links.icon.href, function(iconImg) {
				var color = [matches[1], matches[2], matches[3]];
				links.icon.href = favicon.colorize(iconImg, color);
				links.icon.parentNode.replaceChild(links.icon, links.icon);
			});
		} else {
			console.warn('Could not identify the theme color');
		}
	},
	render() {
		var colors = ['blue', 'yellow', 'green', 'red', 'purple', 'cyan', 'orange', 'magenta', 'blue-mist', 'purple-mist', 'tan', 'lemon-lime', 'apple', 'teal', 'silver', 'red-chalk', 'none'];
		return (
			<header className="m-header" ref="header">
				<BreadcrumbList breadcrumbs={this.props.breadcrumbs} dirs={this.props.dirs} />
				<ColorPicker colors={colors} />
				<SearchBar />
			</header>
		);
	}
});

var ColorPicker = React.createClass({
	handleChange(event) {
		app.setState({ color: event.target.value });
	},
	render() {
		var colors = this.props.colors;
		var currentColor = app.state.color;
		return (
			<select value={currentColor} onChange={this.handleChange} className="m-colorpicker">
			{colors.map(color =>
				<option value={color}>{color}</option>
			)}
			</select>
		);
	}
});

var BreadcrumbList = React.createClass({
	handleClick(e) {
		var title = e.currentTarget.firstChild.textContent;
		var path = e.currentTarget.pathname;
		navigateTo(path, title);
		e.preventDefault();
	},
	render() {
		var breadcrumbs = this.props.breadcrumbs.map(item =>
			<li key={item.path}><a href={item.path} onClick={this.handleClick}>{item.name}</a></li>
		);
		var dirs = this.props.dirs.map(item =>
			<li key={item.relative}><a href={item.link} onClick={this.handleClick}>{item.relative}</a></li>
		);
		return (
			<ol>
				{breadcrumbs}
				<li className="more"><ol>{dirs}</ol></li>
			</ol>
		);
	}
});

var SearchBar = React.createClass({
	componentDidMount() {
		var keypress = require('client-lib/keypress-tool');
		keypress.bind({}, '/', event => {
			this.refs.searchBox.getDOMNode().focus();
			event.preventDefault();
		});
	},
	render() {
		return (
			<form method="get">
				<input
					className="m-search"
					ref="searchBox"
					type="text"
					name="q"
					autoComplete="off"
					spellCheck="false"
					dir="auto" />
			</form>
		);
	}
});

var Navigation = React.createClass({
	handleClick(e) {
		// Only handle left button clicks
		if (e.button !== 0) {
			return;
		}

		var title = e.currentTarget.firstChild.textContent;
		var path = e.currentTarget.pathname;
		navigateTo(path, title);
		e.preventDefault();
	},
	render() {
		var items = this.props.items;
		return (
			<nav className="m-navigation">
				<ul>{items.map((item, i) =>
					<li className={item.isActive ? 'active' : ''} key={item.name}>
						<a href={item.link} onClick={this.handleClick}>{item.name}</a>
					</li>
				)}</ul>
			</nav>
		);
	}
});

var Page = React.createClass({
	shouldComponentUpdate(nextProps) {
		return nextProps.filePath !== this.props.filePath;
	},
	render() {
		// TODO: no content: <p style="color: #999">+++ empty +++</p>
		return (
			<section className="m-page" role="content">
				<div className="m-page-buttons">
					<PageButton name="edit" icon="pencil" href={this.props.editURL} title="Edit page (E)" />
					<PageButton name="fullscreen" icon="resize-full" href="" title="Toggle fullscreen (F)" />
				</div>
				<div className="m-page-title">
					<h1>{this.props.title}</h1>
					<p>{this.props.creationDate}</p>
				</div>
				<article dangerouslySetInnerHTML={{ __html: this.props.content }} />
			</section>
		);
		// this.props.creationTime
	}
});

var PageButton = React.createClass({
	handleClick(event) {
		if (this.props.name === 'fullscreen') {
			var fullscreen = require('client-lib/fullscreen-tool');
			// TODO: fullscreen as state
			fullscreen.toggle(document.documentElement);
			event.currentTarget.blur();
			event.preventDefault();
		}
	},
	render() {
		return (
			<a className={'button-' + this.props.name} href={this.props.href} title={this.props.title} onClick={this.handleClick}>
				<span className={'glyphicon glyphicon-' + this.props.icon}></span>
			</a>
		);
	}
});

var LumosApplication = React.createClass({
	getInitialState() {
		app = this;
		return {
			color: 'tan',
			path: ''
		};
	},
	componentDidMount() {
		console.log('componentDidMount');
		history.replaceState(this.props.data, null, location.pathname);

		// TODO: Render everything with React and get rid of this DOM searching
		var linkNodes = document.getElementsByTagName('link');
		for (var i = 0; i < linkNodes.length; ++i) {
			var linkNode = linkNodes[i];
			links[linkNode.rel] = linkNode;
		}
	},
	componentWillUpdate() {
		console.log('componentWillUpdate');


		// TODO: Scroll to the top before
		// module scroll from 'client-lib/scroll-tool';
		document.body.scrollTop = 0;
	},
	render() {
		var data = this.props.data;

		return (
			<div className={'m-container s-' + this.state.color}>
				<Header breadcrumbs={data.breadcrumbs} dirs={data.dirs} />
				<div>
					<Page filePath={data.filePath}
					      title={data.title}
					      creationDate={data.creationDate}
					      content={data.content}
					      editURL={data.editURL} />
					<Navigation items={data.items} />
				</div>
			</div>
		);
	}
});

// TODO: use location.href if history api is not supported
// TODO: links inside the page
// TODO: replace this with state
// TODO: Require a node (mid-tree or leaf) as argument
// https://code.google.com/p/chromium/issues/detail?id=50298
function navigateTo(path, title) {
	// TODO: Queue push state when in fullscreen, because it would exit fullscreen mode
	history.pushState({}, undefined, path);
	document.title = title;

	var xhr = require('client-lib/xhr-tool');
	xhr.getJSON(path)
	.then(newData => {
		history.replaceState(newData, undefined, path);
		data = newData;
		// TODO: Scroll to top
		renderToDocument(data, document.body);
	})
	.catch(err => {
		console.error(err);
		throw err;
	});
}

function renderToDocument(data, mountNode) {
	return React.renderComponent(<LumosApplication data={data} />, mountNode);
}
function renderToString(data) {
	return React.renderComponentToString(<LumosApplication data={data} />);
}

// function navigateTo(target, name) {
// }

exports.navigateTo = navigateTo;
exports.renderToDocument = renderToDocument;
exports.renderToString = renderToString;