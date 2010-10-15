================
DOM enhancements
================

.. toctree::
   :maxdepth: 2
   :glob:
   
   *

While Extendables includes a number of enhancements to the DOM objects you'll find in Adobe software, it works most of its magic at the Javascript level: it adds all kinds of methods to ``Array``, ``String``, ``Object``, ``Function`` and other prototypes, allowing for more expressive code with less boilerplate.

These helper methods range from ``obj.has(property)`` which checks whether an object contains a value for the specified property, to ``array.flatten()`` which flattens a nested array, to ``str.to('lower')`` which lowercases a string.

Extendables contains a number of array methods for `functional programming <http://en.wikipedia.org/wiki/Functional_programming>`_ which come in handy when filtering and manipulating arrays.
   
    #include "extendables/extendables.jsx";
            
	var people = [
		{'first': 'Abraham', 'last': 'Lincoln', 'statesman': true, 'title': 'president'},
		{'first': 'Joe', 'last': 'Pesci', 'statesman': false},
		{'first': 'Zed', 'last': 'Alastair', 'statesman': false}
		];

    // 
    var greetings = people.map(function (person) {
        return "Hello there {} {}, how are you?".format(person.first, person.last);
    });
    greetings.forEach(function (greeting) {
        alert(greeting);
    })
    
    // select all people who are statesmen and give
    // them an especially warm welcome
    people.select(function (person) {
        return person.statesman;
    }).forEach(function (person) {
        if (person.has('title')) {
            var title = person.title;
        } else {
            var title = 'Mr.';
        }
        alert("And I'd especially like to welcome {} {}".format(title, person.last));
    });