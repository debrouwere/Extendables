#include "../extendables.jsx";

// todo: create a new document

var doc = current('document');
doc.importXML('stories.xml');
// q: what with multiple stories, does it return all of them as you'd expect?
// var story = doc.xml().find('story');

// layout a page with all the story titles from the culture section
doc.xml().children().forEach(function (story) {
	// attr returns the value for the specified attribute on an element, 
	// in this case 'culture'.
	if (story.attr('section') == 'culture') {
		// val returns the value of an element, in this case the title
		var title = story.find('title').val();
		// todo: make a new text frame with that title;
		story.attr('processed', new Date().getTime());
	}
});

doc.pageItems.item(0).tag() == doc.xml().find(0).tag()



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

/** getter/setter */
var tag = function(name) {
	if (this.has('associatedXMLElement')) {
		// assocXMLElement is read-only, dus weet niet of dit zal werken
		return this.associatedXMLElement.tag(name);		
	} else {
		return undefined;
	}
}

PageItem.prototype.tag = tag;
TextFrame.prototype.tag = tag;
