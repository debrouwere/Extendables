=====================================
Common design patterns in Extendables
=====================================

getter/setters
==============

domain-specific language constructs
===================================

* esp. in the UI interface
* make code read more like plain English, at the expense of having function names that are, perhaps, in themselves not always very descriptive (e.g. ``obj.is`` in itself might not make a lot of sense, even though it's pretty obvious what ``obj.is(Array)`` does.)

extending prototypes
====================

* people should make sure not to override these methods