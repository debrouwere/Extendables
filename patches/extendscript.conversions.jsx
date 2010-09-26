var exports;
var base64 = exports;

#include "../../dependencies/json2.js"
#include "../../dependencies/base64.js"

// keyvalue encoding comes in handy to create things like INI files and HTTP headers

var keyvalue = {};
keyvalue.encode = function (obj, options) {
	var separator = options["separator"] || "=";
	var eol = options["eol"] || "\n";
	var output = "";
	for (name in obj) {
		output += name + separator + obj[name] + eol;
	}
	return obj;
}
keyvalue.decode = function (str, options) {
	var separator = options["separator"] || "=";
	var eol = options["eol"] || "\n";
	var obj = {};
	var pairs = str.split(eol);
	pairs.forEach(function (pair) {
		pair = pair.split(separator);
		obj[pair[0]] = pair[1];
	});
	return obj;	
}

/**
 * @desc The result of serialization followed by deserialization is the original object, whereas
 * a conversion is not reversible.
 */

Object.prototype.serialize = function (type, options) {
	// type: json, keyvalue
	var serializations = {
		'json': function () { return JSON.stringify(this, undefined, options || 4); },
		'base64': function () { return base64.encode64(this); },
		'key-value': function () { return keyvalue.encode(this, options); }
	};

	if (serializations.hasOwnProperty(type)) {
		return serializations[type]();
	} else {
		throw RangeError("This method cannot convert from {} to {}".format(this.prototype.name, type));
	}
}

Object.prototype.deserialize = function () {
	var deserializations = {
		'json': function () { return JSON.parse(this); },
		'base64': function () { return base64.decode64(this); },
		'key-value': function () { return keyvalue.decode(this, options); }
	}

	if (deserializations.hasOwnProperty(type)) {
		return deserializations[type]();
	} else {
		throw RangeError("This method cannot convert from {} to {}".format(this.prototype.name, type));
	}
}

/**
 * @desc Provides easy shortcuts to a number of common conversions, like lowercasing a string or 
 * converting the ``arguments`` object to an array.
 * 
 * All of these conversions return a new object, they do not modify the original.
 * 
 * A ``slug`` is a string that's usable as a filename or in an URL: it's
 * a lowercased string with all non-alphanumeric characters stripped out, and spaces replaced by
 * hyphens.
 *
 * Use this method instead of functions like ``parseInt`` and methods like ``str.toLowerCase()``.
 *
 * @param {String} type
 *     One of ``int``, ``float``, ``string``, ``array``, ``alphanumeric``, ``slug``, ``lower`` and ``upper``.
 *
 * @example
 *     > var list = [1.4, 2.2, 4.3];
 *     > function to_integers () {
 *     ... return arguments.to('array').map(function (item) { return item.to('int'); });
 *     ... }
 *     > to_integers(list);
 *     [1,2,3]
 */

Object.prototype.to = function (type) {
	// never, ever modify the original object
	var result = this.clone();
	
	var conversions = {
		/* types */
		'int': function () { return parseInt(result); },
		'float': function () { return parseFloat(result); },
		'string': function () { return result.toString() },
		'array': function () { return Array.prototype.slice.call(result); },
		/* other conversions */
		'alphanumeric': function () { return result.replace(/[^a-zA-Z0-9 ]/g, ""); },
		'slug': function () { return result.replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase().replace(" ", "-"); },
		'lower': result.toString().toLowerCase,
		'upper': result.toString().toUpperCase
	};

	if (conversions.hasOwnProperty(type)) {
		return conversions[type]();
	} else {
		throw RangeError("This method cannot convert from {} to {}".format(this.prototype.name, type));
	}
}