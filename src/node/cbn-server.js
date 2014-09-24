var express = require('express');
var bodyParser = require('body-parser');
var bunyan = require('bunyan');
var cluster = require('cluster');
var connectDomain = require('connect-domain');
var fs = require('fs');
var path = require('path');

var cookieParser = require('cookie-parser');
var passport = require('passport');
var StormpathStrategy = require('passport-stormpath');
var stormpath = require('stormpath');
var session = require('express-session');
var flash = require('connect-flash');
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');

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
app.use(bodyParser.json());
var strategy = new StormpathStrategy();
passport.use(strategy);
passport.serializeUser(strategy.serializeUser);
passport.deserializeUser(strategy.deserializeUser);
app.use(cookieParser());
app.use(session({
  secret: process.env.EXPRESS_SECRET,
  key: 'sid',
  cookie: {secure: false},
  saveUninitialized: true,
  resave: true
}));
app.use('/api', expressJwt({secret: process.env.EXPRESS_SECRET}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
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
        if(req.query.name == 'login') {
            res.render('login', {error:req.flash('error')[0]});
        }
    })
    .get('/customer/:id', function(req, res) {
        var userInfo = {
            name:"sudheer",
            email:"sudheer.624@gmail.com",
            mobile:"2134009724"
        };
        res.send(userInfo);
    })
    .post('/customer', function(req, res) {
        console.log(req.body);
        var username = req.body.username;
        var password = req.body.password;

        // Grab user fields.
        if (!username || !password) {
            return res.send({title: 'Register', error: 'Email and password required.'});
        }

        // Initialize our Stormpath client.
        var apiKey = new stormpath.ApiKey(
            process.env['STORMPATH_API_KEY_ID'],
            process.env['STORMPATH_API_KEY_SECRET']
        );
        var spClient = new stormpath.Client({ apiKey: apiKey });

        // Grab our app, then attempt to create this user's account.
        var app = spClient.getApplication(process.env['STORMPATH_APP_HREF'], function(err, app) {
            if (err) throw err;
            app.createAccount({
                givenName: 'John',
                surname: 'Smith',
                username: username,
                email: username,
                password: password,
            }, function (err, createdAccount) {
                if (err) {
                    return res.send({title: 'Register', error: err.userMessage});
                } else {
                    passport.authenticate('stormpath')(req, res, function () {
                        log.info("created user account");
                        return res.send({response:"success"});
                    });
                }
            });
        });
    })
    .post('/login', passport.authenticate('stormpath'), function(req, res) {
        if(req.user) {
            log.info("successfully authenticated the user : ", req.user);
            req.login(req.user, function(err) {
                if(err) {
                    log.info("couldn't login the user : ", err);
                } else {
                    var profile = {
                        first_name: 'John',
                        last_name: 'Doe',
                        email: 'john@doe.com',
                        id: 123
                    };

                    // We are sending the profile inside the token
                    var token = jwt.sign(profile, process.env.EXPRESS_SECRET, { expiresInMinutes: 60*5 });
                    res.send({token:token, username:'Sudheer'});
                }
            });
        } else {
            res.send({response:"failure"});
        }
    })
    .use(function(err, req, res, next) {
        log.error("Got error : ", err);
        console.log(err.message);
        res.send("Got an unexpected error in server");
    });

