import React from 'react';

export default class extends React.Component {

  handleChange(ev) {
    let color = ev.target.value;
    // TODO
    //app.setState({ color });
  }

  render() {
    let { color, colors } = this.props;
    return (
      <select value={color} onChange={this.handleChange} className="m-colorpicker">
      {colors.map(color =>
        <option value={color} key={color}>{color}</option>
      )}
      </select>
    );
  }

}