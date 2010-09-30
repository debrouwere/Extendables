#include ../../../dependencies/jasmine.js

function Template (path) {
	var base = new File($.fileName).parent;
	base.changePath("../templates");
	base.changePath(path);
	var template_file = new File(base.absoluteURI);
	template_file.open("r");
	this.template = template_file.read();
	template_file.close();
	
	this._output = false;
	this.render = function () {
		this._output = this.template.format.apply(this.template, arguments);
		return this._output;
	}

	this.write_to = function (path) {
		var base = new File($.fileName).parent.parent.parent.parent;
		base.changePath("./log");
		base.changePath(path);
		var out = new File(base.absoluteURI);
		if (this._output) {
			out.open("w");
			out.write(this._output);
			out.close();
		} else {
			throw new Error("There's no output to write. Did you call the render method first?");
		}
	}
}

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
		var reporter = new jasmine.JsApiReporter();
		jasmine.getEnv().addReporter(reporter);
		jasmine.getEnv().execute();
		return this._clean_results(reporter.suites_, reporter.results());
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
		var results = this.run();
		
		// some background info
		var datetime = new Date();
		var date = datetime.toDateString();
		var time = "{}:{}".format(datetime.getHours(), datetime.getMinutes());
		var environment = {
			'<strong>os</strong>': $.os,
			'<strong>build</strong>': $.build,
			'<strong>version</strong>': $.version,
			'<strong>path</strong>': $.includePath,
			'<strong>locale</strong>': $.locale,
			'<strong>app</strong>': app.name
			}.serialize('key-value', {'separator': ': ', 'eol': '<br />'});
		
		var tpl = {
			'report': new Template("report.html"),
			'suite': new Template("partial.suite.html"),
			'test': new Template("partial.test.html")
		};
		
		var suites = [];
		var testcount = 0;
		
		results.forEach(function(suite) {
			var tests = [];
			suite.specs.forEach(function(spec) {
				var test = tpl.test.render(spec.result, spec.result, spec.name);
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
}

exports.tests = new TestRunner();