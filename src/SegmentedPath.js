module path from 'path'

/**
 * Represents a path that is relative to a base path
 */
export class SegmentedPath {

	constructor(basePath, segments) {
		this.basePath = basePath;
		this.baseDirName = path.basename(basePath);
		this.segments = segments;
		// this.name = String
		// this.extension = String
		// this.basename = String
		// this.sortString = String
		// this.link = String
		// this.isHidden = Boolean
		// this.isDir = Boolean
	}

	set segments(array) {
		this.segments_ = array;
		this.update();
	}

	update() {
		// Compute the absolute name
		this.absolute = path.join.apply(path, this.basePath.concat(this.segments_));

		// Only use segments [2, ∞)
		this.relative = path.join.apply(path, this.segments_);
		this.name = path.basename(this.relative);
		this.sortStr = this.name.toLowerCase();
		this.isDir = this.relative.endsWith('/');
		this.isHidden = this.name.startsWith('.');
	}

	makeFile() {
		this.isDir = false;
		this.fullName = this.name;
		this.extension = path.extname(this.fullName); // TODO: toLowerCase()
		this.name = path.basename(this.fullName, this.extension);
		this.sortStr = this.name.toLowerCase();
	}

	removeExtension(filename) {
		return path.basename(filename, path.extname(filename));
	}

	get segments() {
		return this.segments_;
	}

	makeParent() {
		if (this.isDir) {

		} else {
			var segmentsJoined = path.join.apply(path, this.segments_);
			return new SegmentedPath(this.basePath, path.dirname(segmentsJoined));
		}
	}

	makeDescendant(name) {
		// Clone segments
		var segments = this.segments_.slice();
		// Add descendant
		segments.push(name);
		return new SegmentedPath(this.basePath, segments);
	}

	makeClone() {
		// Clone segments
		var segments = this.segments_.slice();
		return new SegmentedPath(this.basePath, segments);
	}

	makeBreadcrumbs() {
		var breadcrumbs = [];
		/*{
			name
			path
			isActive
		}*/

		// Split path and remove all empty segments
		var pathSegments = this.relative.split('/').filter(s => s !== '');
		// Home item
		var item = {
			name: this.baseDirName,
			path: '/',
			isActive: false
		};
		breadcrumbs.push(item);
		// The rest of the path
		pathSegments.forEach((segment, i) => {
			var isLast = (i === pathSegments.length - 1);

			if (isLast && !this.isDir) {
				return;
			}

			item = {
				name: segment,
				path: item.path + segment + '/',
				isActive: false
			};
			breadcrumbs.push(item);

		});
		return breadcrumbs;
	}

	/**
	 * Makes sure that no segment leaves the base
	 */
	verifyDescendance() {
		return this.absolute.startsWith(this.basePath);
	}

	get leaf() {
		var segments = this.segments_;
		return segments[segments.length - 1];
	}

	set leaf(value) {
		var segments = this.segments_;
		segments[segments.length - 1] = value;
		this.update();
	}

}