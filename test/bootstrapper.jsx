/*
 * Bootstrap
 *
 * This script tests the loader among other things, so instead of using the loader system
 * we're bootstrapping this stuff ourselves.
 */

var exports = {};
#include "../patches/__all__.jsx"
#include "../core-packages/templating/lib/__core__.jsx"
function require () { 
	return { 
		Template: exports.Template.clone()
	};
}
var module = {
	'id': 'testing',
	'uri': new File("core-packages/testing/lib/__core__.jsx").at(Folder.extendables)
}

#include "../core-packages/testing/lib/__core__.jsx"

for (name in exports) {
	$.global[name] = exports[name];
}