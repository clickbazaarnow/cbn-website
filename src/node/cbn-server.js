var express = require('express');
var bodyParser = require('body-parser');
var bunyan = require('bunyan');
var cluster = require('cluster');
var connectDomain = require('connect-domain');
var fs = require('fs');
var path = require('path');

//User Authentication
var passport = require('passport');
var flash = require('connect-flash');
var StormpathStrategy = require('passport-stormpath');
var session = require('express-session');
var strategy = new StormpathStrategy();
passport.use(strategy);
passport.serializeUser(strategy.serializeUser);
passport.deserializeUser(strategy.deserializeUser);

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
app.use('/api', expressJwt({secret: process.env.EXPRESS_SECRET}));
app.use(session({
  secret: process.env.EXPRESS_SECRET,
  key: 'sid',
  cookie: {secure: false},
  saveUninitialized: true,
  resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Business Objects
var AccountManager = require("./account-manager");
var accountManager = new AccountManager(process.env['STORMPATH_API_KEY_ID'], process.env['STORMPATH_API_KEY_SECRET'], process.env['STORMPATH_APP_HREF'], log);

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
        accountManager.createAccount(username, password, 'Lucy', 'Ramoji', function(err, data) {
            if(err) {
                return res.send({title: 'Register', error: err.userMessage});
            } else {
                return res.send({isAccountCreated:data.isAccountCreated});
            }
        });
    })
    .post('/login', passport.authenticate('stormpath'), function(req, res) {
        if(req.user) {
            log.info("successfully authenticated the user: ", req.user);
            req.login(req.user, function(err) {
                if(err) {
                    log.info("couldn't login the user : ", err);
                } else {
                    var profile = {
                        first_name: 'Lucy',
                        last_name: 'Hemchand',
                        email: 'lucy@lucy.com',
                        id: 123
                    };

                    // We are sending the profile inside the token
                    var token = jwt.sign(profile, process.env.EXPRESS_SECRET, { expiresInMinutes: 60*5 });
                    res.send({token:token, username:'Lucy', isAuthenticated:true});
                }
            });
        } else {
            res.send({isAuthenticated:false});
        }
    })
    .use(function(err, req, res, next) {
        log.error("Got error : ", err);
        console.log(err.message);
        res.send("Got an unexpected error in server");
    });

