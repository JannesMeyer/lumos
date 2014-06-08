/** @jsx React.DOM */

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

var Header = React.createClass({
	render() {
		return (
			<header className="m-header">
				<BreadcrumbList />
				<SearchBar />
			</header>
		);
	}
});

var BreadcrumbList = React.createClass({
	render() {
		return (
			<ol>
				<li><a href="/">Notes</a></li>
			</ol>
		);
	}
});

var SearchBar = React.createClass({
	render() {
		return (
			<form method="get">
				<input className="m-search" type="text" name="q"
				       autoComplete="off" spellCheck="false" dir="auto" />
			</form>
		);
	}
});

var Navigation = React.createClass({
	render() {
		return (
			<nav className="m-navigation">
				<ul>
					<li className="file"><a href="Bookmarks">Bookmarks</a></li>
					<li className="file"><a href="Find%20launch%20items">Find launch items</a></li>
					<li className="file"><a href="Finds">Finds</a></li>
					<li className="file active"><a href=".">Google</a></li>
					<li className="file"><a href="Lumos">Lumos</a></li>
					<li className="file"><a href="OSX%20TODO">OSX TODO</a></li>
					<li className="file"><a href="Snippets">Snippets</a></li>
					<li className="file"><a href="TabAttack">TabAttack</a></li>
					<li className="file"><a href="TV%20and%20Movies">TV and Movies</a></li>
				</ul>
			</nav>
		);
	}
});

var Page = React.createClass({
	render() {
		var editLink = 'lumos-connect://' + this.props.filePath;
		return (
			<section className="m-page" role="content">
				<div className="m-page-buttons">
					<PageButton name="edit" icon="pencil" href={editLink} title="Edit page (E)" />
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
		alert(this.props.name);
		e.preventDefault();
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
	render() {
		var data = this.props.data;
		return (
			<div className={'m-container s-' + this.props.color}>
				<Header />
				<div>
					<Page title={data.title} creationDate={data.creationDate} content={data.content} filePath={data.filePath} />
					<Navigation />
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

/*
	<li class="more">
		<ol>
			<li><a href="Archive/">Archive</a></li>
			<li><a href="Computer/">Computer</a></li>
			<li><a href="GTD/">GTD</a></li>
			<li><a href="Learning/">Learning</a></li>
			<li><a href="Material/">Material</a></li>
			<li><a href="Programming/">Programming</a></li>
			<li><a href="Tagebuch/">Tagebuch</a></li>
			<li><a href="Temporary/">Temporary</a></li>
		</ol>
	</li>
*/