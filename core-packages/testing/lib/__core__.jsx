var setTimeout = function(fn) { return fn(); }
var clearTimeout = function(fn) { return; }
var setInterval = function(fn) { return fn(); }
var clearInterval = function(fn) { return; }

#include ../../../dependencies/jasmine.js

exports.jasmine = jasmine;

var Template = require("templating").Template;

var TestRunner = function () {
	this._clean_results = function (suites, results) {
		var cleaned_results = suites.map(function(suite) {
			var total = suite.children.length;
			var passed = suite.children.filter(function(spec) { 
				return (results[spec.id].result == "passed");
			}).length;
			var specs = suite.children.map(function (spec) {
				return {'name': spec.name, 
					'result': results[spec.id].result, 
					'message': results[spec.id].messages[0]
					}
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
		var reporter = new jasmine.JsApiReporter();
		jasmine.getEnv().addReporter(reporter);
		jasmine.getEnv().execute();
		return this._clean_results(reporter.suites_, reporter.results());
	}

	this.get_environment = function () {
		return {
			'<strong>OS</strong>': $.os,
			'<strong>ExtendScript build</strong>': $.build,
			'<strong>ExtendScript version</strong>': $.version,
			'<strong>path</strong>': $.includePath,
			'<strong>locale</strong>': $.locale,
			'<strong>app</strong>': app.name,
			'<strong>app version</strong>': app.version
		}
	}

	// we'll add this into the html representation, 
	// so people can upload structured test reports to our central server.
	this.as_json = function () {
		
	}

	this.to_console = function () {
		var results = this.run();
		
		results.forEach(function(suite) {
			$.writeln("\nSuite: {} \tran {} tests, {} failure(s)".format(suite.name, suite.total, suite.failed));
			suite.specs.forEach(function(spec) {
				$.writeln("\t" + spec.result.toUpperCase() + "\t" + spec.name);
			});
		});
	}

	this.to_log = function () {
		// todo
	}

	this.to_html = function (filename) {
		// some background info
		var datetime = new Date();
		var date = datetime.toDateString();
		var time = "{}:{}".format(datetime.getHours(), datetime.getMinutes());
		var environment = this.get_environment().serialize('key-value', {'separator': ': ', 'eol': '<br />'});		

		// output templates
		var tpl = {
			'report': new Template("report.html", module),
			'suite': new Template("partial.suite.html", module),
			'test': new Template("partial.test.html", module)
		};

		// run tests
		var results = this.run();
		
		// render results
		var suites = [];
		var testcount = 0;
		
		results.forEach(function(suite) {
			var tests = [];
			suite.specs.forEach(function(spec) {
				if (spec.result == 'failed') {
					var problem = '<p class="problem">{}</p>'.format(spec.message);
				} else {
					var problem = '';
				}
				var test = tpl.test.render(spec.result, spec.result, spec.name, problem);
				tests.push(test);
				testcount++;
			});
			var suite = tpl.suite.render(suite.name, suite.total, suite.failed, tests.join("\n"));
			suites.push(suite);
		});
	
		var duration = ((new Date().getTime() - datetime.getTime())/1000).toFixed(2);

		tpl.report.render(date, time, testcount, duration, suites.join('\n\n'), environment);
		tpl.report.write_to(filename);
	}

	// would be incredibly interesting to see usage patterns and whether certain tests
	// fail consistently on the same platform or app version or ...
	this.to_central_server = function () {
		// todo
	}
}

exports.tests = new TestRunner();