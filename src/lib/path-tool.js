import path from 'path';

export function name(filename) {
	var basename = path.basename(filename);
	return path.basename(basename, path.extname(basename));
}

export function replaceExtension(filePath, newExtension) {
	var extension = path.extname(filePath);
	if (extension === newExtension) {
		return filePath;
	}
	var newFileName = path.basename(filePath, extension) + newExtension;
	return path.join(path.dirname(filePath), newFileName);
}