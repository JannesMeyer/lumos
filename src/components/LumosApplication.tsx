import * as React from 'react';
import Header from './Header';
import Page from './Page';
import Navigation from './Navigation';

export default class extends React.Component<any, any> {

  render() {
    let { data, color, colors } = this.props;
    return (
      <div className={'m-container s-' + color}>
        <Header breadcrumbs={data.breadcrumbs} dirs={data.dirs} colors={colors} color={color} />
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

}