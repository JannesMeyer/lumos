import key from 'lib/keypress-tool';
import fullscreen from 'lib/fullscreen-tool';

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
	render() {
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
	componentDidMount() {
		key.bind(undefined, '/', (event) => {
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
	render() {
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
	render() {
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
		var colors = ['purple-mist', 'orange', 'blue', 'apple', 'cyan'];
		return colors[Math.floor(Math.random() * colors.length)];
	},
	getInitialState() {
		return {
			color: this.pickRandomColor()
		};
	},
	componentWillMount() {
		key.bind(undefined, 'e', (event) => {
			console.log('location.href = editButton.href;');
		});
		key.bind(undefined, 'f', (event) => {
			fullscreen.toggle(document.documentElement);
		});
		key.bind(undefined, 'r', (event) => {
			location.href = '/';
		});
		key.bind({ meta: true }, 'up', (event) => {
			location.href = '..';
		});
		key.bind({ inputEl: true }, 'esc', (event) => {
			if (event.target.blur) {
				event.target.blur();
			}
		});
		// if (nextUrl) {
		// 	key.bind(undefined, 'j', (event) => {
		// 		location.href = nextUrl;
		// 	});
		// }
		// if (prevUrl) {
		// 	key.bind(undefined, 'k', (event) => {
		// 		location.href = prevUrl;
		// 	});
		// }
	},
	render() {
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
