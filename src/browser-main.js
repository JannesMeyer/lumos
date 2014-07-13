var page = require('./components/page');
var dataSource = require('client-lib/data-source');

addEventListener('load', event => {

	// Initialize React
	dataSource.get(location.pathname)
	.then(data => {
		page.renderToDOM(data);
	});

	// TODO: how to know the port?
	var socket = io('http://notes:9000');
	socket.on('connect', () => {
		console.log('connected');
		socket.on('disconnect', console.log.bind(console, 'disconnected:'));
	});
});