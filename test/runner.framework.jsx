#include "../extendables.jsx"
extract("testing");

var specs = new File($.fileName).parent.getFiles("*.specs");

specs.forEach(function (specfile) {
	try {
		$.evalFile(specfile);
	} catch (error) {
		$.writeln(specfile + " is not a valid specifications file.\n" + error);
	}
});

tests.to_html("tests.framework.html");