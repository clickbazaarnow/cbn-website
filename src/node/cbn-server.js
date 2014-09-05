var express = require('express');
var bunyan = require('bunyan');
var cluster = require('cluster');
var connectDomain = require('connect-domain');
var fs = require('fs');
var path = require('path');

var NUM_WORKERS = 1;
var ROOT_DIR = "build";

var app = express();
var log = bunyan.createLogger({
    name: 'cbn',
    streams: [{
        type: 'rotating-file',
        path: path.join(ROOT_DIR, 'output/logs/cbn.log'),
        period: '1d',   // daily rotation
		level: bunyan.DEBUG
    }]
});
log.on('error', function (err, stream) {
    console.log("Got error from logger : " + err);
});

if (cluster.isMaster) {
	// Fork workers.
	for (var i = 0; i < NUM_WORKERS; i++) {
		cluster.fork();
  	}

	cluster.on('exit', function(worker, code, signal) {
    	log.error('worker ' + worker.process.pid + ' died');
  	});
} else {
	app.listen(3000);
}

app.set('views', path.join(ROOT_DIR, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(ROOT_DIR, 'public')));
app.use(connectDomain())
	.get('/', function(req, res){
		res.render('layout', {});
	})
	.get('/render', function(req, res) {
		if(req.query.name === "registration") {
			res.render('customer-registration', {mode:req.query.mode});
		}
		if(req.query.name === 'main') {
			res.render('main', {});
		}
	})
	.get('/user/:id', function(req, res) {
		var userInfo = {
			name:"sudheer",
			email:"sudheer.624@gmail.com",
			mobile:"2134009724"
		};
		res.send(userInfo);
	})
	.use(function(err, req, res, next) {
		log.error("Got error : " + err.message);
		res.send("Got an unexpected error in server");
	});

