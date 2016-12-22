var fs = require('fs'),
	url =  require('url');

exports = module.exports = function(base){
	
	return function(req, res, next){
		var path = url.parse(req.url).pathname.replace(/%20/g," ");
		
		if(fs.statSync(base+path).isDirectory()){
			var files = fs.readdirSync(base+path);		
			var children = [];	
			for(var i in files){
				var file = files[i];
				children[i] = {};
				var stats = fs.statSync(base+path+file);
				
				if(stats.isFile()){
					children[i].isFile = true;
					children[i].name = file;
					children[i].size = stats.size;
					children[i].lastModified = stats.mtime;
				} else {
					children[i].name = file;
					children[i].lastModified = stats.mtime;
				}
			}

			var dir = {
				name: path,
				children: children
			}

			res.setHeader("Content-Type", "text/html;");
			res.statusCode = 200;
			res.end(fs.readFileSync(__dirname+'/listing.html').toString().replace('!@#$%', JSON.stringify(dir)));
		} else {
			next();
		}
	}
}