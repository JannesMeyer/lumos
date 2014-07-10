import fs from 'fs';
import debounce from './debounce';

function watch(dir, changeHandler) {
	fs.watch(dir, { recursive: true }, debounce(changeHandler, 100));
}

export default watch;