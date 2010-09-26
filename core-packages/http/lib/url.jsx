/*
 * Inspired by some code written by Kris Coppieters.
 * 
 * TODO: may change this around to something more full-featured, 
 * based on e.g. the jQuery.url plugin.
 */

// how about we just use the excellent http://github.com/ry/node/blob/master/lib/url.js?
// That way, we're using MIT-licensed code instead of undefined code from Kris

exports.URL = function (url) {
	var url = url.replace(/([a-z]*):\/\/([-\._a-z0-9A-Z]*)(:[0-9]*)?\/?(.*)/,"$1/$2/$3/$4");
	url = url.split("/");
	  
	this.protocol = url[0].toUpperCase();
	this.address = url[1];
	this.port = url[2];
	this.path = "";

	url = url.slice(3);
	this.path = url.join("/");
	  
	if (this.port.charAt(0) == ':') {
		this.port = this.port.slice(1);
	}
	  
	if (this.port != "") {
		this.port = parseInt(this.port);
	}
	  
	if (this.port == "" || this.port < 0 || this.port > 65535) {
		this.port = 80;
	}
};