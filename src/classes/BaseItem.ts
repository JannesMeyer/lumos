import * as path from 'path';
import Directory from './Directory';

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
	// TODO: needs to be normalized?
	//absolutePath: string;
	
	constructor() {
		
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