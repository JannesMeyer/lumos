"use strict";
var HelloWorld = React.createClass({
  displayName: 'HelloWorld',
  render: function() {
    return (React.DOM.p(null, "Hello, ", React.DOM.input({
      type: "text",
      placeholder: "Your name here"
    }), "!" + ' ' + "It is ", this.props.date.toTimeString()));
  }
});
function render() {
  React.renderComponent(HelloWorld({date: new Date()}), document.body);
}
render();
setInterval(render, 1000);