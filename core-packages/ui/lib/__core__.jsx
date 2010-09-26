function EventManager (control, type) {
	this.control = control;
	this.type = type;
	this.do = function (fn) {
		this.control.addEventListener(type, fn);
		return this;
	}
}

function ControlMixins () {
	this.on = function (event) {
		// todo: work with arguments (react to multiple event types)
		// instead of expecting a single argument
		return new EventManager(this, event);
	}

	this.mix_with = function (mixin) {
		for (property in mixin) {
			if (property == 'styles') {
				this.style(mixin[property]);
			} else {
				this[property] = mixin[property];
			}
		}	
	}
}

/**
 * @constructor
 * @desc These shortcuts allow you to quickly add control elements and groups to a user interface.
 * They're available on ``Dialog`` and ``Palette`` instances. Don't instantiate this class directly.
 */

function UIShortcuts () {
	// todo: the 'group' shortcuts need some work, obviously
	
	/** @desc adds a group, displayed as a row */
	this.row = function (name) {
		return this.add_group(name);		
	}
	/** @desc adds a group, displayed as a column */
	this.column = function (name) {
		return this.add_group(name);			
	}
	/** @desc adds a group, displayed as a stack */
	this.stack = function (name) {
		return this.add_group(name);		
	}	

	/** @desc adds a button */
	this.button = function (name, text) {
		return this.add_control(name, 'button', text);
	}
	/** @desc adds a checkbox */
	this.checkbox = function (name, text) {
		return this.add_control(name, 'checkbox', text);		
	}
	/** @desc adds a dropdown, equivalent to ``dropdownlist`` in plain ScriptUI */
	this.dropdown = function (name, text) {
		return this.add_control(name, 'dropdownlist', text);	
	}
	/** @desc adds an input field, equivalent to ``edittext`` in plain ScriptUI */
	this.input = function (name, text) {
		return this.add_control(name, 'edittext', text);	
	}
	/** @desc adds a flash element, equivalent to ``flashplayer`` in plain ScriptUI */
	this.flash = function (name, text) {
		return this.add_control(name, 'flashplayer', text);		
	}
	/** @desc adds an icon button, equivalent to ``iconbutton`` in plain ScriptUI */
	this.icon = function (name, text) {
		return this.add_control(name, 'iconbutton', text);		
	}
	/** @desc adds an image */
	this.image = function (name, text) {
		return this.add_control(name, 'image', text);		
	}
	/** @desc adds an item (part of a list) */
	this.item = function (name, text) {
		return this.add_control(name, 'item', text);		
	}
	/** @desc adds a list, equivalent to ``listbox`` in plain ScriptUI */
	this.list = function (name, text) {
		return this.add_control(name, 'listbox', text);		
	}
	/** @desc adds a panel */
	this.panel = function (name, text) {
		return this.add_control(name, 'panel', text);		
	}
	/** @desc adds a progress bar */
	this.progressbar = function (name, text) {
		return this.add_control(name, 'progressbar', text);		
	}
	/** @desc adds a radio button, equivalent to ``radiobutton`` in plain ScriptUI */
	this.radio = function (name, text) {
		return this.add_control(name, 'radiobutton', text);		
	}
	/** @desc adds a scrollbar */
	this.scrollbar = function (name, text) {
		return this.add_control(name, 'scrollbar', text);		
	}
	/** @desc adds a slider */
	this.slider = function (name, text) {
		return this.add_control(name, 'slider', text);		
	}
	/** @desc adds a text element, equivalent to ``statictext`` in plain ScriptUI */
	this.text = function (name, text) {
		return this.add_control(name, 'statictext', text);		
	}
	/** @desc adds a tab (part of a tabs control) */
	this.tab = function (name, text) {
		return this.add_control(name, 'tab', text);		
	}
	/** @desc adds a tabs container, equivalent to ``tabbedpanel`` in plain ScriptUI */
	this.tabs = function (name, text) {
		return this.add_control(name, 'tabbedpanel', text);		
	}
	/** @desc adds a tree, equivalent to ``treeview`` in plain ScriptUI */
	this.tree = function (name, text) {
		return this.add_control(name, 'treeview', text);		
	}	
}

/**
 * @constructor
 * @desc This is the base class from which ``Dialog`` and ``Palette`` inherit.
 * Don't instantiate this class directly.
 */

function UI () {
	var self = this;
	
	// this variable is continually updated to reflect the last added layout element
	this._last_added = this;
	
	/**
	 * @desc To make ``UI`` methods chainable, they return the entire
	 * ``UI`` object instead of any control element you may have just created;
	 * ``obj.el()`` gives you easy access to the last added element.
	 *
	 * @example
	 *     var dialog = new ui.Dialog("Hello");
	 *     dialog.button('ok', 'Click here').el().size = [400, 200];
	 */
	this.el = function () {
		return this._last_added;
	}
	
	/**
	 * @desc Add mixins -- mixins are like style sheets for Extendables UIs.
	 *
	 * @param {Object} mixins See elsewhere to know what a mixin object should look like.
	 */
	this.with = function (mixins) {
		this.mixins = mixins;
		return this;
	}

	/**
	 * @desc apply a mixin to an element
	 */
	this.using = function () {
		// arguments may be passed either as variable arguments or as an array
		var mixin_names = arguments.to('array').flatten();
		
		mixin_names.forEach(function(mixin_name) {
			var mixin = this.mixins[mixin_name];
			
			if (mixin.is(Array)) {
				// is a list of other mixins
				self.using(mixin);
			} else {
				// is a proper mixin
				self._last_added.mix_with(mixin);
			}
		});
		return this;
	}
	
	this.add_control = function (name, type, text) {
		// people can add controls to this object willy-nilly, 
		// so we check whether they're not overriding any existing
		// methods, attributes or controls.		
		if (this[name] == undefined) {
			var control = this.window.add(type, undefined, text);
			control.merge(new ControlMixins());
			this[name] = control;
			self._last_added = control;
			return this;
		} else {		
			throw new Error("{} is a reserved name.");
		}
	}

	this.add_group = function (name) {
		var ui = new UI();
		ui.window = this.add_control(name, 'group').el();
		ui._last_added = ui.window;
		this[name] = ui;
		return ui;		
	}
}
UI.prototype = new UIShortcuts();

exports.Dialog = function (title) {
	this.window = new Window('dialog', title);	
}
exports.Dialog.prototype = new UI();

exports.Palette = function (title) {
	this.window = new Window('palette', title);	
}
exports.Palette.prototype = new UI();