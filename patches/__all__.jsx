#include "extendscript.object.jsx"
#include "extendscript.string.jsx"
#include "extendscript.array.jsx"
#include "extendscript.conversions.jsx"
#include "extendscript.error.jsx"
#include "extendscript.file.jsx"
#include "extendscript.date.jsx"
#include "application.jsx"
if (!app.is("toolkit")) {
	#include "application.suite.jsx"
}
if (app.is("indesign")) {
	#include "application.indesign.jsx"
}