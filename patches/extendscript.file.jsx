/** @desc return the directory name */
/** @desc return the basename (filename without extension) */
/** @desc returns the file extension */

// will replace the path module

/**
 * @desc The extendables base directory. Other notable class properties
 * include ``current``, ``desktop``, ``userData``, ``temp`` and ``trash``. 
 */
Folder.extendables = new File($.fileName).parent.parent;

/**
 * @desc Get a file or folder starting from an existing path.
 * A foolproof way to join paths together.
 */

function from_base (folder) {
	var path = File.path.join(folder.absoluteURI, this.relativeURI);
	return new this.constructor(path);
}

File.prototype.from = from_base;
Folder.prototype.from = from_base;

File.prototype.component = function (type) {
	switch (type) {
		case 'path':
			return this.path;
		break;
		case 'name':
			return this.name;
		break;
		case 'basename':
			var extlen = this.component('extension').length;
			if (extlen) {
				return this.name.slice(0, -1 * extlen).rtrim('.');
			} else {
				return this.name;
			}
		break;
		case 'extension':
			var name = this.name.split('.');
			if (name.length > 1) {
				return name.last();
			} else {
				return '';
			}
		break;
	}
}