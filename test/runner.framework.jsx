/*
 * Bootstrap
 *
 * This script tests the loader among other things, so instead of using the loader system
 * we're bootstrapping this stuff ourselves.
 */

var exports = {};
#include "../patches/__all__.jsx"
#include "../core-packages/testing/lib/__core__.jsx"

for (name in exports) {
	$.global[name] = exports[name];
}

var specs = new File($.fileName).parent.getFiles("*.specs");

specs.forEach(function (specfile) {
	try {
		$.evalFile(specfile);
	} catch (error) {
		$.writeln(specfile + " is not a valid specifications file.\n" + error);
	}
});

tests.to_html("tests.framework.html");