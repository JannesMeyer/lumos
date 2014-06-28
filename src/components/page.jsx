/** @jsx React.DOM */

module React from 'react'

// Master component
var app;

// Cache the accent color to avoid re-rendering the favicon
var accentColor;

// hex.colorrrs.com
var colors = {
	'blue': [96, 170, 223],         // #60aadf
	'yellow': [249, 186, 0],        // #f9ba00
	'green': [63, 191, 119],        // #3fbf77
	'red': [255, 109, 97],          // #ff6d61
	'purple': [216, 134, 200],      // #d886c8
	'cyan': [23, 183, 207],         // #17b7cf
	'orange': [255, 154, 41],       // #ff9a29
	'magenta': [243, 124, 186],     // #f37cba
	'blue-mist': [132, 154, 213],   // #849ad5
	'purple-mist': [170, 144, 211], // #aa90d3
	'tan': [187, 160, 141],         // #bba08d
	'lemon-lime': [183, 191, 39],   // #b7bf27
	'apple': [127, 191, 96],        // #7fbf60
	'teal': [0, 185, 164],          // #00b9a4
	'silver': [157, 174, 189],      // #9daebd
	'red-chalk': [249, 98, 133],    // #f96285
	'none': [160, 160, 160]         // #a0a0a0
};

// Client-side libraries
var dataSource, favicon, keypress, scroll, fullscreen;

// Feature detection
var supported = {
	history: typeof window !== 'undefined' && Boolean(window.history) && Boolean(window.history.pushState),
	canvas2D: typeof window !== 'undefined' && Boolean(window.CanvasRenderingContext2D)
};

/*
 * React components
 */

var BreadcrumbList = React.createClass({
	handleClick(e) {
		if (e.button === 0) {
			var title = e.target.firstChild.data;
			var path = e.target.pathname;
			navigateTo(path, title);
			e.preventDefault();
		}
	},
	render() {
		return (
			<ol>
				{this.props.breadcrumbs.map(item =>
					<li key={item.path}><a href={item.path} onClick={this.handleClick}>{item.name}</a></li>
				)}
				<li className="more">
					<ol>
						{this.props.dirs.map(item =>
							<li key={item.relative}><a href={item.link} onClick={this.handleClick}>{item.relative}</a></li>
						)}
					</ol>
				</li>
			</ol>
		);
	}
});

var SearchBar = React.createClass({
	componentDidMount() {
		keypress.on([], '/', event => {
			var el = this.refs.searchBox.getDOMNode();
			el.focus();
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

var ColorPicker = React.createClass({
	handleChange(e) {
		var color = e.target.value;
		app.setState({ color });
	},
	render() {
		return (
			<select value={this.props.color} onChange={this.handleChange} className="m-colorpicker">
			{this.props.colors.map(color =>
				<option value={color} key={color}>{color}</option>
			)}
			</select>
		);
	}
});

var Header = React.createClass({
	render() {
		return (
			<header className="m-header" ref="header">
				<BreadcrumbList breadcrumbs={this.props.breadcrumbs} dirs={this.props.dirs} />
				<SearchBar />
				<ColorPicker colors={this.props.colors} color={this.props.color} />
			</header>
		);
	}
});

var Navigation = React.createClass({
	handleMouseDown(e) {
		if (e.button === 0) {
			var title = e.target.firstChild.data;
			var path = e.target.pathname;
			navigateTo(path, title);
		}
	},
	handleClick(e) {
		if (e.button === 0) {
			e.preventDefault();
		}
	},
	render() {
		var items = this.props.items;
		return (
			<nav className="m-navigation">
				<ul>{items.map((item, i) =>
					<li key={item.name} className={item.isActive ? 'active' : ''}>
						<a href={item.link} onMouseDown={this.handleMouseDown} onClick={this.handleClick}>{item.name}</a>
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
					<FullscreenButton />
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
	render() {
		var props = this.props;
		return (
			<a className={'button-' + props.name} href={props.href} title={props.title} onClick={props.clickHandler}>
				<span className={'glyphicon glyphicon-' + props.icon}></span>
			</a>
		);
	}
});

var FullscreenButton = React.createClass({
	getInitialState() {
		return {
			isFullscreen: false
		};
	},
	componentDidMount() {
		keypress.on([], 'f', this.toggleFullscreen);
	},
	toggleFullscreen(e) {
		fullscreen.toggle(document.documentElement);
		this.setState({ isFullscreen: !this.state.isFullscreen });
		e.preventDefault();
	},
	render() {
		return (
			<PageButton name="fullscreen"
			            icon={this.state.isFullscreen ? 'resize-small' : 'resize-full'}
			            href=""
			            title="Toggle fullscreen (F)"
			            clickHandler={this.toggleFullscreen} />
		);
	}
});

var LumosApplication = React.createClass({
	// componentWillUpdate() {
	// 	// TODO: Scroll to the top before
	// 	document.body.scrollTop = 0;
	// },
	render() {
		var data = this.props.data;

		return (
			<div className={'m-container s-' + this.props.color}>
				<Header breadcrumbs={data.breadcrumbs}
				        dirs={data.dirs}
				        colors={this.props.colors}
				        color={this.props.color} />
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

// TODO: Render the icon on the server-side, too
var Favicon = React.createClass({
	colorize() {
		if (!supported.canvas2D) {
			throw new Error('Canvas2D not supported');
		}

		this.faviconTemplate.then(result => {
			var context = result[0];
			var imageData = result[1];
			var node = this.getDOMNode();
			var colorName = this.props.color;
			var color = colors[colorName];

			node.href = favicon.colorize(context, imageData, color);
			node.parentNode.replaceChild(node, node);
		});
	},
	shouldComponentUpdate(nextProps) {
		return nextProps.color !== this.props.color;
	},
	componentDidMount() {
		if (supported.canvas2D) {
			this.faviconTemplate = favicon.load(this.props.template);
		}
		this.colorize();
	},
	componentDidUpdate() {
		this.colorize();
	},
	render() {
		return <link rel="icon" href={this.props.template} />;
	}
});

var MyHTML = React.createClass({

	colors: Object.keys(colors),

	getInitialState() {
		return {
			color: 'apple'
		};
	},

	componentDidMount() {
		if (supported.history) {
			var path = location.pathname;
			history.replaceState(this.props.data, undefined, path);

			addEventListener('popstate', e => {
				if (!e.state) {
					console.warn('undefined state after a popstate event', e.state);
					return;
				}
				this.setProps({ data: e.state });
			});
		}

		// Helper functions
		var goToNext = (e) => {
			var target = this.props.data.nextItem;
			if (target) {
				navigateTo(target.link, target.name);
				e.preventDefault();
			}
		}
		var goToPrevious = (e) => {
			var target = this.props.data.prevItem;
			if (target) {
				navigateTo(target.link, target.name);
				e.preventDefault();
			}
		}

		// Key bindings
		keypress.on([], 'e', event => {
			if (this.props.data.editURL) {
				location.href = this.props.data.editURL;
			}
		});
		keypress.on([], 'j', goToNext);
		keypress.on([], 'k', goToPrevious);
		keypress.on([], 'right', goToNext);
		keypress.on([], 'left', goToPrevious);
		keypress.on([], 'enter', goToNext);
		keypress.on(['shift'], 'enter', goToPrevious);

		keypress.on(['executeDefault'], 'down', scroll.ifAtBottom(goToNext));
		keypress.on(['executeDefault'], 'up', scroll.ifAtTop(goToPrevious));
		keypress.on(['executeDefault'], 'space', scroll.ifAtBottom(goToNext));
		keypress.on(['executeDefault', 'shift'], 'space', scroll.ifAtTop(goToPrevious));

		// TODO: fix titles
		keypress.on(['meta'], 'up', event => navigateTo('..', 'Title'));
		keypress.on([], 'r', event => navigateTo('/', 'Title'));

		keypress.on(['inputEl'], 'esc', event => {
			var el = e.target;
			if (el.blur) { el.blur(); }
		});
	},

	render() {
		var data = this.props.data;

		// LiveReload
		// <script src="http://notes:35729/livereload.js?snipver=1"></script>
		// <link rel="preload" href="/fonts/glyphicons-halflings-regular.woff" type="font/woff" />

		// TODO: Send 'Content-Type'(+JSON) and 'X-UA-Compatible' as headers
		return (
			<html>
				<head>
					<meta charSet="utf-8" />
					<title>{data.title}</title>
					<meta http-equiv="X-UA-Compatible" content="IE=edge" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<link rel="stylesheet" href="/stylesheets/bootstrap.min.css" />
					<link rel="stylesheet" href="/stylesheets/theme-one.css" />
					<link rel="stylesheet" href="/stylesheets/hljs/github.css" />
					<Favicon color={this.state.color} template="/images/favicon-template.png" />
					<script defer src="/javascripts/main.bundle.js"></script>
				</head>

				<body>
					<LumosApplication data={data} colors={this.colors} color={this.state.color} />
				</body>
			</html>
		);
	}
});


/*
 * Exports
 */

export function renderToString(data) {
	return React.renderComponentToString(<MyHTML data={data} />);
}

export function renderToDOM(data) {
	dataSource = require('client-lib/data-source');
	favicon    = require('client-lib/favicon-tool');
	keypress   = require('client-lib/keypress-tool');
	scroll     = require('client-lib/scroll-tool');
	fullscreen = require('client-lib/fullscreen-tool');

	app = React.renderComponent(<MyHTML data={data} />, document);
	return app;
}

// TODO: links inside the page
// TODO: Require a node (mid-tree or leaf) as argument
// https://code.google.com/p/chromium/issues/detail?id=50298
function navigateTo(path, title) {
	if (!supported.history) {
		// Fall back to normal navigation if the browser doesn't support the history API
		location.href = path;
	}

	// TODO: Queue push state when in fullscreen, because it would exit fullscreen mode (in Chrome)
	history.pushState(undefined, undefined, path);

	dataSource.get(path)
	.then(data => {
		history.replaceState(data, undefined, path);
		// TODO: Scroll to top
		app.setProps({ data });
	});
}