#include "../dependencies/json2.js"

// note: the Mozilla stuff is MIT licensed!

/* Javascript 1.6 Array extras, courtesy of Mozilla */

if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length >>> 0;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++)
    {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
  };
}

if (!Array.prototype.lastIndexOf)
{
  Array.prototype.lastIndexOf = function(elt /*, from*/)
  {
    var len = this.length;

    var from = Number(arguments[1]);
    if (isNaN(from))
    {
      from = len - 1;
    }
    else
    {
      from = (from < 0)
           ? Math.ceil(from)
           : Math.floor(from);
      if (from < 0)
        from += len;
      else if (from >= len)
        from = len - 1;
    }

    for (; from > -1; from--)
    {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
  };
}

if (!Array.prototype.every)
{
  Array.prototype.every = function(fun /*, thisp*/)
  {
    var len = this.length >>> 0;
    if (typeof fun != "function")
      throw new TypeError();

    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in this &&
          !fun.call(thisp, this[i], i, this))
        return false;
    }

    return true;
  };
}

if (!Array.prototype.filter)
{
  Array.prototype.filter = function(fun /*, thisp*/)
  {
    var len = this.length >>> 0;
    if (typeof fun != "function")
      throw new TypeError();

    var res = [];
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in this)
      {
        var val = this[i]; // in case fun mutates this
        if (fun.call(thisp, val, i, this))
          res.push(val);
      }
    }

    return res;
  };
}

if (!Array.prototype.forEach)
{
  Array.prototype.forEach = function(fun /*, thisp*/)
  {
    var len = this.length >>> 0;
    if (typeof fun != "function")
      throw new TypeError();

    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in this)
        fun.call(thisp, this[i], i, this);
    }
  };
}

if (!Array.prototype.map)
{
  Array.prototype.map = function(fun /*, thisp*/)
  {
    var len = this.length >>> 0;
    if (typeof fun != "function")
      throw new TypeError();

    var res = new Array(len);
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in this)
        res[i] = fun.call(thisp, this[i], i, this);
    }

    return res;
  };
}

if (!Array.prototype.some)
{
  Array.prototype.some = function(fun /*, thisp*/)
  {
    var i = 0,
        len = this.length >>> 0;

    if (typeof fun != "function")
      throw new TypeError();

    var thisp = arguments[1];
    for (; i < len; i++)
    {
      if (i in this &&
          fun.call(thisp, this[i], i, this))
        return true;
    }

    return false;
  };
}

/* Javascript 1.8 Array extras, courtesy of Mozilla */

if (!Array.prototype.reduce)
{
  Array.prototype.reduce = function(fun /*, initial*/)
  {
    var len = this.length >>> 0;
    if (typeof fun != "function")
      throw new TypeError();

    // no value to return if no initial value and an empty array
    if (len == 0 && arguments.length == 1)
      throw new TypeError();

    var i = 0;
    if (arguments.length >= 2)
    {
      var rv = arguments[1];
    }
    else
    {
      do
      {
        if (i in this)
        {
          var rv = this[i++];
          break;
        }

        // if array contains no values, no initial value to return
        if (++i >= len)
          throw new TypeError();
      }
      while (true);
    }

    for (; i < len; i++)
    {
      if (i in this)
        rv = fun.call(undefined, rv, this[i], i, this);
    }

    return rv;
  };
}

if (!Array.prototype.reduceRight)
{
  Array.prototype.reduceRight = function(fun /*, initial*/)
  {
    var len = this.length >>> 0;
    if (typeof fun != "function")
      throw new TypeError();

    // no value to return if no initial value, empty array
    if (len == 0 && arguments.length == 1)
      throw new TypeError();

    var i = len - 1;
    if (arguments.length >= 2)
    {
      var rv = arguments[1];
    }
    else
    {
      do
      {
        if (i in this)
        {
          var rv = this[i--];
          break;
        }

        // if array contains no values, no initial value to return
        if (--i < 0)
          throw new TypeError();
      }
      while (true);
    }

    for (; i >= 0; i--)
    {
      if (i in this)
        rv = fun.call(undefined, rv, this[i], i, this);
    }

    return rv;
  };
}

/*

/* Safe JSON serializer, adapted from JSON.org */

var toJsonStringArray = function(arg, out) {
    out = out || new Array();
    var u; // undefined

    switch (typeof arg) {
    case 'object':
        if (arg) {
            if (arg.constructor == Array) {
                out.push('[');
                for (var i = 0; i < arg.length; ++i) {
                    if (i > 0)
                        out.push(',\n');
                    toJsonStringArray(arg[i], out);
                }
                out.push(']');
                return out;
            } else if (typeof arg.toString != 'undefined') {
                out.push('{');
                var first = true;
                for (var i in arg) {
                    var curr = out.length; // Record position to allow undo when arg[i] is undefined.
                    if (!first)
                        out.push(',\n');
                    toJsonStringArray(i, out);
                    out.push(':');                    
                    toJsonStringArray(arg[i], out);
                    if (out[out.length - 1] == u)
                        out.splice(curr, out.length - curr);
                    else
                        first = false;
                }
                out.push('}');
                return out;
            }
            return out;
        }
        out.push('null');
        return out;
    case 'unknown':
    case 'undefined':
    case 'function':
        out.push(u);
        return out;
    case 'string':
        out.push('"')
        out.push(arg.replace(/(["\\])/g, '\\$1').replace(/\r/g, '').replace(/\n/g, '\\n'));
        out.push('"');
        return out;
    default:
        out.push(String(arg));
        return out;
    }
}

/* Assorted patches */

// note: I'd love to delegate most of this to underscore.js, though it doesn't work with ExtendScript
// out of the box.

Object.prototype.clone = function () {
	return eval(uneval(this));
}

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

Array.prototype.flatten = function () {
    return this.reduce(function(memo, value) {
		if (value instanceof Array) return memo.concat(value.flatten());
		memo.push(value);
		return memo;
    }, []);
  };

Object.prototype.keys = function () {
	var keys = [];
	for (var key in this) {
        if (this.hasOwnProperty(key)) keys.push(key);
    }
	return keys;
}

Object.prototype.values = function () {
	var self = this;
	return this.keys().map(function (key) {
		return self[key];
	});
}

Object.prototype.isEmpty = function () {
    for (var prop in this) {
        if (this.hasOwnProperty(prop)) return false;
    }
    return true;
};

Object.prototype.merge = function (obj) {
	if (!obj) return;
	
	var merged_obj = this;
	for (var name in obj) {
		merged_obj[name] = obj[name];
	}
	return merged_obj;
}

// the inverse of isPrototypeOf
// when doing inheritance, this works better than testing obj.constructor == type
Object.prototype.isInstanceOf = function(type) {
	return this instanceof type;
}

String.prototype.format = function() {	
	// split the string into parts around the substring replacement symbols (%s).
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