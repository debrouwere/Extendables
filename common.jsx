/*
 * A more-or-less CommonJS-compliant module import system.
 * Namespaces for Javascript -- yay!
 */

#include "extendscript.patches.jsx"
#include "indesign.patches.jsx"
#include "scriptui.patches.jsx"

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

// extracts a module into the global namespace (like the eponymous PHP function);
// to be avoided, except when convenience trumps stringency
function extract (module_id) {
	var module = require(module_id);
	for (var name in module) {
		$.global[name] = module[name];
	}
}

/* additional context for modules */
/*
var current = {
	window: app.layoutWindows.item(0),
	doc: app.documents.item(0),
	spread: function () {
		var spread = app.documents.item(0).spreads.firstItem();
		while (spread.pages.count() < 2) {
			spread = app.documents.item(0).spreads.nextItem(spread);
		}
		return spread;
	}()
}*/

// a snapshot of all globals, so we can clear up the dirty global namespace later.
var global = $.global.clone();
global.modules = modules;
global.require = require;
global.extract = extract;

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

	this.extract_submodules = function () {
		var submodule_files = file_or_folder.getFiles();
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
		if (this.packaged) {
			self.exports = self.submodules['__core__'].load().exports;
		} else {
			self.exports = self.eval(self.uri);
		}
		return self
	}
	
	/* init */
	this.id = file_or_folder.displayName.split('.')[0];
	this.uri = file_or_folder.absoluteURI;
	this.packaged = file_or_folder.isInstanceOf(Folder);
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
	if (key != 'global' && key != 'app') $.global[key] = global[key];
}
$.global.require = global.require
$.global.extract = global.extract
$.global.modules = global.modules

/*
var url = require("http/url");
alert(url.URL);
var http = require("http");
alert(http.URL);
*/