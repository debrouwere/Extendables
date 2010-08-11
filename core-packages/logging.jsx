/*
 * Basic file-based logging, loosely modelled after the logging module in the Python standard library
 * (alert-based debugging still a work in progress)
 */

// setting defaults
if (!logging) { 
	var logging = {
		display_level: 3,
		log_level    : 4
	}
}

var SEVERITY = ["NOTSET", "CRITICAL", "ERROR", "WARNING", "INFO", "DEBUG"];

/*
 * Debug dialog constructor
 * -- not quite ready for prime time & not in use yet --
 */

function DebugMessage () {
	// 'global' variables
	var skip_this_run = false;
	var skip_types    = new Array();
	var previous_msg;	
	
	// dialog elements
	this.window  = new Window('dialog', 'Debug notice');
	this.msg     = this.window.add('statictext', undefined, {multiline: true});
	this.actions = this.msg.add('group');
	
	// buttons
	this.buttons = {
		skip_type: this.actions.add('button', undefined, 'Skip type'),
		skip_run:  this.actions.add('button', undefined, 'Skip run'),
		skip_all:  this.actions.add('button', undefined, 'Skip all'),
		ok:        this.actions.add('button', undefined, 'OK')		
	}
	
	// configuration
	this.msg.preferredSize   = [500, 100];
	this.actions.orientation = "row";
	
	// event handlers
	this.buttons.skip_type.onClick = function() {
		this.skip_types.push(this.msg.text);
		this.parent.parent.close(1);
	}
	this.buttons.skip_run.onClick = function() {
		this.skip_this_run = true;
		this.parent.parent.close(1);
	}
	this.buttons.skip_all.onClick = function() {
		logging.display_level = 0;
		this.parent.parent.close(1);
	}
	this.buttons.ok.onClick = function() {
		this.parent.parent.close(1);
	}	
}

/*
 * Warning dialog constructor
 */

function Warning (message) {
	// dialog elements
	this.window  = new Window('dialog', 'Warning');
	this.msg     = this.window.add('statictext', undefined, message, {multiline: true});
	this.actions = this.window.add('group');
	
	// buttons
	this.buttons = {
		act_now  : this.actions.add('button', undefined, "Stop"),
		act_later: this.actions.add('button', undefined, "Continue")
	}

	// event handlers
	this.buttons.act_now.onClick = function() {
		this.parent.parent.close(1);
		exit();
	}
	this.buttons.act_later.onClick = function() {
		this.parent.parent.close(1);
	}

	// init
	this.window.show();
}

/*
 * Log object constructor
 * this is how other programs interface with the logging app
 */

function Log (app) {
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
	// views
	this.logmsg = function (severity, message) {
		var now  = new Date().toLocaleString();	
		var msg = sprintf("%s :: %s\t%s", now, SEVERITY[severity], message);
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
		var arguments = obj2array(arguments);
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
		arguments = [5].concat(obj2array(arguments));
		self.log.apply(null, arguments);
	}
	this.info = function () {
		arguments = [4].concat(obj2array(arguments));
		self.log.apply(null, arguments);		
	}
	this.warning = function () {		
		arguments = [3].concat(obj2array(arguments));
		self.log.apply(null, arguments);		
	}
	this.error = function () {		
		arguments = [2].concat(obj2array(arguments));
		self.log.apply(null, arguments);		
	}
	this.critical = function () {			
		arguments = [1].concat(obj2array(arguments));
		self.log.apply(null, arguments);	
	}

	// init
	var basefolder = new File($.fileName).parent.parent;
	this.filename  = sprintf("%s/logs/%s.log", basefolder, this.app);
	this.reset();
	this.create();
}