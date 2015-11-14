import React from 'react';

var Navigation = React.createClass({
  handleMouseDown(e) {
    if (e.button === 0) {
      var title = e.target.firstChild.data;
      var path = e.target.pathname;
      navigateTo(path, title);
    }
  },
  handleClick(e) {
    // if (e.button === 0) {
    //   e.preventDefault();
    // }
  },
  render() {
    var items = this.props.items;
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
});
export default Navigation;