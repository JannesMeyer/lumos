import React from 'react';
import PageButton from './PageButton';
import FullscreenButton from './FullscreenButton';

// browser-only
import * as scroll from '../client-lib/scroll-tool';
import * as keypress from '../client-lib/keypress-tool';

// TODO: update twice for each page load (loading, loaded)
var Page = React.createClass({
  // TODO: doesn't work good with live reload
  shouldComponentUpdate(nextProps) {
    return (nextProps.filePath !== this.props.filePath) ||
           (nextProps.content !== this.props.content);
  },
  componentDidMount() {
    var element = this.getDOMNode();
    keypress.on([], 'x', event => {
      if (scroll.isAtElement(element)) {
        scroll.to(0);
      } else {
        scroll.toElement(element);
      }
    });
  },
  componentWillUpdate(nextProps) {
    // Only scroll to top after a navigation, not after a reload
    if (nextProps.isUserNavigation) {
      var element = this.getDOMNode();
      if (!scroll.isAtElement(element)) {
        scroll.to(0);
      }
    }
  },
  render() {
    return (
      <div className="m-page" role="content">
        <div className="m-page-buttons">
          <PageButton name="edit" icon="pencil" href={this.props.editURL} title="Edit page (E)" />
          <FullscreenButton />
        </div>
        <h1 className="m-page-title">{this.props.title}</h1>
        <article dangerouslySetInnerHTML={{ __html: this.props.content || 'no content' }} />
      </div>
    );
  }
});
export default Page;