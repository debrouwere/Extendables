#include "patches/extendscript.jsx"
#include "patches/indesign.jsx"
#include "patches/scriptui.jsx"
#include "loader.jsx"

/* additional context for modules */
/*
var current = {
	window: app.layoutWindows.item(0),
	doc: app.documents.item(0),
	spread: function () {
		var spread = app.documents.item(0).spreads.firstItem();
		while (spread.pages.count() < 2) {
			spread = app.documents.item(0).spreads.nextItem(spread);
		}
		return spread;
	}()
}*/