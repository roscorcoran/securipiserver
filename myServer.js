var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MongooseOptions = {
  user: 'ros',
  pass: 'blaz1ng',
  auth:{authdb:"admin"}
}

//Connect to mongo
mongoose.connect('mongodb://localhost/securipi',MongooseOptions);

//express app
var app = express();
//Config
app.use(bodyParser({limit: '50mb'}));
//app.use(json());       // to support JSON-encoded bodies
//app.use(express.urlencoded()); // to support URL-encoded bodies

var server = http.createServer(app);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback () {
  console.log('DB up!');// yay!
});

var picSchema = new Schema({
    title: String,
    pic: String,
    ts: { type: Date, default: Date.now },
    seen: Boolean
});

var Image = mongoose.model('Image', picSchema);


// Routes
app.get('/', function(req, res) {
    console.log("incomming get")
    var time = new Date();
    res.send('Helooodas it is : '+ time);
});

app.get('/images', function(req, res) {
    //Person.findOne({ 'name.last': 'Ghost' }, 'name occupation', function (err, person) {
    //.lean().exec
    console.log("incomming get")
    Image.find({}, function (err, images) {
        if (err) return handleError(err);
        //res.send(JSON.stringify(images));
        res.send(" <!DOCTYPE html><html><head><title>Display Image</title></head><body><img style='display:block;height:281px;width:500px;' id='base64image' src='data:image/jpeg;charset=utf-8;base64, "+ images[0].pic +"' /></body>");
    });
});
//curl -d '{"title":"title1","data":"asas"}' -H 'content-type:application/json' "http://localhost:8080/images"
app.post('/images', function(req, res) {
    console.log("incomming post")
    var title = req.body.title;
    var data = req.body.data;
    console.log("Saving")
    var pic = new Image({title: title, pic: data});
    pic.save();
    res.send("OK");
});


app.listen(8080, "192.168.0.12")
