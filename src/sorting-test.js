var util = require('util');

var t = [ 'ä.md',
  'z.md',
  'á',
  'Untitled 1',
  'Untitled 2',
  'Untitled 3',
  'Untitled 10 2.md',
  'Untitled 10.md',
  'Untitled 99',
  'Untitled 100',
  'Z',
  'ú',
  'B',
  'a',
  'D',
  'c',
  'á',
  'Ä'
];
t = t.map(function(item) {
  return item.toLowerCase();
});



var NUMBER_GROUPS = /(-?\d*\.?\d+)/g;
var naturalSort = function (a, b) {
  var aa = String(a).split(NUMBER_GROUPS),
      bb = String(b).split(NUMBER_GROUPS),
      min = Math.min(aa.length, bb.length);

  for (var i = 0; i < min; i++) {
    var x = parseFloat(aa[i]) || aa[i].toLowerCase(),
        y = parseFloat(bb[i]) || bb[i].toLowerCase();
    return x.localeCompare(y);
    // if (res !== 0) return res;
    // if (x < y) return -1;
    // else if (x > y) return 1;
  }

  return 0;
};

/* ********************************************************************
 * Alphanum Array prototype version
 *  - Much faster than the sort() function version
 *  - Ability to specify case sensitivity at runtime is a bonus
 *
 */
Array.prototype.alphanumSort = function(caseInsensitive) {
  for (var z = 0, t; t = this[z]; z++) {
    this[z] = new Array();
    var x = 0, y = -1, n = 0, i, j;

    while (i = (j = t.charAt(x++)).charCodeAt(0)) {
      var m = (i == 46 || (i >=48 && i <= 57));
      if (m !== n) {
        this[z][++y] = "";
        n = m;
      }
      this[z][y] += j;
    }
  }

  this.sort(function(a, b) {
    for (var x = 0, aa, bb; (aa = a[x]) && (bb = b[x]); x++) {
      if (caseInsensitive) {
        aa = aa.toLowerCase();
        bb = bb.toLowerCase();
      }
      if (aa !== bb) {
        var c = Number(aa), d = Number(bb);
        if (c == aa && d == bb) {
          return c - d;
        } else return (aa > bb) ? 1 : -1;
      }
    }
    return a.length - b.length;
  });

  for (var z = 0; z < this.length; z++)
    this[z] = this[z].join("");
}

/*
 * Natural Sort algorithm for Javascript - Version 0.7 - Released under MIT license
 * Author: Jim Palmer (based on chunking idea from Dave Koelle)
 */
 function naturalSortJim(a, b) {
    var re = /(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?$|^0x[0-9a-f]+$|[0-9]+)/gi,
        sre = /(^[ ]*|[ ]*$)/g,
        dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
        hre = /^0x[0-9a-f]+$/i,
        ore = /^0/,
        i = function(s) { return naturalSort.insensitive && (''+s).toLowerCase() || ''+s },
        // convert all to strings strip whitespace
        x = i(a).replace(sre, '') || '',
        y = i(b).replace(sre, '') || '',
        // chunk/tokenize
        xN = x.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
        yN = y.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
        // numeric, hex or date detection
        xD = parseInt(x.match(hre)) || (xN.length != 1 && x.match(dre) && Date.parse(x)),
        yD = parseInt(y.match(hre)) || xD && y.match(dre) && Date.parse(y) || null,
        oFxNcL, oFyNcL;
    // first try and sort Hex codes or Dates
    if (yD)
        if ( xD < yD ) return -1;
        else if ( xD > yD ) return 1;
    // natural sorting through split numeric strings and default strings
    for(var cLoc=0, numS=Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {
        // find floats not starting with '0', string or 0 if not defined (Clint Priest)
        oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
        oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc]) || yN[cLoc] || 0;
        // handle numeric vs string comparison - number < string - (Kyle Adams)
        if (isNaN(oFxNcL) !== isNaN(oFyNcL)) { return (isNaN(oFxNcL)) ? 1 : -1; }
        // rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
        else if (typeof oFxNcL !== typeof oFyNcL) {
            oFxNcL += '';
            oFyNcL += '';
        }
        if (oFxNcL.localeCompare(oFyNcL)) return -1;
        if (oFxNcL.localeCompare(oFyNcL)) return 1;
    }
    return 0;
}


t.sort(naturalSortJim);
// t.sort(function(a, b) {
//   return a.localeCompare(b, undefined, { numeric: true });
// });
console.log(util.inspect(t));