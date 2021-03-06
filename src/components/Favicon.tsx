import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { colors, supported } from '../constants';

// browser-only
import * as favicon from '../client-lib/favicon-tool';

// TODO: Render the icon on the server-side, too
export default class extends React.Component<any, any> {

  colorize() {
    if (!supported.canvas2D) {
      throw new Error('Canvas2D not supported');
    }

    // TODO
    // this.faviconTemplate.then(result => {
    //   var context = result[0];
    //   var imageData = result[1];
    //   var node = ReactDOM.findDOMNode(this);
    //   var colorName = this.props.color;
    //   var color = colors[colorName];

    //   node.href = favicon.colorize(context, imageData, color);
    //   node.parentNode.replaceChild(node, node);
    // });
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.color !== this.props.color;
  }

  componentDidMount() {
    if (supported.canvas2D) {
      // TODO
      //this.faviconTemplate = favicon.load(this.props.template);
    }
    this.colorize();
  }

  componentDidUpdate() {
    this.colorize();
  }

  render() {
    return <link rel="icon" href={this.props.template} />;
  }

}