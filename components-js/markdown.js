/** @jsx React.DOM */
var converter = new Showdown.converter();

var MarkdownEditor = React.createClass({displayName: 'MarkdownEditor',
	getInitialState: function() {
		return {value: 'Type some *markdown* here!'};
	},
	handleChange: function() {
		this.setState({value: this.refs.textarea.getDOMNode().value});
	},
	render: function() {
		return (
			React.DOM.div( {className:"MarkdownEditor"},
				React.DOM.h3(null, "Input"),
				React.DOM.textarea(
					{onChange:this.handleChange,
					ref:"textarea",
					defaultValue:this.state.value} ),
				React.DOM.h3(null, "Output"),
				React.DOM.div(
					{className:"content",
					dangerouslySetInnerHTML:{
						__html: converter.makeHtml(this.state.value)
					}}
				)
			)
		);
	}
});

React.renderComponent(MarkdownEditor(null ), document.body);