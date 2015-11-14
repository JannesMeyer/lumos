import React from 'react';

// browser-only
import * as keypress from '../client-lib/keypress-tool';

var SearchBar = React.createClass({
  componentDidMount() {
    keypress.on([], '/', event => {
      var el = this.refs.searchBox;
      el.focus();
    });
  },
  render() {
    return (
      <form method="get" className="m-search">
        <input
          ref="searchBox"
          type="text"
          name="q"
          autoComplete="off"
          spellCheck="false"
          dir="auto" />
      </form>
    );
  }
});
export default SearchBar;