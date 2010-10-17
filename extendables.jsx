#include "patches/__all__.jsx"
#include "settings.jsx"
#include "loader.jsx"
load_modules(['./core-packages', './site-packages']);

// note: if we want some modules to be available in the global namespace, 
// we can simply extract() 'em here

/* additional context for modules */

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

	if (item in items) {
		return items[item];		
	} else {
		throw RangeError();
	}
}

// another approach would be q('window').active(), instead of current('window')