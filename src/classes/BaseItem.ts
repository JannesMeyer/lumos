import * as fs from 'fs';
import * as pathApi from 'path';
import Directory from './Directory';

/**
 * The only useful you can do with an instance of this is to use fs.stat()
 * Then you can decide whether to create a File or Directory instance, which
 * extend this class.
 */
export default class BaseItem {
	
	/**
	 * (Optional) A base that this item is relative to. The top item in the chain
	 * needs to have this set to null. Circular references are not permitted.
	 */
	base: Directory;
	
	/** The components that lead to the directory this item is contained in as well as the item's name */
	pathComponents: string[];
	
	/** Cached: The actual name of this file system item */
	name: string;
	
	/** Cached: Used for sorting */
	normalizedName: string;
	
	/** Cached: Whether the item's name starts with a dot or not */
	isHidden: boolean;
	
	/** Cached: The absolute path for use in OS-level functions. Goes up the chain of bases. */
	absolutePath: string;
	
	/** Cache: Relative path from the first base */
	relativeToFirstBase: string;
	
	constructor(path: string, base?: Directory) {
		this.base = base;
		
		let items = path.split(pathApi.sep).filter(i => i !== '.').map(i => i.normalize());
		
		// TODO: normalize first
		items.forEach(i => {
			if (i === '..') {
				throw new Error('.. is not allowed in the path');
			}
		});
		
		// Preserve root level
		if (base == null && items.length >= 2 && items[0] === '') {
			items[1] = pathApi.sep + items[1];
		}
		
		this.pathComponents = items.filter(i => i !== '');
		this.updateValues();
	}
	
	/**
	 * Update the derived values
	 */
	updateValues() {		
		// Compute absolute path
		let components = [];
		let baseDir = this.base;
		while (baseDir != null) {
			components.push(...baseDir.pathComponents);
			baseDir = baseDir.base;
		}
		components.push(...this.pathComponents);
		
		if (components.length === 0) {
			throw new Error('Empty paths are not allowed');
		}

		this.name = components[components.length - 1];
		this.normalizedName = this.name.toLocaleLowerCase();
		this.isHidden = this.name.startsWith('.');
		this.absolutePath = pathApi.join(...components);
	}
	
	inspect(): string {
		return `[Directory ${this.name}]`;
	}
	
	stat(): Promise<fs.Stats> {
		return stat(this.absolutePath);
	}
	
	static normalize(path1: string, path2: string) {
		return pathApi.normalize(pathApi.join(path1, path2));
	}
	
}

/**
 * fs.stat as Promise
 */
export function stat(path: string): Promise<fs.Stats> {
	return new Promise((resolve, reject) => {
		fs.stat(path, (err, stats) => (err ? reject(err) : resolve(stats)));
	});
}