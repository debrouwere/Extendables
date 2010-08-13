// this is rough, pre-extendables code
// needs to be adapted into an OO extendables module
// with an interface similar to what's below
//
// should be lazy, so that performance is acceptable when people only
// need one little piece of information
//
// should also contain some code formerly from send-overflows.jsx
//
// I'm inclined to see this as a separate module, rather than as
// monkeypatches on the Document type, though I'm not a hundred
// percent decided yet.

function DocumentProperties(document) {
	this.dimensions;
	this.guides;
	this.layers;
	this.margins;
	this.masters;
	
	this.to_json = function () {
		
	}

	this.overflows = function () {
		return {};
	}

	this.generate_previews = function (output_to, resolution, quality) {
		/*
			output_to: folder, tmp folder, base64 array
			resolution: integer ... or: thumb, high, normal, low
			quality: high, low
		*/
	}
}

/*
	provides	two variables with a bunch of information about the active document: 
						pageInfo (info about masters, layers, guides and dimensions)
						libInfo (info about open libraries and the properties of the assets)
	requires	a template with no placed content
					guides need to be on the first spread to be sniffed out
	*/

#include "../lib/json.inc"

// get the orientation of a guide (or similar)
function get_orientation (obj) {
	if (obj.orientation == (HorizontalOrVertical.horizontal)) {
		return "horizontal";
	} else {
		return "vertical";
	}
}

/* basic info about how this script works
alert("This script gathers information about your document to aid in setting up an interface to Chimp.");
alert("If you want to specify any guides that content can snap to, please make sure they're present on the first two-page spread.");
alert("In addition, open all libraries you want to use with Chimp.");
*/

// get some info we can use to set up an interface to chimp

var current = {
	window: app.layoutWindows.item(0),
	doc: app.documents.item(0),
	spread: function () {
		var spread = app.documents.item(0).spreads.firstItem();
		while (spread.pages.count() < 2) {
			spread = app.documents.item(0).spreads.nextItem(spread);
		}
		return spread;
	}(),
}

current.docpreferences = current.doc.documentPreferences;
current.left           = current.spread.pages.item(0);
current.right          = current.spread.pages.item(1);

/*
 * Gather information about the document
 */

if (current.doc.pages.count() < 2) {
	alert("You need to open a document with at least one two-page spread.");
	exit();
}

if (current.window.activeSpread.pageItems.count() != 0) {
	alert("For this script to work, the first spread of this document needs to be empty except for guides.");
	exit();
	}

// prepare to populate pageInfo: layers
var layers = new Array();
for (var i = 0; i < current.doc.layers.length; i++) {
	layers[i] = current.doc.layers.item(i).name;
}

// prepare to populate pageInfo: guides
var guides = new Array();
for (var i = 0; i < current.spread.guides.length; i++) {
	guides[i] = {
		location: current.spread.guides.item(x).location,
		orientation: get_orientation(current.spread.guides.item(x))
	}
}

// prepare to populate pageInfo: pageMasters
var pageMasters = [];
for (x = 0; x < current.doc.masterSpreads.length; x++) {
	pageMasters[x] = {
		name: current.doc.masterSpreads.item(x).name,
		pages: current.doc.masterSpreads.item(x).pages.count()
	}
}

// Adobe doesn't give the unit these measurements are in
// but it doesn't matter because the same standard unit will be used for placement
var pageInfo = {
	width: current.docpreferences.pageWidth,
	height: current.docpreferences.pageHeight,
	margins: {
		left_page:   [current.left.marginPreferences.top, current.left.marginPreferences.right, current.left.marginPreferences.bottom, current.left.marginPreferences.left],
		right_right: [current.right.marginPreferences.top, current.right.marginPreferences.right, current.right.marginPreferences.bottom, current.right.marginPreferences.left]
		},
	masters: pageMasters,
	guides: guides,
	layers: layers
}







/* SEND OVERFLOWS */

function send_overflows () {
	var myCollection = myDoc; 
	var myFrameCount = myCollection.textFrames.count();
	var drop = "";

	// overloop alle frames en sla de contentlengte op in de drop variabele
	for (var i = 0; i < myFrameCount; i++) {
		var myFrame = myCollection.textFrames.item(i);
		var content = myFrame.contents.length;

		var xmlElement = myFrame.associatedXMLElement // het element
		
		try {
			var xmlParent = xmlElement.parent; // parent
			var xmlUID = xmlParent.xmlElements.itemByName("chimp").xmlElements.itemByName("uid"); // uid element
			var xmlElementName = xmlElement.markupTag.name; // naam van element
			var xmlUidContents = xmlUID.contents; // nid inhoud
			var myFrameLength = myFrame.contents.length;	

			// De contentlengte van alle textframes met bodytekst (gelinkt xml-element "body") wordt opgeslagen 
			// in de dropvariabele.
			// Dit is één lange seriële keten: <NID>,<lengte>;<NID>,<lengte>;...
			
			if (xmlElementName == "body") {	
				if (i != 0) { drop += ";"; }
				drop += xmlUidContents + "," + myFrameLength;
			}
		} catch (err) {}
			
		return drop
	}
}