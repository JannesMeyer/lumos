/** @jsx React.DOM */

/********************************
   Helper functions
 ********************************/

function getFirstOfClass(className) {
	return document.getElementsByClassName(className)[0];
}

function toggleFullscreen(el) {
	var fullscreenEnabled = document.fullscreenEnabled ||
	    document.mozFullScreenEnabled ||
	    document.webkitFullscreenEnabled ||
	    document.msFullscreenEnabled;
	if (!fullscreenEnabled) { return; }

	var fullscreenElement = document.fullscreenElement ||
	    document.mozFullScreenElement ||
	    document.webkitFullscreenElement ||
	    document.msFullscreenElement;
	var exitFullscreen = document.exitFullscreen ||
	    document.mozCancelFullScreen ||
	    document.webkitExitFullscreen ||
	    document.msExitFullscreen;
	var requestFullscreen = el.requestFullscreen ||
	    el.mozRequestFullScreen ||
	    el.webkitRequestFullscreen ||
	    el.msRequestFullscreen;

	if (fullscreenElement === el) {
		exitFullscreen.apply(document);
	} else {
		requestFullscreen.apply(el);
	}
}

function fullscreenErrorHandler() {
	alert('Fullscreen operation failed');
}

document.addEventListener('fullscreenerror', fullscreenErrorHandler);
document.addEventListener('webkitfullscreenerror', fullscreenErrorHandler);
document.addEventListener('mozfullscreenerror', fullscreenErrorHandler);
document.addEventListener('MSFullscreenError', fullscreenErrorHandler);

/********************************
   React
 ********************************/

var data = { baseDirName: 'Notes',
  breadcrumbs: [ { name: 'Notes', path: '/', isActive: false } ],
  title: 'Google',
  filePath: '/Users/jannes/Dropbox/Notes/Google.md',
  content: '<h1 id="list-of-google-searches-to-carry-out">List of Google searches to carry out</h1>\n<ul>\n<li>Konkurrenz von Mobilinga<ul>\n<li>Repetico</li>\n<li><a href="http://www.phase-6.com/">Phase 6</a></li>\n<li><a href="http://babbel.com/">Babbel</a></li>\n</ul>\n</li>\n<li>OmniFocus 2</li>\n</ul>\n',
  creationDate: '24.05.2014',
  creationTime: '',
  items:
   [ { absolute: '/Users/jannes/Dropbox/Notes/Bookmarks.md',
       relative: 'Bookmarks.md',
       name: 'Bookmarks',
       link: 'Bookmarks',
       isActive: false },
     { absolute: '/Users/jannes/Dropbox/Notes/Find launch items.md',
       relative: 'Find launch items.md',
       name: 'Find launch items',
       link: 'Find%20launch%20items',
       isActive: false },
     { absolute: '/Users/jannes/Dropbox/Notes/Finds.md',
       relative: 'Finds.md',
       name: 'Finds',
       link: 'Finds',
       isActive: false },
     { absolute: '/Users/jannes/Dropbox/Notes/Google.md',
       relative: 'Google.md',
       name: 'Google',
       link: '.',
       isActive: true },
     { absolute: '/Users/jannes/Dropbox/Notes/Lumos.md',
       relative: 'Lumos.md',
       name: 'Lumos',
       link: 'Lumos',
       isActive: false },
     { absolute: '/Users/jannes/Dropbox/Notes/OSX TODO.md',
       relative: 'OSX TODO.md',
       name: 'OSX TODO',
       link: 'OSX%20TODO',
       isActive: false },
     { absolute: '/Users/jannes/Dropbox/Notes/Snippets.md',
       relative: 'Snippets.md',
       name: 'Snippets',
       link: 'Snippets',
       isActive: false },
     { absolute: '/Users/jannes/Dropbox/Notes/TabAttack.md',
       relative: 'TabAttack.md',
       name: 'TabAttack',
       link: 'TabAttack',
       isActive: false },
     { absolute: '/Users/jannes/Dropbox/Notes/TV and Movies.md',
       relative: 'TV and Movies.md',
       name: 'TV and Movies',
       link: 'TV%20and%20Movies',
       isActive: false } ],
  dirs:
   [ { absolute: '/Users/jannes/Dropbox/Notes/Archive',
       relative: 'Archive',
       link: 'Archive/' },
     { absolute: '/Users/jannes/Dropbox/Notes/Computer',
       relative: 'Computer',
       link: 'Computer/' },
     { absolute: '/Users/jannes/Dropbox/Notes/GTD',
       relative: 'GTD',
       link: 'GTD/' },
     { absolute: '/Users/jannes/Dropbox/Notes/Learning',
       relative: 'Learning',
       link: 'Learning/' },
     { absolute: '/Users/jannes/Dropbox/Notes/Material',
       relative: 'Material',
       link: 'Material/' },
     { absolute: '/Users/jannes/Dropbox/Notes/Programming',
       relative: 'Programming',
       link: 'Programming/' },
     { absolute: '/Users/jannes/Dropbox/Notes/Tagebuch',
       relative: 'Tagebuch',
       link: 'Tagebuch/' },
     { absolute: '/Users/jannes/Dropbox/Notes/Temporary',
       relative: 'Temporary',
       link: 'Temporary/' } ],
  prevItem:
   { absolute: '/Users/jannes/Dropbox/Notes/Finds.md',
     relative: 'Finds.md',
     link: 'Finds' },
  nextItem:
   { absolute: '/Users/jannes/Dropbox/Notes/Lumos.md',
     relative: 'Lumos.md',
     link: 'Lumos' } };

function getPreviousAndNext() {
	var prev, next, i, link;
	var links = document.getElementsByTagName('link');
	for (i = 0; i < links.length; ++i) {
		link = links[i];
		if (link.rel === 'prev') {
			prev = link.href;
		} else if (link.rel === 'next') {
			next = link.href;
		}
	};
	return { prev, next };
}


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
	render() {
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
	handleClick(e) {
		if (this.props.name === 'fullscreen') {
			// TODO: fullscreen state
			toggleFullscreen(document.documentElement);
			e.currentTarget.blur();
			e.preventDefault();
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
	componentWillMount() {
		getPreviousAndNext();
	},
	render() {
		var data = this.props.data;
		return (
			<div className={'m-container s-' + this.props.color}>
				<Header breadcrumbs={data.breadcrumbs} dirs={data.dirs} />
				<div>
					<Page title={data.title} creationDate={data.creationDate} content={data.content} filePath={data.filePath} />
					<Navigation items={data.items} />
				</div>
			</div>
		);
	}
});

//var color = 'purple-mist';
//var color = 'orange';
var color = 'blue';
//var color = 'apple';
//var color = 'cyan';
React.renderComponent(<LumosApplication data={data} color={color}/>, document.body);


// <li class="more">
// 	<ol>
// 		<li><a href="Archive/">Archive</a></li>
// 		<li><a href="Computer/">Computer</a></li>
// 		<li><a href="GTD/">GTD</a></li>
// 		<li><a href="Learning/">Learning</a></li>
// 		<li><a href="Material/">Material</a></li>
// 		<li><a href="Programming/">Programming</a></li>
// 		<li><a href="Tagebuch/">Tagebuch</a></li>
// 		<li><a href="Temporary/">Temporary</a></li>
// 	</ol>
// </li>