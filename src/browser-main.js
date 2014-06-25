module page from './components/page'
module dataSource from 'client-lib/data-source'

dataSource.get(location.pathname)
.then(data => {
	page.renderToDOM(data);
});