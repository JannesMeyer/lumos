import Promise from 'bluebird';
import { execFile } from 'child_process';

function buildQueryWith(terms) {
	// var query = 'kMDItemContentType == net.daringfireball.markdown';
	// terms.forEach((term, i) => {
	// 	term = term.replace(/["']/g, '\\$&');
	// 	var isLast = (i === terms.length - 1);
	// 	var wildcard = isLast ? '*' : '';
	// 	query += ` && (kMDItemDisplayName == "${term}${wildcard}"cdwt || kMDItemTextContent == "${term}${wildcard}"cdwt)`;
	// });
	// return query;

	terms = terms.join(' ').replace(/["']/g, '\\$&');
	return `kMDItemContentType == net.daringfireball.markdown && (** = "${terms}*"cdwt)`;
}

function search(directory, terms) {
	return new Promise(function(resolve, reject) {
		execFile('mdfind', ['-onlyin', directory, buildQueryWith(terms)], function(error, stdout, stderr) {
			if (error) {
				return reject(error);
			}

			resolve((stdout === '') ? [] : stdout.trim().split('\n'));
		});
	});
}
export default search;