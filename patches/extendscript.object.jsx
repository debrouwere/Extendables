/* 
 * Patches for functional programming. 
 * Inspired by and sometimes copied from underscore.js 
 */

/**
 * @desc Merge two objects together. This modifies the original object.
 * First use :func:`Object#clone` on the object if you want to keep the original object intact.
 * 
 * @param {Object} The object to merge into this one.
 *
 * @returns {Object} Returns the merged object (``this``);
 */

Object.prototype.merge = function (obj) {
	if (!obj) return;
	
	var merged_obj = this;
	for (var name in obj) {
		merged_obj[name] = obj[name];
	}
	return merged_obj;
}

/**
 * @function
 * @desc An alias for :func:`Object#merge`
 */

Object.prototype.extend = Object.prototype.merge

/**
 * @desc Creates and returns a clone of the object.
 */

Object.prototype.clone = function () {
	if (this instanceof Array) return this.slice(0);
    return {}.merge(this);
}

/**
 * @desc Returns only the keys (also known as 'names') of an object or associative array.
 * @returns {Array} An array with all the keys.
 */

Object.prototype.keys = function () {
	var keys = [];
	for (var key in this) {
        if (this.hasOwnProperty(key)) keys.push(key);
    }
	return keys;
}

/**
 * @desc Returns only the values of an object or associative array.
 * @returns {Array} An array with all the values.
 *
 * @example
 *     > var nation = {'name': 'Belgium', 'continent': 'Europe'}
 *     > nation.values();
 *     ['Belgium', 'Europe']
 */

Object.prototype.values = function () {
	var self = this;
	return this.keys().map(function (key) {
		return self[key];
	});
}

/**
 * @desc An alias for ``this instanceof type``.
 * @returns {Bool} True or false.
 *
 * @example
 *     > [].is(Array);
 *     true
 */
Object.prototype.is = function(type) {
	return this instanceof type;
}