import { execFile } from 'child_process';

function buildQuery(terms) {
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

export default function search(directory, terms) {
	// directory must not end in a slash
	if (directory.endsWith('/')) {
		directory = directory.replace(/\/+$/, '');
	}

	return new Promise(function(resolve, reject) {
		execFile('mdfind', ['-onlyin', directory, buildQuery(terms)], (err, out) => {
			if (err) {
				return reject(err);
			}
			if (out === '') {
				return resolve([]);
			}
			resolve(out.trim().split('\n')
			           .map(result => result.slice(directory.length)));
		});
	});
}