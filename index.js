var express 	= require('express');
var nocache 	= require('nocache');
var shortid 	= require('shortid');
var chalk 		= require('chalk');
var fs 			= require('fs');
var pack 		= require('./package.json');


require('dotenv').load();
var port 		= process.env.PORT 	|| 8081;
var file 		= process.env.FILE 	|| 'data.json';

var store = fs.readFileSync(file);
store = (store == "") ? {} : JSON.parse( store );

var app = express();

app.use(nocache({ noEtag: true }));

app.use(function(req, res, next){

	// ignore favicon
	if (req.path === '/favicon.ico') {
		res.writeHead(200, {'Content-Type': 'image/x-icon'} );
		res.end();
		return;
	}

	// log access to console
	console.log( chalk.green(req.method) +' '+ req.url );
	next();
});

// rewrite
// $ curl localhost:8081/NycXQcx1x
app.get('/:key', function(req, res){
	var key = req.params.key || 'NA';
	if( Object.keys(store).indexOf(key) > -1 ){
		store[key].count++;
		console.log( store );
		//todo: rewrite
		console.log("redirect ["+ store[key].count +"]", store[key].url);
		res.redirect( store[key].url );
	}else{
		res.send( JSON.stringify({status:"error", code:-1, message:"No match"}) );
	}
});

// create entry
// $ curl -X PUT localhost:8081/https://base.dk
app.put('*', function(req, res){
	url = req.originalUrl;
	if( url.slice(0,5) == '/http') url = url.slice(1);

	console.log("PUT url:", url );
	if( url != ''){
		var code = shortid.generate();
		store[code] = {url:url, count:0};
		fs.writeFileSync(file, JSON.stringify(store, null, "  "));
		console.log( store );
		var dest = req.protocol + '://' + req.get('host') +'/'+ code;
		res.send( JSON.stringify({status:"ok", code:code, url:dest}) );
	}else{
		res.send( JSON.stringify({status:"error", code:-2, message:"Provide target url as first url param"}) );
	}
});


var server = app.listen( port );
console.log("Running '"+ pack.name +"' v."+ pack.version +' on port '+ port );