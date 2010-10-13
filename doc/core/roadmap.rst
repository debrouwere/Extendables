=========
A roadmap
=========

Extendables is strictly scratch-your-own-itch material, so there's no strict roadmap, but here are a couple of things under consideration for future releases.

* a persistence module that would make it easy to persist objects either in an external database (using a REST interface) or locally in a serialized file.
* a ``patches/extendscript.file.jsx`` file that adapts code from the ``path`` module into a friendlier object-oriented notation on the ``File`` and ``Folder`` objects themselves, deprecating the ``path`` module in the process.
* improvements to the UI library, making it possible to apply a wider range of stylings than is currently possible.
* a preview module, providing an easy way for scripts to show a preview of the action they're about to undertake, without actually executing it (permanently). Similar to how the ``preview`` button works in many native Adobe dialogs.
* more consistent error handling across the framework (proper error types, limited try/catches, throwing errors instead of returning false or simply crashing, exception logging)