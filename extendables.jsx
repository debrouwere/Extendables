#include "patches/__all__.jsx"
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
 * @param {String} item Can be any one of ``window``, ``doc``, ``page`` or ``spread``.
 */

// todo: should pay mind to how application-specific this is

function current (item) {
	var items = {
		'window': app.layoutWindows.item(0),
		'document': app.documents.item(0),
		'page': app.documents.item(0).pages.item(0),
		'spread': app.documents.item(0).spreads.item(0)
	}

	if (items.has(item)) {
		return items[item];		
	} else {
		throw RangeError();
	}
}

// another approach would be q('window').active(), instead of current('window')