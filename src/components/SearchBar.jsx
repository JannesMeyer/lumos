import React from 'react';

// browser-only
import * as keypress from '../client-lib/keypress-tool';

export default class extends React.Component {

  componentDidMount() {
    keypress.on([], '/', event => {
      this.refs.searchBox.focus();
    });
  }

  render() {
    return (
      <form method="get" className="m-search">
        <input ref="searchBox" type="text" name="q" autoComplete="off" spellCheck="false" dir="auto" />
      </form>
    );
  }

}