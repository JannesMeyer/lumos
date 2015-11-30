import * as fs from 'fs';
import * as pathApi from 'path';
import Directory from './Directory';
import BaseItem from './BaseItem';

export default class File extends BaseItem {
	
	/** Derived value: File extension (including the .) */
	extension: string;
	
	constructor(path: string, base?: Directory) {
		super(path, base);
		// TODO: how do you make sure that it is a file and not a directory?
		
		// Set extension
		this.extension = pathApi.extname(this.name);
		
		// Remove extension from name
		this.name = pathApi.basename(this.name, this.extension); 
	}
	
	inspect(): string {
		return `[File ${this.name}]`;
	}
	
	readContent(): Promise<string> {
		return readFile(this.absolutePath).then(b => b.toString('utf8'));
	}
	
}



/**
 * fs.readFile as Promise 
 */
function readFile(path: string): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		fs.readFile(path, (err, data) => (err ? reject(err) : resolve(data)));
	});
}