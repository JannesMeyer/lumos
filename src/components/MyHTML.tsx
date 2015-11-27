// browser-only
import './MyHTML.styl';
import * as keypress from '../client-lib/keypress-tool';
import * as scroll from '../client-lib/scroll-tool';

import * as React from 'react';
import Favicon from './Favicon';
import LumosApplication from './LumosApplication';
import { colors, supported } from '../constants';



var colorNames = Object.keys(colors);

interface MyHtmlProps {
  baseDirName?: string;
  title?: string;
  breadcrumbs?: string[];
  items?: SegmentedPath[];
  dirs?: SegmentedPath[];
  content?: SegmentedPath[];
}

export default class extends React.Component<MyHtmlProps, any> {

  constructor(props) {
    super(props);
    this.state = { color: 'purple-mist' };
  }

  componentDidMount() {
    if (supported.history) {
      var path = location.pathname;
      history.replaceState(this.props.data, undefined, path);

      addEventListener('popstate', e => {
        if (!e.state) {
          console.warn('undefined state after a popstate event', e.state);
          return;
        }
        // TODO: this.setProps({ data: e.state });
      });
    }

    // Helper functions
    var goToNext = (e) => {
      var target = this.props.data.nextItem;
      if (target) {
        // TODO: navigateTo(target.link, target.name);
        e.preventDefault();
      }
    }
    var goToPrevious = (e) => {
      var target = this.props.data.prevItem;
      if (target) {
        // TODO: navigateTo(target.link, target.name);
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
    // keypress.on(['executeDefault'], 'space', scroll.ifAtBottom(goToNext));
    keypress.on(['executeDefault'], 'up', scroll.ifAtTop(goToPrevious));
    // keypress.on(['executeDefault', 'shift'], 'space', scroll.ifAtTop(goToPrevious));

    // TODO: fix titles
    //keypress.on(['meta'], 'up', event => navigateTo('..', 'Title'));
    //keypress.on([], 'r', event => navigateTo('/', 'Title'));

    keypress.on(['inputEl'], 'esc', event => {
      var el = event.target;
      if (el.blur) { el.blur(); }
    });
  }

  render() {
    let { data } = this.props;
    let { color } = this.state;

    //

    // TODO: Send 'Content-Type'(+JSON) and 'X-UA-Compatible' as headers
    return (
      <html>
        <head>
          <meta charSet="utf-8" />
          <title>{data.title}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="preload" href="/a2b8e37dbe533b/glyphicons-halflings-regular.woff" type="font/woff" />
          <link rel="stylesheet" href="/a2b8e37dbe533b/stylesheets/hljs/github.css" type="text/css" />
          <link rel="stylesheet" href="/a2b8e37dbe533b/main.bundle.css" type="text/css" />
          <Favicon color={color} template="/a2b8e37dbe533b/images/favicon-template.png" />
          <script defer src="/a2b8e37dbe533b/browser.bundle.js"></script>
        </head>
        <body>
          <LumosApplication data={data} colors={colorNames} color={color} />
        </body>
      </html>
    );
  }

}