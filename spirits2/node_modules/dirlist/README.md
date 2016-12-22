#DirList


### A simple & old school directory listing module for node. Inspired by Apache's mod_autoindex.

## Installation

	npm install dirlist

## Usage

Use dirlist in your `connect` or `express` application by passing it the root folder you would like it to auto index.

	var connect = require('connect'),
		dirlist = require('dirlist');

	//Base folder that will be searchable from the url.
	var base = '/Users/lemendo/Music/';

	var host = "localhost";
	var port = 1337;

	connect(
			connect.favicon(),
			dirlist(base),
			connect.static(base)
		).listen(port, host);

	console.log('Server running at http://'+host+':'+port+'/');

To enable file download, you must also set a `static` middleware with the same path as the dirlist middleware.