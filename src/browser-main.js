import page from './components/page';
import dataSource from 'client-lib/data-source';
import debug from 'debug';
debug = debug('lumos');
// localStorage.debug = 'lumos';

addEventListener('load', event => {

	// Initialize React
	dataSource.get(location.pathname).then(data => {
		data.isUserNavigation = false;
		app = page.renderToDOM(data);
	});

	// TODO: how to know the port?
	var socket = io('http://notes:9000');
	socket.on('connect', () => {
		debug('Connected');

		socket.emit('viewing', decodeURIComponent(location.pathname));
	});

	socket.on('disconnect', () => {
		debug('Disconnected');
	});

	socket.on('change', () => {
		debug('Content changed');

		dataSource.get(location.pathname).then(data => {
			data.isUserNavigation = false;
			page.renderToDOM(data);
		});
	});

	// Listen for navigation events
	// TODO: e.preventDefault()
	page.on('pageDidNavigate', pathname => {
		socket.emit('viewing', decodeURIComponent(pathname));
	});
});