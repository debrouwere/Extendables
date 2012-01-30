// quick testing: 
var exports = {};
#include ../../../patches/__all__.jsx

var str = {'bla bla bla': 'yes'}.serialize('json');
var obj = str.deserialize('json');

str.to_console();
obj.serialize('key-value').to_console();

function Store(uri) {
	this.uri = uri;
	this.file = new File(uri);
	this.data = {};

	this.save = function () {
		this.file.open();
	}
	
	this.destroy = function () {
	}

	var engine = new engine(resource_path);
	Model.objects = new Manager(engine);
	return Model;
}