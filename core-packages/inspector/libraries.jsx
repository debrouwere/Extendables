// this is rough, pre-extendables code
// needs to be adapted into an OO extendables module
// with an interface similar to what's below

function LibraryProperties(library) {
	this.to_json = function () {
		
	}
}

/* HELPER FUNCTIONS */

function move (items, position) {
	if (items.count() > 1) {
		var group = current.window.activePage.groups.add(items);
		group.move(position);
		group.ungroup();
	} else if (items.count() > 0) {
		items.item(0).move(position);
	}
}

function group (items) {
	if (items.count() > 1) {
		return current.window.activeSpread.groups.add(items);
	} else if (items.count() > 0) {
		return items.item(0);
	} else {
		return false;
	}
}

// get_dimensions assumes it's working on an empty page
function get_dimensions (asset, text) {
	// let's place the asset so we can ascertain its dimensions
	asset.placeAsset(current.doc);

	var items = current.window.activeSpread.pageItems;
	
	if (text) {
			for (var i = 0; i < items.count(); i++) {
			var item = items.item(x);
			if (current.window.activeSpread.textFrames.itemByID(item.id).contents == undefined) {
				item.remove();
				}
			} // for loop through all pageitems
	} // if:text
	
	// move the lot to a safe base-position
	move(items, [0, 0]);
	var myGroup = group(items);

	if (myGroup == false) { return false; }
		
	var myBounds = myGroup.visibleBounds;
	var width = parseInt(myBounds[3] - myBounds[1]);
	var height = parseInt(myBounds[2] - myBounds[0]);
	// we've got what we need, so away with this asset
	myGroup.remove();
	return [width, height];
} // f:get_dimensions

function get_chars (asset) {
	asset.placeAsset(current.doc);
	var items = current.window.activeSpread.pageItems;

	for (var x = 0; x < items.count(); x++) {
		var item = items.item(x);
		
		if (item.associatedXMLElement != undefined) {
			if (item.associatedXMLElement.markupTag.name == "body") {
				var thisFrame = current.window.activeSpread.textFrames.itemByID(item.id);
				thisFrame.contents = TextFrameContents.PLACEHOLDER_TEXT;
				var charLength = Math.round(thisFrame.contents.length/100)*100;
			}
		}
	} // for loop through all pageitems

	var myGroup = group(items);
	myGroup.remove();
	
	return charLength || false;

} // f:get_chars

/*
	Gather information about open libraries
	*/

var myPage = current.window.activePage = current.doc.pages.item(1);

// populate libInfo
var libInfo = [];
var libCount = app.libraries.count();
for (var x = 0; x < libCount; x++) {
	var thisLib = app.libraries.item(x);
	var theseAssets = [];
	var assetsCount = thisLib.assets.count();
	
	for (var y = 0; y < assetsCount; y++) {
		var asset = thisLib.assets.item(y);
		theseAssets[y] = {
			name: asset.name,
			dimensions: get_dimensions(asset),
			text_dimensions: get_dimensions(asset, true),
			body_length: get_chars(asset)
		}
	} // for loop through the assets

	libInfo[x] = {
		name: thisLib.name,
		items: theseAssets
	}
} // for loop through the libraries