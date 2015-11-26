import * as path from 'path';
import BaseItem from './BaseItem';

export default class File extends BaseItem {
	
	constructor() {
		super();
	}
	
	// TODO: how do you make sure that it is a file and not a directory?
	static removeExtension(name) {
		return path.basename(name, path.extname(name));
	}
	
}