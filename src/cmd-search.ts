import { execFile } from 'child_process';
import * as debug from 'debug';
import config from './config';

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
function search(directory, terms): Promise<string[]> {
  // directory must not end in a slash
  if (directory.endsWith('/')) {
    directory = directory.replace(/\/+$/, '');
  }

  return new Promise(function(resolve, reject) {
    execFile('mdfind', ['-onlyin', directory, buildQuery(terms)], (err, stdout) => {
      // if (err) {
      //   return reject(err);
      // }
      let str = stdout.toString('utf8');
      // if (str === '') {
      //   return resolve([]);
      // }
      let arr = str.trim().split('\n');
      let arr2 = arr.map(r => r.slice(directory.length));
      resolve(arr2);
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