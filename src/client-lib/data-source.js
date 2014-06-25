module xhr from './xhr-tool'

// TODO: Chrome app environment

export function get(path) {
	return xhr.getJSON(path);
}