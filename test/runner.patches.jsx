/*
 * Bootstrap
 *
 * This script tests very basic functionality of the framework, so instead of using the loader system
 * we're bootstrapping this stuff ourselves.
 */

var exports = {};
#include "../patches/__all__.jsx"
#include "../core-packages/testing/lib/__core__.jsx"

for (name in exports) {
	$.global[name] = exports[name];
}

var base = new File($.fileName).parent;
base.changePath("../patches/test");
var specs = base.getFiles("*.specs");

specs.forEach(function (specfile) {
	try {
		$.evalFile(specfile);
	} catch (error) {
		$.writeln(specfile + " is not a valid specifications file.\n" + error);
	}
});

tests.to_html("tests.patches.html");
