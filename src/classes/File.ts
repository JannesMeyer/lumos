import * as pathApi from 'path';
import Directory from './Directory';
import BaseItem from './BaseItem';

export default class File extends BaseItem {
	
	constructor(path: string, base?: Directory) {
		super(path, base);
	}
	
	// TODO: how do you make sure that it is a file and not a directory?
	static removeExtension(name) {
		return pathApi.basename(name, pathApi.extname(name));
	}
	
	inspect() {
		return `[File ${this.name}]`;
	}
	
}