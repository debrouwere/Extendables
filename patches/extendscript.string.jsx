/**
 * @desc This is a simple string formatting method, loosely inspired on the one in Python 3.
 * Specify placeholders with the **{}** symbol.
 *
 * @param {Object} replacements
 *     For each **{}** symbol in the text, ``format`` expects a replacement argument.
 *     Calls `.toString()` on each replacement, so you can pass in any data type.
 *
 * @example
 *     > var person = {'salutation': 'mister', 'name': 'John Smith'};
 *     > var hello = "Hello there, {}, I've heard your name is {}!".format(person.salutation, person.name);
 *     > $.writeln(hello);
 *     "Hello there, mister, I've heard your name is John Smith"
 */

String.prototype.format = function() {	
	// split the string into parts around the substring replacement symbols ({}).
	var chunks = this.split("{}");
	var replacements = arguments.to('array');

	// fill in the replacements
	for (var i in chunks) {
		var replacement = replacements.shift();
		if (replacement) {
			chunks[i] += replacement.toString();
		}
	}
	return chunks.join('');
}

/**
 * @desc Removes leading and trailing whitespace characters, including tabs, line endings and the like.
 *
 * @example
 *     > $.writeln("   hello there   ".trim());
 *     "hello there"
 */

String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g, "");
}

/**
 * @desc Removes leading whitespace characters, including tabs, line endings and the like.
 *
 * @example
 *     > $.writeln("   hello there   ".trim());
 *     "hello there   "
 */

String.prototype.ltrim = function() {
	return this.replace(/^\s+/, "");
}

/**
 * @desc Removes trailing whitespace characters, including tabs, line endings and the like.
 *
 * @example
 *     > $.writeln("   hello there   ".trim());
 *     "   hello there"
 */

String.prototype.rtrim = function() {
	return this.replace(/\s+$/, "");
}

/**
 * @desc Tests whether the string starts with the specified substring.
 * @param {String} substring
 * @returns {Bool} True or false.
 */

String.prototype.startswith = function (substring) {
	return this.indexOf(substring) == 0;
}

/**
 * @desc Tests whether the string ends with the specified substring.
 * @param {String} substring
 * @returns {Bool} True or false.
 */

String.prototype.endswith = function (substring) {
	return this.indexOf(substring) == (this.length - substring.length);
}

/**
 * @desc Tests whether the string contains the specified substring.
 * This is equal to ``str.indexOf(substring) != -1``.
 * @param {String} substring
 * @returns {Bool} True or false.
 */

String.prototype.contains = function (substring) {
	return this.indexOf(substring) != -1;
}

/**
 * @desc Does what it says.
 * Does not check whether the string actually extends beyond the the substring.
 */

String.prototype.indexAfter = function (substring) {
	var index = this.indexOf(substring);
	if (index == -1) {
		return index;
	} else {
		return index + substring.length;
	}
}