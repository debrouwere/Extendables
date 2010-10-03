/*
 * Basic file-based logging, loosely modelled after the logging module in the Python standard library
 * (alert-based debugging still a work in progress)
 */

// todo: should be part of the Log object!
// setting defaults
if (!logging) { 
	var logging = {
		display_level: 3,
		log_level    : 4
	}
}

var SEVERITY = ["NOTSET", "CRITICAL", "ERROR", "WARNING", "INFO", "DEBUG"];

/*
 * Log object constructor
 * this is how other programs interface with the logging app
 */

exports.Log = function (app) {
	var self = this;
	this.app = app;

	// logfile
	this.create = function () {
		this.logfile = new File(this.filename);
	}
	this.reset = function () {
		var logfile = new File(this.filename);
		// reset the logfile if it gets bigger than half a megabyte
		if (logfile.length > 1024*512) {
			logfile.length = 0;
		}
	}
	this.writeln = function (severity, message) {
		var log = self.logfile;		
		var msg = self.logmsg(severity, message);
		log.open("e");
		log.seek(log.length);	
		log.writeln(msg);
		log.close();		
	}
	// views (todo: perhaps replace by .toString()?)
	this.logmsg = function (severity, message) {
		var now  = new Date().toLocaleString();	
		var msg = sprintf("{} :: {}\t{}", now, SEVERITY[severity], message);
		return msg;
	}
	this.debug_dialog = function (severity, orig_msg, message) {
		// alerts for levels 4-5
	}
	this.user_dialog = function (severity, message) {
		// alerts for level 1-3
		if (severity > 1) {
			new Warning(message);
		} else {
			alert(message);
		}
	}

	// todo: extract this into a subclass, or, heck, remove it alltogether?
	this.alert = function (severity, orig_msg, message) {
		// will reintroduce this from log_old(), 
		// but let's just stick with filebased logging for now
		if (severity > 3) {
			return this.debug_dialog(severity, orig_msg, message);
		} else {
			return this.user_dialog(severity, message);
		}
	}
	// basic logger
	this.log = function () {
		var arguments = arguments.to('array');
		var severity  = arguments.shift();
		var orig_msg  = arguments[0];
		var message   = sprintf.apply(null, arguments);
		// only log what's equal to or below the configured logging treshold
		if (severity <= logging.log_level) {
			self.writeln(severity, message);
		}
		if (severity <= logging.display_level) {
			self.alert(severity, orig_msg, message);
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
	var basefolder = new File($.fileName).parent.parent;
	this.filename  = sprintf("{}/logs/{}.log", basefolder, this.app);
	this.reset();
	this.create();
}