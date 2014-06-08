"use strict";
var data = {
  baseDirName: 'Notes',
  breadcrumbs: [{
    name: 'Notes',
    path: '/',
    isActive: false
  }],
  title: 'Google',
  filePath: '/Users/jannes/Dropbox/Notes/Google.md',
  content: '<h1 id="list-of-google-searches-to-carry-out">List of Google searches to carry out</h1>\n<ul>\n<li>Konkurrenz von Mobilinga<ul>\n<li>Repetico</li>\n<li><a href="http://www.phase-6.com/">Phase 6</a></li>\n<li><a href="http://babbel.com/">Babbel</a></li>\n</ul>\n</li>\n<li>OmniFocus 2</li>\n</ul>\n',
  creationDate: '24.05.2014',
  creationTime: '',
  items: [{
    absolute: '/Users/jannes/Dropbox/Notes/Bookmarks.md',
    relative: 'Bookmarks.md',
    name: 'Bookmarks',
    link: 'Bookmarks',
    isActive: false
  }, {
    absolute: '/Users/jannes/Dropbox/Notes/Find launch items.md',
    relative: 'Find launch items.md',
    name: 'Find launch items',
    link: 'Find%20launch%20items',
    isActive: false
  }, {
    absolute: '/Users/jannes/Dropbox/Notes/Finds.md',
    relative: 'Finds.md',
    name: 'Finds',
    link: 'Finds',
    isActive: false
  }, {
    absolute: '/Users/jannes/Dropbox/Notes/Google.md',
    relative: 'Google.md',
    name: 'Google',
    link: '.',
    isActive: true
  }, {
    absolute: '/Users/jannes/Dropbox/Notes/Lumos.md',
    relative: 'Lumos.md',
    name: 'Lumos',
    link: 'Lumos',
    isActive: false
  }, {
    absolute: '/Users/jannes/Dropbox/Notes/OSX TODO.md',
    relative: 'OSX TODO.md',
    name: 'OSX TODO',
    link: 'OSX%20TODO',
    isActive: false
  }, {
    absolute: '/Users/jannes/Dropbox/Notes/Snippets.md',
    relative: 'Snippets.md',
    name: 'Snippets',
    link: 'Snippets',
    isActive: false
  }, {
    absolute: '/Users/jannes/Dropbox/Notes/TabAttack.md',
    relative: 'TabAttack.md',
    name: 'TabAttack',
    link: 'TabAttack',
    isActive: false
  }, {
    absolute: '/Users/jannes/Dropbox/Notes/TV and Movies.md',
    relative: 'TV and Movies.md',
    name: 'TV and Movies',
    link: 'TV%20and%20Movies',
    isActive: false
  }],
  dirs: [{
    absolute: '/Users/jannes/Dropbox/Notes/Archive',
    relative: 'Archive',
    link: 'Archive/'
  }, {
    absolute: '/Users/jannes/Dropbox/Notes/Computer',
    relative: 'Computer',
    link: 'Computer/'
  }, {
    absolute: '/Users/jannes/Dropbox/Notes/GTD',
    relative: 'GTD',
    link: 'GTD/'
  }, {
    absolute: '/Users/jannes/Dropbox/Notes/Learning',
    relative: 'Learning',
    link: 'Learning/'
  }, {
    absolute: '/Users/jannes/Dropbox/Notes/Material',
    relative: 'Material',
    link: 'Material/'
  }, {
    absolute: '/Users/jannes/Dropbox/Notes/Programming',
    relative: 'Programming',
    link: 'Programming/'
  }, {
    absolute: '/Users/jannes/Dropbox/Notes/Tagebuch',
    relative: 'Tagebuch',
    link: 'Tagebuch/'
  }, {
    absolute: '/Users/jannes/Dropbox/Notes/Temporary',
    relative: 'Temporary',
    link: 'Temporary/'
  }],
  prevItem: {
    absolute: '/Users/jannes/Dropbox/Notes/Finds.md',
    relative: 'Finds.md',
    link: 'Finds'
  },
  nextItem: {
    absolute: '/Users/jannes/Dropbox/Notes/Lumos.md',
    relative: 'Lumos.md',
    link: 'Lumos'
  }
};
var Header = React.createClass({
  displayName: 'Header',
  render: function() {
    return (React.DOM.header({className: "m-header"}, BreadcrumbList(null), SearchBar(null)));
  }
});
var BreadcrumbList = React.createClass({
  displayName: 'BreadcrumbList',
  render: function() {
    return (React.DOM.ol(null, React.DOM.li(null, React.DOM.a({href: "/"}, "Notes"))));
  }
});
var SearchBar = React.createClass({
  displayName: 'SearchBar',
  render: function() {
    return (React.DOM.form({method: "get"}, React.DOM.input({
      className: "m-search",
      type: "text",
      name: "q",
      autoComplete: "off",
      spellCheck: "false",
      dir: "auto"
    })));
  }
});
var Navigation = React.createClass({
  displayName: 'Navigation',
  render: function() {
    return (React.DOM.nav({className: "m-navigation"}, React.DOM.ul(null, React.DOM.li({className: "file"}, React.DOM.a({href: "Bookmarks"}, "Bookmarks")), React.DOM.li({className: "file"}, React.DOM.a({href: "Find%20launch%20items"}, "Find launch items")), React.DOM.li({className: "file"}, React.DOM.a({href: "Finds"}, "Finds")), React.DOM.li({className: "file active"}, React.DOM.a({href: "."}, "Google")), React.DOM.li({className: "file"}, React.DOM.a({href: "Lumos"}, "Lumos")), React.DOM.li({className: "file"}, React.DOM.a({href: "OSX%20TODO"}, "OSX TODO")), React.DOM.li({className: "file"}, React.DOM.a({href: "Snippets"}, "Snippets")), React.DOM.li({className: "file"}, React.DOM.a({href: "TabAttack"}, "TabAttack")), React.DOM.li({className: "file"}, React.DOM.a({href: "TV%20and%20Movies"}, "TV and Movies")))));
  }
});
var Page = React.createClass({
  displayName: 'Page',
  render: function() {
    var editLink = 'lumos-connect://' + this.props.filePath;
    return (React.DOM.section({
      className: "m-page",
      role: "content"
    }, React.DOM.div({className: "m-page-buttons"}, PageButton({
      name: "edit",
      icon: "pencil",
      href: editLink,
      title: "Edit page (E)"
    }), PageButton({
      name: "fullscreen",
      icon: "resize-full",
      href: "",
      title: "Toggle fullscreen (F)"
    })), React.DOM.div({className: "m-page-title"}, React.DOM.h1(null, this.props.title), React.DOM.p(null, this.props.creationDate)), React.DOM.article({dangerouslySetInnerHTML: {__html: this.props.content}})));
  }
});
var PageButton = React.createClass({
  displayName: 'PageButton',
  handleClick: function(e) {
    alert(this.props.name);
    e.preventDefault();
  },
  render: function() {
    return (React.DOM.a({
      className: 'button-' + this.props.name,
      href: this.props.href,
      title: this.props.title,
      onClick: this.handleClick
    }, React.DOM.span({className: 'glyphicon glyphicon-' + this.props.icon})));
  }
});
var LumosApplication = React.createClass({
  displayName: 'LumosApplication',
  render: function() {
    var data = this.props.data;
    return (React.DOM.div({className: 'm-container s-' + this.props.color}, Header(null), React.DOM.div(null, Page({
      title: data.title,
      creationDate: data.creationDate,
      content: data.content,
      filePath: data.filePath
    }), Navigation(null))));
  }
});
var color = 'blue';
React.renderComponent(LumosApplication({
  data: data,
  color: color
}), document.body);
