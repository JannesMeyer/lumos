import page from './components/page';
import dataSource from 'client-lib/data-source';

addEventListener('load', event => {

	// Initialize React
	dataSource.get(location.pathname)
	.then(data => {
		app = page.renderToDOM(data);
	});

	// TODO: how to know the port?
	var socket = io('http://notes:9000');
	socket.on('connect', () => {
		console.log('Connected');
		socket.emit('viewing', decodeURIComponent(location.pathname));
	});

	socket.on('disconnect', console.log.bind(console, 'Disconnected:'));
	socket.on('changed', () => {
		console.log('Content changed:', location.pathname);
		dataSource.get(location.pathname)
		.then(data => {
			page.renderToDOM(data);
		});
	});

	page.on('pageDidNavigate', pathname => {
		socket.emit('viewing', pathname);
	});
});