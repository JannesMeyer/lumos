import fs from 'fs';
import debounce from './debounce';

export function debounced(dir, changeHandler) {
	fs.watch(dir, { recursive: true }, debounce(changeHandler, 50));
}

export function debouncedByFilename(dir, changeHandler) {
	// Group events based on filename (1)
	fs.watch(dir, { recursive: true }, debounce(changeHandler, 50, 1));
}