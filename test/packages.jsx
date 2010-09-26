#include "../extendables.jsx"
extract("jasmine");

var specfiles = [];

modules.values().forEach(function (module) {
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

tests.to_console();