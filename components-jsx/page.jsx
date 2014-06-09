// var keypressTool = require('../dist/lib/keypress-tool');
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

var Header = React.createClass({
	render: function() {
		return (
			<header className="m-header">
				<BreadcrumbList breadcrumbs={this.props.breadcrumbs} dirs={this.props.dirs} />
				<SearchBar />
			</header>
		);
	}
});

var BreadcrumbList = React.createClass({
	render: function() {
		var breadcrumbs = this.props.breadcrumbs.map(item =>
			<li key={item.name}><a href={item.link}>{item.name}</a></li>
		);
		var dirs = this.props.dirs.map(item =>
			<li key={item.relative}><a href={item.link}>{item.relative}</a></li>
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
	render: function() {
		return (
			<form method="get">
				<input
					className="m-search"
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
	render: function() {
		var items = this.props.items;
		return (
			<nav className="m-navigation">
				<ul>{items.map(item =>
					<li className={item.isActive ? 'active' : ''} key={item.name}>
						<a href={item.link}>{item.name}</a>
					</li>
				)}</ul>
			</nav>
		);
	}
});

var Page = React.createClass({
	render: function() {
		return (
			<section className="m-page" role="content">
				<div className="m-page-buttons">
					<PageButton name="edit" icon="pencil" href={'lumos-connect://' + this.props.filePath} title="Edit page (E)" />
					<PageButton name="fullscreen" icon="resize-full" href="" title="Toggle fullscreen (F)" />
				</div>
				<div className="m-page-title">
					<h1>{this.props.title}</h1>
					<p>{this.props.creationDate}</p>
				</div>
				<article dangerouslySetInnerHTML={{ __html: this.props.content }} />
			</section>
		);
	}
});

var PageButton = React.createClass({
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
			<a className={'button-' + this.props.name} href={this.props.href} title={this.props.title} onClick={this.handleClick}>
				<span className={'glyphicon glyphicon-' + this.props.icon}></span>
			</a>
		);
	}
});

var LumosApplication = React.createClass({
	getInitialState: function() {
		var colors = ['purple-mist', 'orange', 'blue', 'apple', 'cyan'];
		var color = colors[Math.floor(Math.random() * colors.length)];
		return { color };
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
			<div className={'m-container s-' + this.state.color}>
				<Header breadcrumbs={data.breadcrumbs} dirs={data.dirs} />
				<div>
					<Page title={data.title} creationDate={data.creationDate} content={data.content} filePath={data.filePath} />
					<Navigation items={data.items} />
				</div>
			</div>
		);
	}
});
React.renderComponent(<LumosApplication data={data} />, document.body);