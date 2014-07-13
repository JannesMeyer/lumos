var page = require('./components/page');
var dataSource = require('client-lib/data-source');

addEventListener('load', event => {

	dataSource.get(location.pathname)
	.then(data => {
		// Initialize React
		page.renderToDOM(data);
	});

	// TODO: how to know the port?
	var socket = io('http://notes:9000');
	socket.on('connect', () => {
		console.log('connected');
		// socket.join('testroom');
		socket.on('disconnect', console.log.bind(console, 'server disconnected:'));

		// socket.close();
	});
});