#include "../extendables.jsx"
extract("testing");

var specfiles = [];

__modules__.values().forEach(function (module) {
	module.get_tests().forEach(function (specs) {
		specfiles.push(specs);
	});
});

specfiles.forEach(function (specfile) {
	try {
		$.evalFile(specfile);
	} catch (error) {
		$.writeln(specfile + " is not a valid specifications file.\n" + error);
	}
});

tests.to_html("tests.packages.html");