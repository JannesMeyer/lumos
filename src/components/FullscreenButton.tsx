import * as React from 'react';
import PageButton from './PageButton';

// browser-only
import * as keypress from '../client-lib/keypress-tool';
import * as fullscreen from '../client-lib/fullscreen-tool';

export default class extends React.Component<any, any> {

  constructor(props) {
    super(props);
    this.state = { isFullscreen: false };
  }

  componentDidMount() {
    keypress.on([], 'f', this.toggleFullscreen);

    // TODO: Use CSS selectors for this instead?
    fullscreen.onChange(state => {
      this.setState({ isFullscreen: state });
    });
  }

  toggleFullscreen(ev) {
    fullscreen.toggle(document.documentElement);
    ev.preventDefault();
    // ev.currentTarget.blur()
  }

  render() {
    let { isFullscreen } = this.state;
    return (
      <PageButton name="fullscreen"
                  icon={isFullscreen ? 'resize-small' : 'resize-full'}
                  href=""
                  title="Toggle fullscreen (F)"
                  onClick={this.toggleFullscreen} />
    );
  }

}