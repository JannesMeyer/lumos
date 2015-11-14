import React from 'react';
import BreadcrumbList from './BreadcrumbList';
import SearchBar from './SearchBar';
import ColorPicker from './ColorPicker';

var Header = React.createClass({
  render() {
    return (
      <header className="m-header" ref="header">
        <BreadcrumbList breadcrumbs={this.props.breadcrumbs} dirs={this.props.dirs} />
        <SearchBar />
        <ColorPicker colors={this.props.colors} color={this.props.color} />
      </header>
    );
  }
});
export default Header;