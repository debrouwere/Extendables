/*
 * Basic file-based logging, loosely modelled after the logging module in the Python standard library
 * (alert-based debugging still a work in progress)
 */

var path = require("path");
 
exports.Log = Log;

// todo: should be part of the Log object!
// setting defaults
if (!logging) { 
	var logging = {
		display_level: 3,
		log_level    : 4
	}
}

var SEVERITY = ["NOTSET", "CRITICAL", "ERROR", "WARNING", "INFO", "DEBUG"];
 
var LogMessage = function (severity, message) {
    this.date = new Date().toLocaleString();
    this.severity = severity;
    this.message = message;
    
    this.toString = function () {
        return "{} :: {}\t{}".format(now, SEVERITY[severity], message);
    }
}

/**
 * @class
 * @desc this is how other programs interface with the logging app
 */

var Log = function (name) {
	var self = this;
	this.name = name;

	// logfile
	this.create = function () {
		this.logfile = new File(this.filename);
	}
	
	this.truncate = function () {
		var logfile = new File(this.filename);
		// truncate the logfile if it gets bigger than half a megabyte
		if (logfile.length > 1024*512) {
			logfile.length = 0;
		}
	}
	
	this.writeln = function (severity, message) {
		var log = self.logfile;		
		var logmessage = new LogMessage(severity, message)
		log.open("e");
		log.seek(log.length);	
		log.writeln(logmessage);
		log.close();		
	}

	// basic logger
	this.log = function () {
		var arguments = arguments.to('array');
		var severity  = arguments.shift();
		var template = arguments.shift();
		var message = template.format.apply(template, arguments);
		// only log what's equal to or below the configured logging treshold
		if (severity <= logging.log_level) {
			self.writeln(severity, message);
		}
	}

	// convenience functions
	this.debug = function () {
		arguments = [5].concat(arguments.to('array'));
		self.log.apply(null, arguments);
	}
	this.info = function () {
		arguments = [4].concat(arguments.to('array'));
		self.log.apply(null, arguments);		
	}
	this.warning = function () {		
		arguments = [3].concat(arguments.to('array'));
		self.log.apply(null, arguments);		
	}
	this.error = function () {		
		arguments = [2].concat(arguments.to('array'));
		self.log.apply(null, arguments);		
	}
	this.critical = function () {			
		arguments = [1].concat(arguments.to('array'));
		self.log.apply(null, arguments);	
	}

	// init
	var logfolder = new File($.fileName).parent.parent.parent.parent;
	logfolder.changePath("./log")
	this.filename  = path.join(logfolder, this.name);
	this.truncate();
	this.create();
}