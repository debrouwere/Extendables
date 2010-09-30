/*
 * An incomplete but "good enough" implementation of the hypertext transfer protocol.
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

var HttpResponse = function (raw_response) {
	this.expected = raw_response.orig_expected;
	var raw_response = raw_response.raw;
	var end_of_headers = raw_response.indexOf("\n\n");	
	
	this.headers = raw_response.substr(0, end_of_headers);
	this.raw    = raw_response;
	this.status = raw_response.substr(9,3);
	this.body   = raw_response.substr(end_of_headers+2);
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
		socket.timeout = 10;
		
		if (socket.open(this.url.address + ":" + this.url.port, "UTF-8")) {
			socket.write(this.request);
			var response = {};
			response.raw = "";
			response.has_headers = false;
			response.expected = null;
			var buffer = "";
			
			while (!socket.eof && socket.connected && (!response.expected || (response.raw.length < response.expected))) {
				//$.hiresTimer;
				buffer = socket.read();
				//$.writeln("received {} chars and {} new ones in {} ms. Error: {}".format(response.raw.length, buffer.length, parseInt($.hiresTimer/1000), socket.error));
				
				// we only need this to close keep-alive connections in a timely fashion.
				if (buffer.length) {
					response.raw += buffer;
				} else {
					response.expected = response.raw.length;	
				}
					

				//$.writeln("Read took " + $.hiresTimer/1000000);
				/*
				if (!response.has_headers && response.raw.indexOf("\n\n") > 0) {
					$.writeln("has headars");
					response.has_headers = true;
					var match = new RegExp(/Content-Length: ([0-9]*)/gi)(response.raw);
					if (match) {
						// rara, -3 voor google.com, -8 voor nl.html, 
						// en zonder UTF8: -1 voor nl.html
						response.expected = match[1].to('int') + response.raw.indexOf("\n\n") + 2;
						$.writeln("suggested length {}".format(match[1].to('int')));
						$.writeln("total suggested length {}".format(response.expected));
						response.orig_expected = response.expected;
						response.expected = 4666;
					}	
				}
				*/
			}
		
			$.writeln("eof: " + socket.eof);
			$.writeln("connected: " + socket.connected);
		
			socket.close();
			return new HttpResponse(response);
		} else {
			alert("sucks");
			//log.error("Couldn't open socket");
			return false;
		}
	}

	// init
	this.url = new exports.URL(url);
	var header_parts = {
		"Host": this.url.address,
		"User-Agent": "InDesign ExtendScript",
		"Accept": "*/*",
		"Connection": "close"
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

	// prefer HTTP 1.0 so we don't have to deal with chunked responses.
	var request_line = "{} /{} HTTP/1.1\n".format(method, this.url.path);
	this.request = request_line + assoc2str(header_parts) + "\n" + data;
	//log.info("HTTP request: {}", request_line);
}


// implementation detail: I originally experimented with using the content-length header to be
// able to close persistent (keep-alive) connections before they were explicitly terminated
// by the sender. While it did provide a speed boost, it 
// - is no faster than just closing and opening a new connection (the Connection: close header)
// - works flawlessly in ASCII encoding, but is tricky to get working in BINARY or UTF-8 mode
// so, in the name of "good enough", this optimization is now left out.