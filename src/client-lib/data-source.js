import xhr from './xhr-tool';

export function get(path) {
	return xhr.getJSON(path);
}