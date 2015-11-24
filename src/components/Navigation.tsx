// browser-only
import './Navigation.styl';

import * as React from 'react';

export default class extends React.Component<any, any> {

  handleMouseDown(e) {
    if (e.button === 0) {
      let title = e.target.firstChild.data;
      let path = e.target.pathname;
      // TODO: navigateTo(path, title);
    }
  }

  handleClick(e) {
    // if (e.button === 0) {
    //   e.preventDefault();
    // }
  }

  render() {
    let { items } = this.props;
    return (
      <nav className="m-navigation">
        <ul>{items.map((item, i) =>
          <li key={item.name} className={item.isActive ? 'active' : ''}>
            <a href={item.link} onMouseDown={this.handleMouseDown} onClick={this.handleClick}>{item.name}</a>
          </li>
        )}</ul>
      </nav>
    );
  }

}