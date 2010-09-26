/*
 * A more-or-less CommonJS-compliant module import system.
 * Namespaces for Javascript -- yay!
 */

var PACKAGEFOLDERS = ['./core-packages', './site-packages'];
var __modules__ = {};
function require (module_id) {
	// CommonJS: A module identifier is a String of "terms"
	var terms = module_id.split('/');
	var module = terms.shift();
	
	if (__modules__.hasOwnProperty(module)) {
		if (terms.length) {
			return __modules__[module].get_submodule(terms).load().exports;
		} else {
			return __modules__[module].load().exports;
		}
	} else {
		throw Error("No package named " + module_id);
	}
}

// extracts a module into the global namespace (like the eponymous PHP function);
// to be avoided, except when convenience trumps stringency
function extract (module_id) {
	var module = require(module_id);
	for (var name in module) {
		$.global[name] = module[name];
	}
}

/**
 * @class Module
 * @desc The module loading system.
 * @param {File} file_or_folder Expects a file or folder, wrapped in a File object.
 * @param {String} [garbage="gooblygok"] Just a jsdoc test.
 * @returns {Object} a module object, duh.
 * @deprecated
 *	 0.1
 * 	This thing is pretty shitty anyway. Try :func:`current` instead.
 * @example
 *     // here it is!
 *     var x = Module(new File($.scriptName));
 *
 * @see :func:`current`
 */
function Module (file_or_folder, is_package) {	
	var self = this;
	
	this.eval = function (file) {
		var exports = {};
		var module = {
			'id': self.id,
			'uri': self.uri
			};

		try {
			$.evalFile(file);
		} catch (error) {
			// REFACTOR: shouldn't be user-facing; should perhaps be a log message
			alert("Could not fully load " + module.id + "\n" + error);	
		}
		return exports;		
	};

	this.extract_submodules = function () {
		var base = file_or_folder;
		if (is_package) {
			base.changePath("./lib");
		}
		var submodule_files = base.getFiles();
		
		submodule_files.forEach(function(submodule) {
			var submodule = new Module(submodule);
			self.submodules[submodule.id] = submodule;
		});
	};

	this.get_submodule = function (terms) {
		var submodule = self.submodules[terms.shift()]
		if (terms.length) {
			return submodule.get_submodule(terms);
		} else {
			return submodule;
		}
	};

	this.get_subpackages = function () {
		return self.submodules.values().filter(function (submodule) {
			return submodule.packaged && submodule.id != 'tests';
		});
	}

	/**
	  * @static
	  * @constant
	  * @desc nothing special, but static!
	  */
	this.has_subpackages = function () {
		return !!self.get_subpackages().length;
	}

	/** 
	 * let's document this one for kicks 
	 * @example
	 *	module.get_tests().map(function () { do_something(); });
	 *
	 * @since 0.1
	 * @see You'll find a higher-level API at :js:func:`current`
	 * @author Stijn Debrouwere, Rens Dusseldorf
	 */
	this.get_tests = function () {
		var testfolder = new Folder(self.uri);
		testfolder.changePath("./test");
		if (testfolder.exists) {
			return testfolder.getFiles("*.specs");
		} else {
			return [];
		}
	}

	/**
	 * @param {Bool} packaged Nah not really!
	 * @returns {Module} the module itself
	 */
	this.load = function () {
		if (self.packaged) {
			self.exports = self.submodules['__core__'].load().exports;
		} else {
			self.exports = self.eval(self.uri);
		}
		return self
	}
	
	/* init */
	this.id = file_or_folder.displayName.split('.')[0];
	this.uri = file_or_folder.absoluteURI;
	this.packaged = file_or_folder.is(Folder);
	this.submodules = {};
	if (this.packaged) {
		this.extract_submodules();
	}
}

/* main */

PACKAGEFOLDERS.forEach(function(packagefolder) {
	var folder = new File($.fileName).parent;
	folder.changePath(packagefolder);
	var packages = folder.getFiles();
	
	packages.forEach(function(file_or_folder) {
		var module = new Module(file_or_folder, true);
		__modules__[module.id] = module;
	});	
});