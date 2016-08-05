/*
  Author : Joao Pinto
   - pinto.joao@outlook.com

  based on the work of phildow from OK CODERS
      -> https://github.com/okcoders
*/


var express = require('express');
var i18n = require('i18n-2');

var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var settings = require('./config/settings')

var colors = require('colors');

var MongoStore = require('connect-mongo')(session);


// suppa cool middleware to provide usefull information to the user
var flash = require('connect-flash');


// Identification with passport middleware + Facebook helper
var passport = require('passport'),
	FacebookStrategy = require('passport-facebook').Strategy;

var User = require('./models/user');


// "template" is my database name
// feel free to change it if you want to use your own database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mons');

// var routes = require('./routes/index')(app);

//views routes
// var secrets = require('./routes/secrets')
// var users = require('./routes/users');

var fbLogin = require('./routes/handleFacebookLogin');




var app = express();



// Attach the i18n property to the express request object
// And attach helper methods for use in templates
i18n.expressBind(app, {
    // setup some locales - other locales default to en silently
    locales: ['en', 'fr', 'nl'],
    // change the cookie name from 'lang' to 'locale'
    cookieName: 'locale'
});




// This is how you'd set a locale from req.cookies.
// Don't forget to set the cookie either on the client or in your Express app.
app.use(function(req, res, next) {

	var langRaw = req.originalUrl.substring(1, 3);

	if(req.lang != langRaw){
		if (langRaw == 'fr' || langRaw == 'nl' || langRaw == 'en') {
			// console.log(colors.inverse('heu nouvelle langue ? ==> ' + langRaw));
			req.lang = langRaw;
		}
	}

    // req.i18n.setLocaleFromCookie();
    req.i18n.setLocale(req.lang);
    next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('settings', settings)


app.use(favicon());
// app.use(logger('dev'));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
// app.use(express.methodOverride());

app.use(cookieParser());

// app.use(session({
// 	secret: 'secret',
// 	resave: true,
// 	saveUninitialized: true,
// 	cookie: {
// 		maxAge: 60000
// 	}
// }));


app.use(session({
	secret: 'OuRCRmS3cr3rrt',
	maxAge: new Date(Date.now() + 3600000),
	store: new MongoStore({
		mongooseConnection: mongoose.connection
	})
}));

/*
    PASSPORT AUTH
    -------------
*/
var jwt = require('jsonwebtoken');
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeader();

opts.secretOrKey = settings.jwtSecret;


passport.use(new JwtStrategy(opts, function(jwt_payload, done) {

	User.findOne({email: jwt_payload}, function(err, user) {
    // User.findOne({id: jwt_payload.sub}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            done(null, user);
        } else {
            done(null, false);
            // or you could create a new account
        }
    });
}));



// flash middleware config
//      + passport isAuth to view.
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
	// console.log('dude: ' + user);
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});


// passport.use(new FacebookStrategy({
// 		clientID: '1604691576425029',
// 		clientSecret: "988d26ec347add1e1c3f18325e1ee853",
// 		// callbackURL: "http://localhost:3000/auth/facebook/callback",
// 		profileFields: [
// 			'id', 'name',
// 			'picture.type(large)', 'emails',
// 			'locale',
// 			// 'user_birthday',
// 			// 'user_location',
// 			// 'user_likes',
// 			// 'user_relationships',
// 			'displayName', 'about', 'gender', 'age_range']
// 	},
// 	fbLogin
// ));


passport.use(new FacebookStrategy({
		clientID: '1706550902959630',
		clientSecret: "9304a067f39836d9a9569bdb791ce759",
		callbackURL: "http://www.smilefocus.org/auth/facebook/callback",
		profileFields: [
			'id', 'name',
			'picture.type(large)', 'emails',
			'locale',
			// 'user_birthday',
			// 'user_location',
			// 'user_likes',
			// 'user_relationships',
			'displayName', 'about', 'gender', 'age_range']
	},
	fbLogin
));



app.use(function(req, res, next) {

	res.locals.message = req.flash();

	//AS WE are already creating this simple Middleware for flash messages
	//We can use this place to get if user is auth (passport.js)
	res.locals.login = req.isAuthenticated();

	//if user is logged
	if (req.isAuthenticated()) {
		res.locals.email = req.user.email;
		res.locals.picture = req.user.picture;
	}

	res.locals.lang = req.lang;
	next();
});



var oneDay = 86400000;

app.use(express.static(__dirname + '/public', { maxAge: oneDay }));
// app.use(express.static(path.join(__dirname, 'public')));


var home = require('./routes/home')(app);
var members = require('./routes/members')(app);
var secrets = require('./routes/secrets')(app);
require('./routes/_api/customers')(app);
require('./routes/_api/products')(app);


app.get('/auth/facebook', function(req, res, next){

		console.log(' !!!!! ');

		var query = req.query.myQuery;

		if(!query)
			query='none'

		console.log(query);
	 passport.authenticate('facebook', {

		callbackURL: "http://www.smilefocus.org/auth/facebook/callback?myQuery="+ query,
		scope: ['email']
	})(req, res, next)
});


app.get('/auth/facebook/callback', function(req, res, next){

	console.log(' !!!!! callback de merde');
	console.log(req.query.myQuery);
	console.log(req.body);
	console.log(req.query);

	console.log(passport.myQuery);

	console.log(passport);

	passport.authenticate('facebook', {
		callbackURL: "http://www.smilefocus.org/auth/facebook/callback?myQuery="+ req.query.myQuery,
		successRedirect: "/"+req.query.myQuery+"/members/loggedfb2?myQuery="+ req.query.myQuery,
		successFlash: true,
		failureRedirect: "/"+req.query.myQuery+"/members/errorfblogin",
		failureFlash: true
	})(req, res, next)
});


/*
    Error Handlers
    --------------
*/

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;
