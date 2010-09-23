/* Mock functions: some javascript libraries depend on these, so we mock them. */

function bindOriginal_ () { 
	return false;
}
function setTimeout (fn) {
	return fn();
}
function clearTimeout (fn) {
	return;
}
function setInterval (fn) {
	return fn();
}
function clearInterval (fn) {
	return;
}

#include "../dependencies/underscore.js"
#include "../dependencies/json2.js"

// hmm, considering this doesn't work, maybe we should merge _ with a curry?
//var x = _.map([1, 2, 3], function(n){ return n * 2; });
//alert(x);

alert(_.map);

/* Assorted patches */

Object.prototype.to = function (type) {
	// some of the functions we call do their work in-place, whereas others return a new object
	// to keep things sane, any conversion using this method won't modify the original object
	// but return a new one instead
	var result = this.clone();
	
	var conversions = {
		/* types */
		'int': function () { return parseInt(result); },
		'float': function () { return parseFloat(result); },
		'string': function () { return result.toString() },
		'array': function () { return Array.prototype.slice.call(result); },
		/* other conversions */
		'json': function () { return JSON.stringify(result, undefined, 4); },
		'alphanumeric': function () { return result.replace(/[^a-zA-Z0-9 ]/g, ""); },
		'slug': function () { return result.replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase().replace(" ", "-"); },
		'lower': result.toLowerCase,
		'upper': result.toUpperCase
};

	if (conversions.hasOwnProperty(type)) {
		return conversions[type]();
	} else {
		throw RangeError("This method cannot convert from %s to %s".format(this.prototype.name, type));
	}
}

Object.prototype.merge = Object.prototype.extend

// the inverse of isPrototypeOf
// when doing inheritance, this works better than testing obj.constructor == type
Object.prototype.isInstanceOf = function(type) {
	return type.prototype.isPrototypeOf(this)
}

String.prototype.format = function() {	
	// split the string into parts around the substring replacement symbol %s 
	// todo: replace %s by {}, or replace with a better formatting function altogether
	var chunks = this.split("%s");
	var replacements = arguments.to('array');

	// fill in the replacements
	for (var i in chunks) {
		var replacement = replacements.shift();
		if (replacement) {
			chunks[i] += replacement;
		}
	}
	return chunks.join('');
}