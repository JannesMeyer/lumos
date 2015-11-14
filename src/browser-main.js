import page from './components/page';
import dataSource from './client-lib/data-source';
import debugLib from 'debug';
import io from 'socket.io-client';
var debug = debugLib('lumos');
// localStorage.debug = 'lumos';

addEventListener('load', event => {

	// Initialize React
	dataSource.get(location.pathname).then(data => {
		data.isUserNavigation = false;
		app = page.renderToDOM(data);
	});

	// TODO: how to know the port?
	var socket = io('http://notes:9000', {
		path: '/581209544f9a07/socket.io',
		transports: ['websocket']
	});
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
		socket.emit('viewing', decodeURIComponent(location.pathname));
	});
});