import pageComponent from '../components/page';

exports.render = function(data) {
	return '<!DOCTYPE html>' + pageComponent.renderToString(data);
}