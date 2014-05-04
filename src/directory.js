module path from 'path'

module fs from 'fs'
module denodeify from './denodeify'
let fsStat     = denodeify(fs, fs.stat);
let fsReadDir  = denodeify(fs, fs.readdir);
let fsReadFile = denodeify(fs, fs.readFile);

import { SegmentedPath } from './SegmentedPath'

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