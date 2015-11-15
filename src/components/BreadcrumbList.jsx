import React from 'react';

export default class extends React.Component {

  handleClick(ev) {
    if (ev.button === 0) {
      var title = ev.target.firstChild.data;
      var path = ev.target.pathname;
      navigateTo(path, title);
      ev.preventDefault();
    }
  }

  render() {
    let { breadcrumbs, dirs } = this.props;
    return (
      <ol>
        {breadcrumbs.map(item =>
          <li key={item.path}><a href={item.path} onClick={this.handleClick}>{item.name}</a></li>
        )}
        <li className="more">
          <ol>
            {dirs.map(item =>
              <li key={item.relative}><a href={item.link} onClick={this.handleClick}>{item.relative}</a></li>
            )}
          </ol>
        </li>
      </ol>
    );
  }

}