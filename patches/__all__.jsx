#include "object.jsx"
#include "string.jsx"
#include "array.jsx"
#include "object.conversions.jsx"
#include "error.jsx"
#include "file.jsx"
#include "date.jsx"
#include "DOM/application.jsx"
if (!app.is("toolkit")) {
	#include "DOM/suite.jsx"
}
if (app.is("indesign")) {
	#include "DOM/indesign.jsx"
}