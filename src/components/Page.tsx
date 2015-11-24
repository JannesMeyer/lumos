// browser-only
import './Page.styl';
import * as scroll from '../client-lib/scroll-tool';
import * as keypress from '../client-lib/keypress-tool';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PageButton from './PageButton';
import FullscreenButton from './FullscreenButton';

// TODO: update twice for each page load (loading, loaded)
export default class extends React.Component<any, any> {

  // TODO: doesn't work good with live reload
  shouldComponentUpdate(nextProps) {
    return (nextProps.filePath !== this.props.filePath) ||
           (nextProps.content !== this.props.content);
  }

  componentDidMount() {
    var element = ReactDOM.findDOMNode(this);
    keypress.on([], 'x', event => {
      if (scroll.isAtElement(element)) {
        scroll.to(0);
      } else {
        scroll.toElement(element);
      }
    });
  }

  componentWillUpdate(nextProps) {
    // Only scroll to top after a navigation, not after a reload
    if (nextProps.isUserNavigation) {
      var element = ReactDOM.findDOMNode(this);
      if (!scroll.isAtElement(element)) {
        scroll.to(0);
      }
    }
  }

  render() {
    return (
      <div className="m-page" role="content">
        <div className="m-page-buttons">
          <PageButton name="edit" icon="pencil" href={this.props.editURL} title="Edit page (E)" />
          <FullscreenButton />
        </div>
        <h1 className="m-page-title">{this.props.title}</h1>
        <article dangerouslySetInnerHTML={{ __html: this.props.content || '' }} />
      </div>
    );
  }

}