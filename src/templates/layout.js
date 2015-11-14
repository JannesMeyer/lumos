import { renderToString } from '../components/page';

exports.render = function(data) {
	return '<!DOCTYPE html>' + renderToString(data);
}