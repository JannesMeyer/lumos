var page = require('./components/page');
var dataSource = require('client-lib/data-source');

addEventListener('load', event => {
	dataSource.get(location.pathname)
	.then(data => {
		// Initialize React
		page.renderToDOM(data);
	});
});