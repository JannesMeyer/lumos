import React from 'react';

var ColorPicker = React.createClass({
  handleChange(e) {
    var color = e.target.value;
    // TODO
    //app.setState({ color });
  },
  render() {
    return (
      <select value={this.props.color} onChange={this.handleChange} className="m-colorpicker">
      {this.props.colors.map(color =>
        <option value={color} key={color}>{color}</option>
      )}
      </select>
    );
  }
});
export default ColorPicker;