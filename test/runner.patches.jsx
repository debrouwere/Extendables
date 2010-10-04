#include "bootstrapper.jsx"

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