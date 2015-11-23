import { execFile } from 'child_process';
import debug from 'debug';
import { config } from '../package.json';

var log = debug('lumos:search');

/**
 * Search command
 */
export default function cmd(args) {
  search(config.directory, args).then(results => {
    results.slice(0, 10).forEach(result => {
      console.log(result);
    });
  }).catch(log);
}



/**
 * Search files in directory using `mdfind`
 */
function search(directory, terms) {
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

/**
 * Build query for `mdfind`
 */
function buildQuery(terms) {
  // var query = 'kMDItemContentType == net.daringfireball.markdown';
  // terms.forEach((term, i) => {
  //  term = term.replace(/["']/g, '\\$&');
  //  var isLast = (i === terms.length - 1);
  //  var wildcard = isLast ? '*' : '';
  //  query += ` && (kMDItemDisplayName == "${term}${wildcard}"cdwt || kMDItemTextContent == "${term}${wildcard}"cdwt)`;
  // });
  // return query;

  terms = terms.join(' ').replace(/["']/g, '\\$&');
  return `kMDItemContentType == net.daringfireball.markdown && (** = "${terms}*"cdwt)`;
}