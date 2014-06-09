"use strict";
function getFirstOfClass(className) {
  return document.getElementsByClassName(className)[0];
}
function toggleFullscreen(el) {
  var fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled || document.msFullscreenEnabled;
  if (!fullscreenEnabled) {
    return;
  }
  var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
  var exitFullscreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen;
  var requestFullscreen = el.requestFullscreen || el.mozRequestFullScreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
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
function getPreviousAndNext() {
  var prev,
      next,
      i,
      link;
  var links = document.getElementsByTagName('link');
  for (i = 0; i < links.length; ++i) {
    link = links[i];
    if (link.rel === 'prev') {
      prev = link.href;
    } else if (link.rel === 'next') {
      next = link.href;
    }
  }
  ;
  return {
    prev: prev,
    next: next
  };
}
var Header = React.createClass({
  displayName: 'Header',
  render: function() {
    return (React.DOM.header({className: "m-header"}, BreadcrumbList({
      breadcrumbs: this.props.breadcrumbs,
      dirs: this.props.dirs
    }), SearchBar(null)));
  }
});
var BreadcrumbList = React.createClass({
  displayName: 'BreadcrumbList',
  render: function() {
    var breadcrumbs = this.props.breadcrumbs.map(function(item) {
      return React.DOM.li({key: item.name}, React.DOM.a({href: item.link}, item.name));
    });
    var dirs = this.props.dirs.map(function(item) {
      return React.DOM.li({key: item.relative}, React.DOM.a({href: item.link}, item.relative));
    });
    return (React.DOM.ol(null, breadcrumbs, React.DOM.li({className: "more"}, React.DOM.ol(null, dirs))));
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
    var items = this.props.items;
    return (React.DOM.nav({className: "m-navigation"}, React.DOM.ul(null, items.map(function(item) {
      return React.DOM.li({
        className: item.isActive ? 'active' : '',
        key: item.name
      }, React.DOM.a({href: item.link}, item.name));
    }))));
  }
});
var Page = React.createClass({
  displayName: 'Page',
  render: function() {
    return (React.DOM.section({
      className: "m-page",
      role: "content"
    }, React.DOM.div({className: "m-page-buttons"}, PageButton({
      name: "edit",
      icon: "pencil",
      href: 'lumos-connect://' + this.props.filePath,
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
    if (this.props.name === 'fullscreen') {
      toggleFullscreen(document.documentElement);
      e.currentTarget.blur();
      e.preventDefault();
    }
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
  componentWillMount: function() {
    getPreviousAndNext();
  },
  render: function() {
    var data = this.props.data;
    return (React.DOM.div({className: 'm-container s-' + this.props.color}, Header({
      breadcrumbs: data.breadcrumbs,
      dirs: data.dirs
    }), React.DOM.div(null, Page({
      title: data.title,
      creationDate: data.creationDate,
      content: data.content,
      filePath: data.filePath
    }), Navigation({items: data.items}))));
  }
});
var color = 'blue';
React.renderComponent(LumosApplication({
  data: data,
  color: color
}), document.body);
