import Directory from './Directory';

export default class BaseItem {
	
	/** (Optional) A base that this item is relative to */
	base: Directory;
	
	/** The components that lead to the directory this item is contained in */
	pathComponents: string[];
	
	/** Cached: A string representation of the pathComponents */
	path: string;
	
	/** The actual name of this file system item */
	name: string;
	
	/** Cached: Used for sorting */
	normalizedName: string;
	
	/** Cached: The absolute path for use in OS-level functions */
	absolutePath: string;
	
	constructor() {
		
	}
	
	normalize() {
		
	}
	
	/**
	 * Get absolute path
	 */
	toString() {
		return this.absolutePath;
	}
	
}