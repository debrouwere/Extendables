.. _get-started:

================================
Getting started with Extendables
================================

..
   why a framework comes in handy; mention the low barrier to entry: it's free, it's easy, don't use what you don't need

Download
========

You can download the latest version of Extendables at http://github.com/stdbrouw/extendables/zipball/master

First steps
===========

.. include:: jsdoc/_global_.rst
   :start-after: class-title

... now let's see whether that worked.

* loading a package (e.g. http) and the concept of namespaces
* doing things with objects (e.g. reject, is, to, indexAfter)
* manipulating stuff in InDesign (current, dom object shortcuts)
* wrap things up with a basic interface (ui + menu)

Learn more: 

* javascript
    * functional methods
    * conversions, serializations, object types and checks
* InDesign: see ``dom`` docs
* ScriptUI: see ``ui`` docs
* Best practices
    * OO in javascript
    * Error handling
    * Testing
* About this project

Installing a new Extendables module
===================================

Extendables comes with a bunch of built-in modules, but you can also `write your own <writing-a-module>`_ and install modules other people have contributed. Contributed modules are installed by simply downloading them and  putting them inside of ``extendables/site-packages``.

.. note::

    Because Extendables is so new, there are currently no contributed modules the author is aware of. However, even if you're not planning on open-sourcing any of your own work, it still makes sense to put code that you plan to reuse in different projects into its own module. Code in a module gets its own namespace and the package layout makes it easy to include documentation and unit tests alongside your code. Modules make it easy to keep track of library code and they keep a project directory from getting cluttered with files full of helper functions.

Issues
======

Any issues or feature requests should be posted on `our GitHub page <http://github.com/stdbrouw/extendables/issues>`_. You can also reach the maintainer at stijn@stdout.be.