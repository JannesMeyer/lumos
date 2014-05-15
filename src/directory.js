module path from 'path'

module fs from 'fs'
module crypto from 'crypto'
module denodeify from './denodeify'
let fsStat     = denodeify(fs, fs.stat);
let fsReadDir  = denodeify(fs, fs.readdir);

import { SegmentedPath } from './SegmentedPath'

/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR
 * h, s, v
*/
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (h && s === undefined && v === undefined) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.floor(r * 255),
        g: Math.floor(g * 255),
        b: Math.floor(b * 255)
    };
}

function colorizeName(name) {
	var hash = crypto.createHash('md5').update(name).digest('binary');
	var hue = hash.charCodeAt(2) / 255;
	var color = HSVtoRGB(hue, 0.4, 1);
	return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

/**
 * A class that represents a directory
 */
export class Directory {

	constructor(path) {
		this.path = path;
		// this.contents = [SegmentedPath, ...]
		// this.filteredContents = [SegmentedPath, ...];
	}

	readContents() {
		let contents;
		return fsReadDir(this.path.absolute)
		.then(names => {
			contents = names.map(name => new SegmentedPath(this.path.absolute, name));
			// Find out whether these are directories or files
			let promises = contents.map(item => fsStat(item.absolute));
			return Promise.all(promises);
		})
		.then(stats => {
			// TODO: use for..of instead
			// Correct isDir information
			contents.forEach(function(item, i) {
				item.isDir = stats[i].isDirectory();
				if (item.isDir) {
					item.color = colorizeName(item.name);
					item.link = encodeURIComponent(item.name) + '/';
				} else {
					item.makeFile();
					item.link = encodeURIComponent(item.name);
				}
			});

			// sort
			contents.sort(itemSort);

			this.contents = contents;
			return contents;
		});
	}

	filter(filterFn) {
		this.filteredContents = this.contents.filter(filterFn);
	}

	hasFile(name) {
		if (typeof name !== 'string') { return; }
		if (this.contents === undefined) { return; }

		for(let item of this.contents) {
			if (!item.isDir && item.fullName === name) {
				return true;
			}
		}
		return false;
	}
}

/**
 * Sort function for Directory objects
 */
function itemSort(a, b) {
	// Arrange directories on top
	if (a.isDir && !b.isDir) { return -1; }
	if (!a.isDir && b.isDir) { return 1; }

	// And sort by name
	// TODO: use Intl.Collator
	return a.sortStr.localeCompare(b.sortStr, undefined, { numeric: true });
}