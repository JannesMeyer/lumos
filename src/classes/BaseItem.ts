import * as path from 'path';
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
	// TODO: needs to be normalized? so it needs to be a function. Can't break out of base.
	//absolutePath: string;
	
	constructor() {
		
	}
	
	stat() {
		
	}
	
	normalize() {
		
	}
	
	isDir() {
		
	}
	
	/**
	 * Get absolute path
	 */
	toString() {
		
	}
	
}