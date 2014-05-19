var port = process.env.PORT || 8080;
var express = require('express');
//Express extras
var bodyParser = require('body-parser');
var http = require('http');
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
}
mongoose.connect('mongodb://localhost/securipi',MongooseOptions);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  //var gfs = Grid(conn.db, mongoose.mongo);
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
app.use(session({ secret: 'keyboard cat' }));
//Not sure!
//app.use(app.router);

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


var picSchema = new Schema({
    title: { type: String, default: 'Title' },
    pic: String,
    ts: { type: Date, default: Date.now },
    seen: { type: Boolean, default: false },
    starred: { type: Boolean, default: false }
});

var Image = mongoose.model('Image', picSchema);

//Passport config options
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());


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

//Account.register(new Account({ username : 'ros' }), 'test', function(err, account) {console.log(err);});



// Routes
//Login
app.post('/login',
  passport.authenticate('local', { successRedirect: '/dashboard',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);
app.get('/login', function(req, res) {
    console.log("GET login")
    res.render('login', {
    title: 'Login'
});
});



app.get('/', function(req, res) {
    console.log("incomming get")
    var time = new Date();
    res.send('Welcome to the server!');
});

app.get('/dashboard', function(req, res) {
    console.log("GET dash")
    res.send('Dash');
});

app.get('/dashboard/images', function(req, res) {
    console.log("GET images")
    res.render('images', {
    title: 'Images'
});
});

app.get('/api/images', function(req, res) {
    //Person.findOne({ 'name.last': 'Ghost' }, 'name occupation', function (err, person) {
    //.lean().exec
    console.log("GET images api")
    Image.find({}, function (err, images) {
        if (err) return handleError(err);
        res.send(JSON.stringify(images));
  });
});

//Test
//curl -d '{"title":"title1","data":"asas"}' -H 'content-type:application/json' "http://localhost:8080/images"
app.post('/api/images', function(req, res) {
    console.log("incomming post")
    var title = req.body.title;
    var data = req.body.data;
    console.log("Saving")
    var pic = new Image({title: title, pic: data});
    pic.save();
    res.send("saved in DB OK");
});


app.listen(port,"192.168.0.12", function(){
    console.log('Express server listening on port ' + port);
});
