========================
``ui``: The UI framework
========================

Creating a UI
=============

It's easiest to get acquainted with the UI mini-framework through an example. Here's what a finished interface may look like: 

.. code-block:: extendscript

    #include "extendables/extendables.jsx"
    
    var ui = require("ui");
    
    /* stylings */
    var mixins = {
    	'long': {
    		'size': [400, 200],
    		'indent': 50
    	},
    	'high': {
    		'size': [100, 200]
    	},
    	'help': {
    		'helpTip': 'clickerdy click'
    	},
    	'high_helper': ['help', 'high']
    };
    
    /* structure */
    var dialog = new ui.Dialog('a little testing').with(mixins);
    dialog.row('stuff').using('long').text('welcome', 'hello there').using('high').button('confirm', 'OK!').using('high_helper');
    
    /* event handlers */   
    dialog.stuff.confirm.on('click').do(function () {
    	this.window.close();
    });
    
    dialog.window.show();

And visually: 

.. note:: todo

Every UI consists of three parts: 

1. **a skeleton**: the basic structure and layout of a dialog or palette
2. **stylings**, like applying width and height to elements, or giving them a different color
3. **event handlers** that bring your UI alive

Extendables UI makes it painless to keep these three parts separate, giving your project a `Model-View-Controller <http://en.wikipedia.org/wiki/Model–View–Controller>`_-like vibe.

Let's build this example up from scratch.

Creating an interface
---------------------

.. note:: todo

Adding controls
---------------

.. note:: todo

.. seealso::

   You'll find a reference of all element types (button, dropdown, etc.) and group types (row, column, stack) at :ref:`ui-reference`
   
Adding groups
-------------

* also show how accessing elements through the UI object works

.. note:: todo

Adding element properties and styling
-------------------------------------

.. note:: todo

Adding events
-------------

* quick reminder about how accessing elements through the UI works.

.. note:: todo

..
    Events: normaliter doe je ofwel control.addEventListener('click', ...) ofwel 
    control.onClick = function () {} -- Het eerste is nogal verbose en het tweede
    duwt andere event listeners weg.

Why use this instead of a GUI designer?
=======================================

Software like Steven Bryant's `Rapid ScriptUI <http://scriptui.com/>`_ or the `ScriptUI Interface Builder <http://www.scriptuibuilder.com/>`_ gives you a nice graphical interface in which you can build ScriptUI user interfaces. If a graphical approach is what you prefer, by all means, stick with it. However:

1. When you need to make a UI programmatically, these tools won't help.
2. These tools fix a symptom (ScriptUI coding is very verbose and sometimes tough), this one fixes the problem.