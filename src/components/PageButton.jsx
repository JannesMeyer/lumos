import React from 'react';

var PageButton = React.createClass({
  render() {
    var props = this.props;
    return (
      <a className={'button-' + props.name} href={props.href} title={props.title} onClick={props.onClick}>
        <span className={'glyphicon glyphicon-' + props.icon}></span>
      </a>
    );
  }
});
export default PageButton;