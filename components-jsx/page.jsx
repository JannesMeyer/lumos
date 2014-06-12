import keypress from 'lib/keypress-tool';
import fullscreen from 'lib/fullscreen-tool';
import Promise from 'bluebird'; // Replace native promises

/*
- [XMLHttpRequest | MDN](https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest)
- [XMLHttpRequest wrapped into a promise](https://gist.github.com/matthewp/3099268)
 */
function getJSON(path) {
	var req = new XMLHttpRequest();
	req.open('GET', path);
	req.setRequestHeader('Accept', 'application/json');

	return new Promise(function(resolve, reject) {
		req.onload = event => {
			try {
				resolve(JSON.parse(req.response));
			} catch(e) {
				reject(e);
			}
		};
		req.onerror = event => { reject(new Error(req.status)); };
		req.ontimeout = event => { reject(new Error('Timed out')); };
		// req.onabort
		req.send();
	});
}

addEventListener('popstate', event => {
	if (event.state) {
		data = event.state;
		renderBody();
	} else {
		console.warn('state is null after popstate event');
	}
});

function navigateTo(path) {
	getJSON(path)
	.then(newData => {
		history.pushState(newData, null, path);
		data = newData;
		renderBody();
	})
	.catch(err => {
		console.error(err);
		throw err;
	});
}

keypress.bind({}, 'e', event => {
	if (data.editURL) {
		location.href = data.editURL;
	}
});
keypress.bind({}, 'j', event => {
	if (data.nextItem) {
		navigateTo(data.nextItem.link);
	}
});
keypress.bind({}, 'k', event => {
	if (data.prevItem) {
		navigateTo(data.prevItem.link);
	}
});
keypress.bind({}, 'r', event => {
	navigateTo('/');
});
keypress.bind({meta: true}, 'up', event => {
	navigateTo('..');
});
keypress.bind({}, 'f', event => {
	fullscreen.toggle(document.documentElement);
});
keypress.bind({inputEl: true}, 'esc', event => {
	if (event.target.blur) {
		event.target.blur();
	}
});


var Header = React.createClass({
	render() {
		return (
			<header className="m-header">
				<BreadcrumbList breadcrumbs={this.props.breadcrumbs} dirs={this.props.dirs} />
				<SearchBar />
			</header>
		);
	}
});

var BreadcrumbList = React.createClass({
	handleClick(e) {
		navigateTo(e.currentTarget.pathname);
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
		navigateTo(e.currentTarget.pathname);
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
	render() {
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
	}
});

var PageButton = React.createClass({
	handleClick(event) {
		if (this.props.name === 'fullscreen') {
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
	pickRandomColor() {
		var colors = ['purple-mist', 'orange', 'blue', 'cyan']; // 'apple'
		return colors[Math.floor(Math.random() * colors.length)];
	},
	getInitialState() {
		return {
			color: this.pickRandomColor(),
			path: ''
		};
	},
	componentDidMount() {
		history.replaceState(this.props.data, null, location.pathname);
	},
	render() {
		console.log('rendering');
		var data = this.props.data;

		return (
			<div className={'m-container s-' + this.state.color}>
				<Header breadcrumbs={data.breadcrumbs} dirs={data.dirs} />
				<div>
					<Page title={data.title} creationDate={data.creationDate} content={data.content} editURL={data.editURL} />
					<Navigation items={data.items} />
				</div>
			</div>
		);
	}
});

function renderBody() {
	React.renderComponent(<LumosApplication data={data} />, document.body);
}

// Initial render
renderBody(data);
