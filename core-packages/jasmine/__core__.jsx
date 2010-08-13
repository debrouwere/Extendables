#include jasmine.jsx

var TestRunner = function () {
	this._clean_results = function (suites, results) {
		var cleaned_results = suites.map(function(suite) {
			var total = suite.children.length;
			var passed = suite.children.filter(function(spec) { 
				return (results[spec.id].result == "passed");
			}).length;
			var specs = suite.children.map(function (spec) {
				return {'name': spec.name, 'result': results[spec.id].result}
			});

			return {
				'name': suite.name,
				'passed': passed,
				'failed': new Number(total - passed),
				'total': total,
				'specs': specs
				};
		});
		return cleaned_results;
	}

	this.run = function () {
		var reporter = new jasmine.JsApiReporter()
		jasmine.getEnv().addReporter(reporter);
		jasmine.getEnv().execute();
		return this._clean_results(reporter.suites_, reporter.results());
	}

	this.to_console = function () {
		var results = this.run();
		
		results.forEach(function(suite) {
			$.writeln("\nSuite: %s \tran %s tests, %s failure(s)".format(suite.name, suite.total, suite.failed));
			suite.specs.forEach(function(spec) {
				$.writeln("\t" + spec.result.toUpperCase() + "\t" + spec.name);
			});
		});
	}

	this.to_log = function () {
		// todo
	}

	this.to_html = function () {
		// todo
	}
}

exports.tests = new TestRunner();