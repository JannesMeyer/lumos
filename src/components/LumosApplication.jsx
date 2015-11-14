import React from 'react';
import Header from './Header';
import Page from './Page';
import Navigation from './Navigation';

var LumosApplication = React.createClass({
  render() {
    var data = this.props.data;
    return (
      <div className={'m-container s-' + this.props.color}>
        <Header breadcrumbs={data.breadcrumbs}
                dirs={data.dirs}
                colors={this.props.colors}
                color={this.props.color} />
        <div>
          <Page filePath={data.filePath}
                title={data.title}
                creationDate={data.creationDate}
                content={data.content}
                editURL={data.editURL}
                isUserNavigation={data.isUserNavigation} />
          <Navigation items={data.items} />
        </div>
      </div>
    );
  }
});
export default LumosApplication;