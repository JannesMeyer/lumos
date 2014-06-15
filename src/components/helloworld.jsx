/** @jsx React.DOM */

var HelloWorld = React.createClass({
	render: function() {
		return (
			<p>
				Hello, <input type="text" placeholder="Your name here" />!
				It is {this.props.date.toTimeString()}
			</p>
		);
	}
});

function render() {
	React.renderComponent(<HelloWorld date={new Date()} />, document.body);
}
render();
setInterval(render, 1000);