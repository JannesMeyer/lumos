import BaseItem, { stat } from './BaseItem';
import File from './File';
import * as path from 'path';
import * as fs from 'fs';

export default class Directory extends BaseItem {
	
	cachedContent: BaseItem[];
	
	constructor(path: string, base?: Directory) {
		super(path, base);
	}

	inspect(): string {
		return `[Directory ${this.name}]`;
	}

	readContent(): Promise<BaseItem[]> {
		let names: string[];
		return readdir(this.absolutePath).then(files => {
			names = files;
			return Promise.all(files.map(f => path.join(this.absolutePath, f)).map(stat));
		}).then(statsArray => {
			return statsArray.map((s, i) =>	(s.isDirectory() ? new Directory(names[i], this) : new File(names[i], this)));
		});
	}
	
}

/**
 * fs.readdir as Promise 
 */
function readdir(path: string): Promise<string[]> {
	return new Promise((resolve, reject) => {
		fs.readdir(path, (err, files) => (err ? reject(err) : resolve(files)));
	});
}