/**
 * @desc This method overloads :func:`Object#is` to combat a problem with some versions of ExtendScript
 * that leads to all error types being considered the base class Error. This problem makes it impossible to
 * do simple comparisons on errors, for example ``new EvalError() instanceof SyntaxError``. The previous 
 * expression should return false but will return true.
 *
 * When testing whether you're dealing with a specific kind of error, use this method, and refrain
 * from using ``instanceof``.
 *
 * @param {Constructor} type Use the constructor itself, not a string or an instance.
 *
 * @example
 *     try {
 *         raise new SyntaxError();
 *     } catch (error if error.is(TypeError)) {
 *         alert("This displays in case of a type error, but not in case of a syntax error.");
 *     }
 *
 * @see :ref:`error-handling` has some useful advice on how to handle errors in ExtendScript.
 *
 * @returns {Bool}
 *     True or false. Any error type matches the base class, so ``new SyntaxError().is(Error)`` would return ``true``.
 */

Error.prototype.is = function (type) {
	if (this instanceof type) {
		return type == Error || this._type == type;
	} else {
		return false;
	}
}

/**
 * @desc Use this classmethod to make sure your custom error types work
 * just like the built-in ones.
 *
 * @param {String} name Preferably the same name as the variable you're associating the error with.
 *
 * @example var DatabaseError = Error.factory("DatabaseError");
 */

Error.factory = function (name) {
	var error = function (msg, file, line) {
		this.name = name;
		this.description = msg;
		this._type = error;
	}
	error.prototype = new Error();
	return error;
}

/**
 * @namespace
 *
 * Merely for documentation's sake. Some descriptions courtesy of the Mozilla MDC.
 */

var errors = {
	'builtin': {},
	'ext': $.global
	};

/**
 * @function
 * @desc A general-purpose error
 */

errors.builtin.Error = Error;
Error.prototype._type = Error;

/**
 * @function
 * @desc An error that occurs regarding the global function eval()
 */

errors.builtin.EvalError = EvalError;
EvalError.prototype._type = EvalError;

/**
 * @function
 * @desc An error that occurs when a numeric variable or parameter is outside of its valid range
 */

errors.builtin.RangeError = RangeError;
RangeError.prototype._type = RangeError;

/**
 * @function
 * @desc An error that occurs when de-referencing an invalid reference
 */

errors.builtin.ReferenceError = ReferenceError;
ReferenceError.prototype._type = ReferenceError;

/**
 * @function
 * @desc An error that occurs regarding the global function eval()
 */

errors.builtin.SyntaxError = SyntaxError;
SyntaxError.prototype._type = SyntaxError;

/**
 * @function
 * @desc An error that occurs when a variable or parameter is not of a valid type
 */

errors.builtin.TypeError = TypeError;
TypeError.prototype._type = TypeError;

/**
 * @function
 * @desc Use when an IO operation (loading a file, writing to a file, an internet connection) fails.
 */

errors.builtin.IOError = IOError;
IOError.prototype._type = IOError;

/**
 * @function
 * @desc Use when a calculation misbehaves.
 */

errors.ext.ArithmeticError = Error.factory("ArithmeticError");

/**
 * @function
 * @desc Use when an import fails. More specific than IOError.
 */

errors.ext.ImportError = Error.factory("ImportError");

/**
 * @function
 * @desc Use for exceptions that have nothing to do with Extendables or ExtendScript.
 */

errors.ext.EnvironmentError = Error.factory("EnvironmentError");

/**
 * @function
 * @desc Much like EvalError, but for your own parsers.
 */

errors.ext.ParseError = Error.factory("ParseError");

/**
 * @function
 * @desc Use when the system (either the Creative Suite app or the operating system) malfunctions.
 */

errors.ext.SystemError = Error.factory("SystemError");

/**
 * @function
 * @desc Use to warn people that a feature has not yet been implemented, as a placeholder
 * to remind yourself or to indicate that a subclass needs to overload the parent method.
 */

errors.ext.NotImplementedError = Error.factory("NotImplementedError");

/**
 * @function
 */

if (app.name.to('lower').contains("indesign")) {
	errors.builtin.ValidationError = ValidationError;
	ValidationError.prototype._type = ValidationError;
}