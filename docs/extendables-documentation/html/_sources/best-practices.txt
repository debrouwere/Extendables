.. _best-practices:

==============
Best practices
==============

Organizing a project
====================

* there's usually no need for too much up-front software architecture, but, as you go along, do try to refactor and split off reusable code into (a) separate files, (b) their own Extendables modules :ref:`writing-a-module` => namespaced code keeps things sane, and reusable code saves time. You may even consider publishing on GitHub.
* when part of your script needs to run at startup, make a shortcut or alias in the startup dir to the file you want to run at startup, rather than having part of your project in Startup Scripts and another part in e.g. Scripts Panel
* 

Code style
==========

todo

.. _error-handling:

How to do error handling
========================

Error handling may seem boring, but it can make your projects more robust and make debugging easier. Here are some hard-and-fast rules.

.. seealso::

   :ref:`error-methods` describes Extendables' additions to standard error handling in ExtendScript.

Catch a specific error type 
---------------------------

Never do blanket catches, but instead specify which faulty behavior your
code should catch. That way, when you want to deal with e.g. a TypeError, 
your code will catch only those, but not a SyntaxError. For example: 

.. code-block:: extendscript

    try {
    	throw new SyntaxError("I mess things up. Because I can.");
    } catch (error if error.is(TypeError)) {
        // this alert will never show, because "hello"() is
        // faulty syntax, not a type error.
    	alert("This isn't the right type!")
    }

Throw errors instead of returning false
---------------------------------------

In your own functions, don't obscure the fact that something
went wrong by returning ``false``, make it clearer by throwing
a meaningful error.

.. code-block:: extendscript

    // don't do this
    function digger (pile) {
        if (!pile) return false;
        // more code here
    }

    // do this
    function digger (soil) {
        if (!soil) throw ReferenceError("digger requires soil")
    }

Make your errors informative
----------------------------

Whenever it makes sense, specify the right error type together with an error *message*.

It can also make sense to define your own error types. 
Prevent `leaky abstractions <http://en.wikipedia.org/wiki/Leaky_abstraction>`_ 
by replacing generic errors with ones that provide a meaningful message in the 
context of your program.

.. code-block:: extendscript

    var DatabaseError = Error.factory("DatabaseError");
    function fetch_record(database, id) {
        try {
            return db[database][id];
        } catch (error if error.is(ReferenceError)) {
            var error_msg = "Record {} in database {} does not exist.".format(id, database);
            throw DatabaseError(error_msg);
        }
    }

.. seealso::

   You can find a list of all error types and what they mean at :ref:`error-methods`

Patterns
========

Some common design patterns.