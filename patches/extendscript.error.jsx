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

Error.prototype._type = Error;
EvalError.prototype._type = EvalError;
RangeError.prototype._type = RangeError;
ReferenceError.prototype._type = ReferenceError;
SyntaxError.prototype._type = SyntaxError;
TypeError.prototype._type = TypeError;

/**
 * @desc Use this classmethod to make sure your custom error types work
 * just like the built-in ones.
 *
 * @param {String} name Preferably the same name as the variable you're associating the error with.
 *
 * @example var DatabaseError = Error.factory("DatabaseError");
 */

Error.factory = function (name) {
	var error = function () {
		this.name = name;
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

var errors = $.global;

/**
 * @function
 * @desc A general-purpose error
 */

errors.Error = Error;

/**
 * @function
 * @desc An error that occurs regarding the global function eval()
 */

errors.EvalError = EvalError;

/**
 * @function
 * @desc An error that occurs when a numeric variable or parameter is outside of its valid range
 */

errors.RangeError = RangeError;

/**
 * @function
 * @desc An error that occurs when de-referencing an invalid reference
 */

errors.ReferenceError = ReferenceError;

/**
 * @function
 * @desc An error that occurs regarding the global function eval()
 */

errors.SyntaxError = SyntaxError;

/**
 * @function
 * @desc An error that occurs when a variable or parameter is not of a valid type
 */

errors.TypeError = TypeError;

/**
 * @function
 * @desc Use when a calculation misbehaves.
 */

errors.ArithmeticError = Error.factory("ArithmeticError");

/**
 * @function
 * @desc Use when an IO operation (loading a file, writing to a file, an internet connection) fails.
 */

errors.IOError = Error.factory("IOError");

/**
 * @function
 * @desc Use when an import fails. More specific than IOError.
 */

errors.ImportError = Error.factory("ImportError");

/**
 * @function
 * @desc Use for exceptions that have nothing to do with Extendables or ExtendScript.
 */

errors.EnvironmentError = Error.factory("EnvironmentError");

/**
 * @function
 * @desc Use when the system (either the Creative Suite app or the operating system) malfunctions.
 */

errors.SystemError = Error.factory("SystemError");

/**
 * @function
 * @desc Use to warn people that a feature has not yet been implemented, as a placeholder
 * to remind yourself or to indicate that a subclass needs to overload the parent method.
 */

errors.NotImplementedError = Error.factory("NotImplementedError");