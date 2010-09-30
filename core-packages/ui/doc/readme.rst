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
    	'centered': {
    		'size': [180, 50],
    		'justify': 'center'
    	},
    	'square': {
    		'size': [200, 120]
    	},
    	'help': {
    		'helpTip': 'clickerdy click',
    	},
    	'button': ['centered', 'help']
    };
    
    /* structure */
    var dialog = new ui.Dialog('A friendly welcome').with(mixins);
    dialog.column('stuff').using('square').text('welcome', 'hello there').using('centered').button('confirm', 'OK!').using('button');

    
    /* event handlers */   
    dialog.stuff.confirm.on('click').do(function () {
    	this.window.close();
    });
    
    dialog.window.show();

And visually: 

.. image:: layout.png

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

Adding event listeners
----------------------

Add an event listener with: 

.. code-block:: extendscript

    // add an event, Extendables-style
    dialog.stuff.confirm.on(event_type).do(handler)

    // but you can still add an event the old way, if you prefer
    dialog.stuff.confirm.addEventListener(event_type, handler)
    
    // here's a practical example
    dialog.stuff.confirm.on('click').do(function () {
        this.window.close();
    })

Avoid adding an event handler through ``control.onClick = handler``; it will push any previous handlers on the control.

As a quick reminder: control elements are accessible through the first argument specified on their construction. The button in ``dialog.row('a_row').button('a_button', 'Click here);`` is accessed through ``dialog.a_row.a_button``.

.. seealso::

   You'll find a reference of all event types (click, mouseover etc.) at :ref:`ui-reference`

Why use this instead of a GUI designer?
=======================================

Software like Steven Bryant's `Rapid ScriptUI <http://scriptui.com/>`_ or the `ScriptUI Interface Builder <http://www.scriptuibuilder.com/>`_ gives you a nice graphical interface in which you can build ScriptUI user interfaces. If a graphical approach is what you prefer, by all means, stick with it. However:

1. When you need to make a UI programmatically, these tools won't help.
2. These tools fix a symptom (ScriptUI coding is very verbose and sometimes tough), this one fixes the problem.