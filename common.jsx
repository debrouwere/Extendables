/*
 * A more-or-less CommonJS-compliant module import system.
 * Namespaces for Javascript -- yay!
 */

#include "monkeypatches.jsx"

var PACKAGEFOLDERS = ['./core-packages', './site-packages'];
var modules = {};
function require (module_id) {
	// CommonJS: A module identifier is a String of "terms"
	var terms = module_id.split('/');
	var module = terms.shift();
	
	if (modules.hasOwnProperty(module)) {
		if (terms.length) {
			return modules[module].get_submodule(terms).load().exports;
		} else {
			return modules[module].load().exports;
		}
	} else {
		throw Error("No package named " + module_id);
	}
}

// a snapshot of all globals, so we can clear up the dirty global namespace later.
var global = $.global.clone();
global.modules = modules;
global.require = require;

function Module (file_or_folder) {
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

	this.extract_submodules = function (folder) {
		var submodule_files = folder.getFiles();
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

	this.load = function () {
		if (file_or_folder.isInstanceOf(Folder)) {
			self.extract_submodules(file_or_folder);
			self.exports = self.submodules['__core__'].load().exports;
		} else {
			self.exports = self.eval(file_or_folder);
		}
		return self
	}
	
	/* init */
	this.id = file_or_folder.displayName.split('.')[0];
	this.uri = file_or_folder.absoluteURI;
	this.submodules = {};
}

/* main */

PACKAGEFOLDERS.forEach(function(packagefolder) {
	var folder = new File($.fileName).parent;
	folder.changePath(packagefolder);
	var packages = folder.getFiles();
	
	packages.forEach(function(file_or_folder) {
		var module = new Module(file_or_folder);
		modules[module.id] = module;
	});	
});

// $.evalFile messes up the global namespace regardless of how you use it, so
// we have to clean up the mess afterwards by reverting globals to an older
// state, albeit with the 'modules' and 'require' vars mixed back in.
// You think that'd be as easy as $.global = global, but the $.global
// attribute is sort-of-not-quite-entirely-writable.
for (var key in $.global) {
	if (key != 'global') $.global[key] = global[key];
}
$.global.require = global.require
$.global.modules = global.modules