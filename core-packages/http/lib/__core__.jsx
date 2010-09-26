/*
 * A very basic and incomplete implementation of the hypertext transfer protocol.
 */

// todo: take inspiration from 
// - http://github.com/billywhizz/node-httpclient/blob/master/lib/httpclient.js
// - http://nodejs.org/api.html
// - Python's urllib and urllib2


/*
 * Class definitions
 */

exports.URL = require('http/url').URL;

/**
 * @namespace http_url
 * @name assoc2str
 * @description I dunno, really
 */
function assoc2str (obj) {
	var str = "";
	for (i in obj) {
		if (typeof(obj[i]) == "string" || typeof(obj[i]) == "number") {
			str += i + ": " + obj[i] + "\n";
		}
	}
	return str;
}

exports.HttpResponse = function (raw_response) {
	var end_of_headers = raw_response.indexOf("\n\n")+2;	
	
	this.raw    = raw_response;
	this.status = raw_response.substr(9,3);
	this.body   = raw_response.substr(end_of_headers);
}

// req .get .post(data) .put(data) .del is probably better
// req (get|post|put|del).headers([hash]) getter/setter
// req .header(name[, val]) getter/setter

exports.HttpRequest = function (url, data) {
	// utility methods
	// data.serialize('key-value', {'separator': '=', 'eol': '&'}).slice(0, -1);
	this.urlencode = function (data) {
		var out = new Array();
		for (attr in data) {
			out.push(attr + "=" + data[attr]);
		}
		return out.join("&");		
	}

	// public method
	this.execute = function () {
		var socket = new Socket();
		if (socket.open(this.url.address + ":" + this.url.port)) {
			socket.write(this.request);
			var response = socket.read();
			socket.close();
			return new HttpResponse(response);
		} else {
			log.error("Couldn't open socket");
			return false;
		}
	}

	// init
	this.url = new URL(url);
	var header_parts = {
		"Host": this.url.address,
		"User-Agent": "InDesign ExtendScript",
		"Accept": "*/*"
	}

	if (data) {
		var method = "POST";
		data = this.urlencode(data);
		header_parts["Content-Type"] = "application/x-www-form-urlencoded";
		header_parts["Content-Length"] = data.length;
	} else {
		var method = "GET";
		var data = "";
	}	

	var request_line = sprintf("{} /{} HTTP/1.1\n", method, this.url.path);
	this.request = request_line + assoc2str(header_parts) + "\n" + data;
	log.info("HTTP request: {}", request_line);
}