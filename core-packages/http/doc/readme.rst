=============================================
``http``: sending and receiving http requests
=============================================

The ``http`` library is a higher-level wrapper over the low-level ``Socket`` object. While ``Socket`` makes it *possible* to connect to the internet, ``http`` makes it *easy*.

.. code-block:: extendscript
    
    #include "extendables/extendables.jsx";
    var http = require("http");
    var response = new http.HttpRequest("http://example.com")
    if (response.status_code == 200) {
        $.writeln(response.body);
    } else {
        $.writeln("Connection failed");
    }
    
The ``Socket`` object is available in Adobe **Bridge**, Adobe **InDesign**, Adobe **InCopy**, Adobe **After Effects** and Adobe **Photoshop**. No luck for Illustrator fiends.