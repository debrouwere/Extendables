/**
 * @class
 * @name Document
 */

// perhaps a getter/setter would be better, 
// which either returns the xml root or replaces it
// with the value of the argument (either a string, 
// using a temp file, or a file, using the native
// importXML directly.

Document.prototype.xml = function (name) {
	var i = name || 0;
	return this.xmlElements.item(i);
}

/**
 * @class
 * @name XMLElement
 */

/**
 * @desc This is equivalent to ``el.xmlElements.item(name)``
 */

XMLElement.prototype.find = function (name) {
	return this.xmlElements.item(name);
}

/**
 * @desc An attribute getter/setter.
 * @returns {undefined|String} Either nothing (when setting the attribute) or the attribute's value
 */

XMLElement.prototype.attr = function (name, value) {
	var attribute = this.xmlAttributes.item(name);
	if (!attribute.isValid) {
		return undefined;
	} else if (value) {
		attribute.value = value;
	} else {
		return attribute.value;
	}
}

/**
 * @desc An element's value getter/setter.
 * @returns {undefined|String} Either nothing (when setting the element's value) or the element's value
 */

XMLElement.prototype.val = function (value) {
	if (!this.isValid) {
		return undefined;
	} else if (value) {
		this.contents = value;
	} else {
		return this.contents;
	}
}

/**
 * @desc An element tag getter/setter.
 * @returns {undefined|String} Either nothing (when setting the tag) or the tag name
 */

XMLElement.prototype.tag = function (type) {
	if (type) {
		this.markupTag = type;
	} else {
		return this.markupTag.name;
	}
}

/**
 * @desc Returns the child xml elements as an array, instead of as an XMLElements collection.
 * If you prefer a collection, use the built-in ``xmlElements`` property instead of this function.
 *
 * Note that this should be equivalent to xml.xmlElements.everyItem() if the documentation to the
 * InDesign DOM were true, but everyItem() doesn't actually return a proper array.
 */
XMLElement.prototype.children = function() {
	var children = [];
	for (var i = 0; i < this.xmlElements.length; i++) {
		children.push(this.xmlElements[i]);
	}
	return children;
}

/**
 * @desc ``el.repr()`` is a poor man's XML deserializer.
 * It recursively transforms an XML tree into a native
 * ExtendScript object.
 *
 * Known limitations: 
 * * Ignores attributes and comments.
 * * If an element has children, it processes those, but any surrounding 
 *   text content will be ignored. ``<el>this text will be ignored <sub>but this won't be</sub></el>``
 *
 * @example
 *     // <root>
 *     //     <story>
 *     //         A fun little story.
 *     //         <title>An evening in Bristol</title>
 *     //         <authors>
 *     //             <name>Joel</name>
 *     //             <name>Liza</name>
 *     //         </authors>
 *     //     </story>
 *     // </root>
 *     > var root = doc.xml().repr()
 *     > root.story.title
 *     'An evening in Bristol'
 *     > root.story.authors
 *     ['Joel', 'Liza']
 */

XMLElement.prototype.repr = function () {
	var repr = {};
	this.children().forEach(function (element) {
		var tag = element.tag();
		
		if (element.children().length) {
			repr[tag] = element.repr();
		} else {
			// don't replace existing values, but transform 'em
			// into an array instead, and push to that array
			if (tag in repr) {
				if (!repr[tag].is(Array)) repr[tag] = [].push(repr[tag]);
				repr[tag].push(element.val());
			} else {
				repr[tag] = element.val();
			}			
		}
	});
	return repr;
}

/**
 * @class
 * @name Page
 */

// -- untested -- //

/**
 * @desc n/a
 */

Page.prototype.master = function(name) {
	if (name) {
		var master = current.doc.masterSpreads.itemByName(master);
		this.appliedMaster = master;
	} else {
		return this.appliedMaster;
	}

}

/**
 * @class
 * @name LayoutWindow
 */

/**
 * @desc n/a
 */

LayoutWindow.prototype.page = function(name) {
	if (name) {
		this.activePage = current.doc.pages.item(name);
	} else {
		return this.activePage;
	}
}

/** getter/setter */
var tag = function(name) {
	if (this.has('associatedXMLElement')) {
		// assocXMLElement is read-only, dus weet niet of dit zal werken
		return this.associatedXMLElement.tag(name);		
	} else {
		return undefined;
	}
}

/**
 * @class
 * @name PageItem
 */

/**
 * @desc n/a
 */

PageItem.prototype.tag = tag;

/**
 * @class
 * @name TextFrame
 */

/**
 * @desc n/a
 */

TextFrame.prototype.tag = tag;

/**
 * @class
 * @name Asset
 */

/**
 * @desc the built-in ``asset.placeAsset()`` can only place on a document or on text
 * whereas, most often, you want to place it on specific coordinates on a specific
 * page. This method does that.
 *
 * Works on the active document.
 *
 * @param {Object} positioning A positioning object has three attributes: 
 * ``page`` (a string or number), ``x`` and ``y`` (both unitless numbers).
 * Optionally, you may define a ``layer`` attribute, containing either a
 * layer name or a layer object.
 *
 * @returns {Object[]} Returns an array with the page items that make up the
 * library asset.
 *
 * @example
 *     var library = app.libraries.item('storylayouts.indl');
 *     var asset = library.assets.item('full-spread');
 *     var page_items = asset.place({
 *         'page': 5, 
 *         'x': 20, 
 *         'y': 50
 *     });
 */

Asset.prototype.place = function (positioning) {
	// TODO: should temporarily set unit origins to page, not spread, 
	// so we can treat lefthand and righthand pages the same
	// (note: perhaps using the .before and .after aspect-oriented tricks?)
	function setup () {
		return orig;
	}

	function teardown (orig) {
	}
	
	function move (items, x, y) {
		var group = current('window').activePage.groups.add(items);
		group.move([x, y]);
		group.ungroup();
	}
	// gather parameters
	var doc = current('document');
	var page = doc.pages.item(positioning.page);
	var window = current('window');
	var _margins_ = 20; // todo!
	var x = positioning.x || _margins_;
	var y = positioning.y || _margins_;
	var pos_layer = false; // todo!
	// put asset on the right page on a temporary layer
	window.activePage = page;
	var active_layer = doc.activeLayer;
	var temporary_layer = doc.layers.add({'name': '__temp__'});
	this.placeAsset(doc);
	// page items become invalid and lose their ids when they get merged into
	// another layer, so we have to go through quite a bit of trickery
	// to keep track of which 
	for (i = 0; i < temporary_layer.pageItems.count(); i++) {
		temporary_layer.pageItems.item(i).insertLabel('__temp__', '__temp__');
	}
	// move the page items that comprise the asset, to the given location
	move(temporary_layer.pageItems, x, y);
	// delete the temporary layer
	active_layer.merge(temporary_layer);
	var items = [];
	for (i = 0; i < active_layer.pageItems.count(); i++) {
		var item = active_layer.pageItems.item(i);
		if (item.extractLabel('__temp__') == '__temp__') {
			item.insertLabel('__temp__', '');
			items.push(item);
		}
	}
	return items;
}