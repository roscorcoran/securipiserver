var express = require('express');
var http = require('http');

var app = express(); 
var server = http.createServer(app);

// Routes
app.get('/', function(req, res) {
    var time = new Date();
    res.send('Helooodas it is : '+ time);
});

app.listen(8080);
