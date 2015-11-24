import * as React from 'react';

// browser-only
import * as keypress from '../client-lib/keypress-tool';

export default class extends React.Component<any, any> {

  componentDidMount() {
    keypress.on([], '/', event => {
      let element = this.refs['searchBox'] as HTMLElement;
      element.focus();
    });
  }

  render() {
    return (
      <form method="get" className="m-search">
        <input ref="searchBox" type="text" name="q" autoComplete="off" spellCheck={false} dir="auto" />
      </form>
    );
  }

}