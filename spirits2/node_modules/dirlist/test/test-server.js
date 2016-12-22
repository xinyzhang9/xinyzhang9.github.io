var connect = require('connect'),
	listdir = require('../index');


var base = '/Users/lemendo/Music/';

var host = "localhost";
var port = 1337;

connect(
		connect.favicon(),
		listdir(base),
		connect.static(base)
	).listen(port, host);

console.log('Server running at http://'+host+':'+port+'/');