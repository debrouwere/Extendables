#include "patches/extendscript.object.jsx"
#include "patches/extendscript.string.jsx"
#include "patches/extendscript.array.jsx"
#include "patches/extendscript.conversions.jsx"
if (app.name.to('lower').contains("toolkit")) {
	#include "patches/application.jsx"
}
if (app.name.to('lower').contains("indesign")) {
	#include "patches/application.indesign.jsx"
}
#include "loader.jsx"

// note: if we want some modules to be available in the global namespace, we can simply extract() 'em here

/* additional context for modules */
/*
var current = {
	window: app.layoutWindows.item(0),
	doc: app.documents.item(0),
	page: app.documents.item(0).
	spread: function () {
		var spread = app.documents.item(0).spreads.firstItem();
		while (spread.pages.count() < 2) {
			spread = app.documents.item(0).spreads.nextItem(spread);
		}
		return spread;
	}()
}*/

// example use

/**
 * Whatever dude.
 * @example
 * var x = y();
 *
 * @param {String} item Can be any one of ``window``, ``doc``, ``page`` or ``spread``.
*/
function current (item) {
	var items = {
		'window': app.layoutWindows.item(0),
		'doc': app.documents.item(0),
		'page': app.documents.item(0).pages.item(0),
		'spread': app.documents.item(0).spreads.item(0)
	}

	if (items.indexOf(item)) {
		return items[item];		
	} else {
		throw RangeError();
	}
}

// another approach would be q('window').active(), instead of current('window')

/**
 * @name rescue
 */
function rescue(error, expected_error_type, fn) {
	if (error instanceof expected_error_type) {
		fn();
	} else {
		throw error;
	}
}