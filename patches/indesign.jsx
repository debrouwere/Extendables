Document.prototype.xml = function () {
	return this.xmlElements.item(0);
}

XMLElement.prototype.find = function (name) {
	return this.xmlElements.item(name);
}

XMLElement.prototype.attr = function (name, value) {
	var attribute = this.xmlAttributes.item(name);
	if (value) {
		attribute.value = value;
	} else {
		return attribute.value;
	}
}

XMLElement.prototype.val = function (value) {
	if (value) {
		this.contents = value;
	} else {
		return this.contents;
	}
}

XMLElement.prototype.tag = function (type) {
	if (type) {
		this.markupTag = type;
	} else {
		return this.markupTag.name;
	}
}

XMLElement.prototype.children = function() {
	return this.xmlElements;
}

XMLElement.prototype.first = function() {
	return this.xmlElements.firstItem();
}

XMLElement.prototype.last = function() {
	return this.xmlElements.lastItem();
}

// Like forEach, but for XMLElements instead of Arrays
// The Object Model Viewer says xmlElements.everyItem()
// should return a plain Array, but it doesn't, so we're
// left to our own devices.
XMLElement.prototype.each = function (fn) {
	var array = [];
	for (var i = 0; i < this.xmlElements.length; i++) {
		array.push(this.xmlElements[i]);
	}
	return array.forEach(fn);
}

// A poor man's XML deserializer.
XMLElement.prototype.repr = function () {
	var repr = {};
	var elements = this.xmlElements;
	this.each(function (element) {
		if (element.children().length) {
			repr[element.tag()] = element.repr();
		} else {
			repr[element.tag()] = element.val();
		}
	});
	return repr;
}

// -- untested -- //

Page.prototype.master = function(name) {
	if (name) {
		var master = current.doc.masterSpreads.itemByName(master);
		this.appliedMaster = master;
	} else {
		return this.appliedMaster;
	}

}

LayoutWindow.prototype.page = function(name) {
	if (name) {
		this.activePage = current.doc.pages.item(name);
	} else {
		return this.activePage;
	}
}

PageItem.prototype.tag = function(name) {
	// assocXMLElement is read-only, dus weet niet of dit zal werken
	return this.associatedXMLElement.tag(name);
}

Asset.prototype.place = function(location) {
	// 'wrapper' rond .placeAsset(on), omdat die functionaliteit
	// je enkel toelaat een document te kiezen, terwijl wij
	// op een exacte positie willen kunnen plaatsen
}