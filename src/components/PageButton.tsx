import React from 'react';

export default class extends React.Component {

  render() {
    let { name, href, title, onClick, icon } = this.props;
    return (
      <a className={'button-' + name} href={href} title={title} onClick={onClick}>
        <span className={'glyphicon glyphicon-' + icon}></span>
      </a>
    );
  }

}