/*
 * The pony on my todo list: allow .to() conversions to work with
 * obj.toNumber, obj.toFunction, obj.toArray, obj.toBool,
 * similarly to how __int__, __float__, __call__, __iter__ and __nonzero__ work
 *
 * this would look nice: 
 * function MyConstructor () {
 * 	this.to.number = function () {}
 * }
 * 
 * also: a .has() method, that can work with something similar to __contains__ in Python
 *
 * Before I get started though, check out what javascript will allow for out of the box
 * and see how "native" I can make this look -- e.g. new Array(obj)) may need to override 
 * the constructor, and if we can't do this, we'll have to note to people that they can only
 * use .to() as well as integrate this functionality with stuff like
 * comp: max, min
 * func: map, filter, reduce, select, reject
 * array: forEach
 *
 * Its usefulness would depend entirely on the range of functions able to work with these emulations
 * out of the box. If that range is too small, it'll just be confusing. Either way, it might just
 * be a little too magical for javascripters who are not used to this type of functionality.
 */

/*
// this works:

Object.prototype.to = function (type) {
	if (this.to.hasOwnProperty(type)) {
		return this.to[type]();
	}
}

function Person () {
	var self = this;
	this.phone;
	this.to.number = function () { return self.phone; }
}

var guy = new Person();
guy.phone = 1234;

guy.to('number');
*/

var exports = {};
var base64 = exports;

#include "../dependencies/json2.js"
#include "../dependencies/base64.js"

// keyvalue encoding comes in handy to create things like INI files and HTTP headers

var keyvalue = {};
keyvalue.encode = function (obj, options) {
	var separator = options["separator"] || "=";
	var eol = options["eol"] || "\n";
	var output = "";
	var properties = obj.reflect.properties.reject(function (property) { 
		return property.name.startswith("_") || property.name == 'reflect'; 
	})
	properties.forEach(function (property) {
		output += property.name + separator + obj[property.name] + eol;
	});
	return output;
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
	var obj = this;
	// type: json, keyvalue
	var serializations = {
		'json': function () { return JSON.stringify(obj, undefined, options || 4); },
		'base64': function () { return base64.encode64(obj); },
		'key-value': function () { return keyvalue.encode(obj, options); }
	};

	if (serializations.hasOwnProperty(type)) {
		return serializations[type]();
	} else {
		throw RangeError("This method cannot convert from {} to {}".format(obj.prototype.name, type));
	}
}

Object.prototype.deserialize = function (type, options) {
	var obj = this;
	
	var deserializations = {
		'json': function () { return JSON.parse(obj); },
		'base64': function () { return base64.decode64(obj); },
		'key-value': function () { return keyvalue.decode(obj, options); }
	}

	if (deserializations.hasOwnProperty(type)) {
		return deserializations[type]();
	} else {
		throw RangeError("This method cannot convert from {} to {}".format(obj.prototype.name, type));
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
		// REFACTOR: 'int' should be 'number', to correspond to the class name!
		'int': function () { return parseInt(result); },
		'float': function () { return parseFloat(result); },
		'string': function () { return result.toString() },
		'array': function () { return Array.prototype.slice.call(result); },
		/* other conversions */
		'alphanumeric': function () { return result.replace(/[^a-zA-Z0-9 ]/g, ""); },
		'slug': function () { return result.replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase().replace(" ", "-"); },
		'lower': function () { return result.toLowerCase(); },
		'upper': function () { return result.toUpperCase(); }
	};

	if (conversions.hasOwnProperty(type)) {
		return conversions[type]();
	} else {
		throw RangeError("This method cannot convert from {} to {}".format(this.prototype.name, type));
	}
}