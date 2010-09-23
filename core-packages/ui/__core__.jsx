/*
Events: normaliter doe je ofwel control.addEventListener('click', ...) ofwel 
control.onClick = function () {} -- Het eerste is nogal verbose en het tweede
duwt andere event listeners weg. Ik zou het mezelf niet te moeilijk maken, 
gewoon control.listen() als shortcut voor addEventListener, en control.click()
omdat dat zo courant wordt gebruikt. Of control.on('click').do(function() {})
en control.on('click').clear() om het een beetje meer DSL-ish te maken.
*/

// merk hier een interessant gedrag op: je hoeft interne stuff niet te exporten, en ES zal toch
// de references ernaar vinden (dus exports.EventManager is niet nodig bv.)

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

function UIShortcuts () {
	// the 'group' shortcuts need some work, obviously
	this.row = function (name) {
		return this.add_group(name);		
	}
	this.column = function (name) {
		return this.add_group(name);			
	}
	this.stack = function (name) {
		return this.add_group(name);		
	}	
	
	this.button = function (name, text) {
		return this.add_control(name, 'button', text);
	}
	this.checkbox = function (name, text) {
		return this.add_control(name, 'checkbox', text);		
	}
	this.dropdown = function (name, text) {
		return this.add_control(name, 'dropdownlist', text);	
	}
	this.input = function (name, text) {
		return this.add_control(name, 'edittext', text);	
	}
	this.flash = function (name, text) {
		return this.add_control(name, 'flashplayer', text);		
	}
	this.icon = function (name, text) {
		return this.add_control(name, 'iconbutton', text);		
	}
	this.image = function (name, text) {
		return this.add_control(name, 'image', text);		
	}
	this.item = function (name, text) {
		return this.add_control(name, 'item', text);		
	}
	this.list = function (name, text) {
		return this.add_control(name, 'listbox', text);		
	}
	this.panel = function (name, text) {
		return this.add_control(name, 'panel', text);		
	}
	this.progressbar = function (name, text) {
		return this.add_control(name, 'progressbar', text);		
	}
	this.radio = function (name, text) {
		return this.add_control(name, 'radiobutton', text);		
	}
	this.scrollbar = function (name, text) {
		return this.add_control(name, 'scrollbar', text);		
	}
	this.slider = function (name, text) {
		return this.add_control(name, 'slider', text);		
	}
	this.text = function (name, text) {
		return this.add_control(name, 'statictext', text);		
	}
	this.tab = function (name, text) {
		return this.add_control(name, 'tab', text);		
	}
	this.tabs = function (name, text) {
		return this.add_control(name, 'tabbedpanel', text);		
	}
	this.tree = function (name, text) {
		return this.add_control(name, 'treeview', text);		
	}	
}

function UI () {
	var self = this;
	
	// this variable is continually updated to reflect the last added layout element
	this._last_added = this;
	
	// to make UI methods chainable, they return the entire
	// UI object instead of the control you've just created;
	// obj.el() gives you easy access to the control as well
	this.el = function () {
		return this._last_added;
	}
	
	// add mixins -- mixins are like style sheets for Extendables UIs.
	this.with = function (mixins) {
		this.mixins = mixins;
		return this;
	}

	// apply a mixin to an element
	this.using = function () {
		// arguments may be passed either as variable arguments or as an array
		var mixin_names = arguments.to('array').flatten();
		
		mixin_names.forEach(function(mixin_name) {
			var mixin = this.mixins[mixin_name];
			
			if (mixin.isInstanceOf(Array)) {
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
			throw new Error("%s is a reserved name.");
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