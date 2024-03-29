var port = process.env.PORT || 8080;
var express = require('express');
//Express extras
var bodyParser = require('body-parser');
var multiparty = require('multiparty')
  , http = require('http')
  , util = require('util')

var cookieParser = require('cookie-parser');
var session = require('express-session');



//Passport
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

//MogoDB and templating
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var Schema = mongoose.Schema;
var swig = require('swig');

//Connect to mongo
var MongooseOptions = {
  //user: 'ros',
  //pass: 'blaz1ng',
  //auth:{authdb:"admin"}
};
mongoose.connect('mongodb://localhost/securipi',MongooseOptions);
var db = mongoose.connection;
var gfs = new Grid(db.db, mongoose.mongo);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {

  console.log('DB up!');// yay!
});

//express app Config
var app = express();
// Serve up content from public directory
app.use('/public',express.static(__dirname + '/public'));
//Config
app.use(bodyParser({limit: '50mb'}));
//app.use(json());       // to support JSON-encoded bodies
//app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(cookieParser());
//used by passport
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 600000 }}));
//Not sure!
//app.use(app.router);
//app.use(connect.multipart({ uploadDir: path }));


//Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Templating with swig
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
// Swig will cache templates for you, but you can disable
// that and use Express's caching instead, if you like:
app.set('view cache', false);


var server = http.createServer(app);




//Passport config options
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());
//Register the default account
//Account.register(new Account({ username : 'ros' }), 'test', function(err, account) {console.log(err);});

/*
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

//Passport functions
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
//Saved in session cookie to identify user
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
*/

require('./routes/routes.js')(app, passport, multiparty, gfs);




app.listen(port,"0.0.0.0", function(){
    console.log('Express server listening on port ' + port);
});
