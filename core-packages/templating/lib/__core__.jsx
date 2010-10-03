exports.Template = Template;

function Template (path, module) {
	var base = new File(module.uri).parent.parent;
	base.changePath("templates");
	base.changePath(path);
	var template_file = new File(base);
	if (!template_file.exists) {
		throw IOError("Couldn't open template {}".format(template_file));
	}
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