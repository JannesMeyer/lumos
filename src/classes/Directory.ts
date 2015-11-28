import BaseItem from './BaseItem';

export default class Directory extends BaseItem {
	
	constructor(path: string, base?: Directory) {
		super(path, base);
		console.log('New Directory');
	}
	
}