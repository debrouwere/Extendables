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