import React from 'react';
import PageButton from './PageButton';

// browser-only
import * as keypress from '../client-lib/keypress-tool';
import * as fullscreen from '../client-lib/fullscreen-tool';

var FullscreenButton = React.createClass({
  getInitialState() {
    return {
      isFullscreen: false
    };
  },
  componentDidMount() {
    keypress.on([], 'f', this.toggleFullscreen);

    // TODO: Use CSS selectors for this instead?
    fullscreen.onChange(state => {
      this.setState({ isFullscreen: state });
    });
  },
  toggleFullscreen(e) {
    fullscreen.toggle(document.documentElement);
    e.preventDefault();
    // e.currentTarget.blur()
  },
  render() {
    return (
      <PageButton name="fullscreen"
                  icon={this.state.isFullscreen ? 'resize-small' : 'resize-full'}
                  href=""
                  title="Toggle fullscreen (F)"
                  onClick={this.toggleFullscreen} />
    );
  }
});
export default FullscreenButton;