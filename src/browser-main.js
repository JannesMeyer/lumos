import page from './components/page';
import dataSource from 'client-lib/data-source';

var app;

addEventListener('load', event => {

	// Initialize React
	dataSource.get(location.pathname)
	.then(data => {
		app = page.renderToDOM(data);
	});

	// TODO: how to know the port?
	var socket = io('http://notes:9000');
	socket.on('connect', () => {
		console.log('connected');
		socket.on('disconnect', console.log.bind(console, 'disconnected:'));

		socket.emit('viewing', location.pathname);
		socket.on('changed', () => {
			dataSource.get(location.pathname)
			.then(data => {
				console.log('answer received', data);
				// page.renderToDOM(data);
				console.log(app);
				app.setProps({ data });
			});
			console.log('changed content');
		});
	});

	page.on('pageDidNavigate', pathname => {
		console.log('navigated to…', pathname);
		socket.emit('viewing', pathname);
	});
});