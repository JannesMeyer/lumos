import React from 'react';
import BreadcrumbList from './BreadcrumbList';
import SearchBar from './SearchBar';
import ColorPicker from './ColorPicker';

// browser-only
import './Header.styl';

export default class extends React.Component {

  render() {
    let { breadcrumbs, colors, color, dirs } = this.props;
    return (
      <header className="m-header" ref="header">
        <BreadcrumbList breadcrumbs={breadcrumbs} dirs={dirs} />
        <SearchBar />
        <ColorPicker colors={colors} color={color} />
      </header>
    );
  }

}