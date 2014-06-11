// app/routes/routes.js
//Middleware function to test if user loggedin
function userAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect("/login");
    }
}

module.exports = function(app, passport, multiparty, gfs) {
//var Account = require('./models/account');
var Image = require('../models/image');
var fs = require("fs");
var util = require("util");
var mongoose = require('mongoose');
var ObjectID = mongoose.Types.ObjectId;
var im = require('imagemagick');

  // Routes
  //Login
  app.post('/login',
    passport.authenticate('local', { successRedirect: '/dashboard',
                                     failureRedirect: '/login',
                                     failureFlash: 'Invalid username or password.' })
  );

  app.get('/login', function(req, res) {
      console.log("GET login");
      res.render('login', {
        title: 'Login',
        failureFlash: req.flash('message')
      });
  });

  app.get('/logout', function(req, res) {
      console.log("GET logout");
      req.logout();
      res.redirect('/login');
  });

  app.get('/', function(req, res) {
      console.log("incomming get");
      res.redirect('/dashboard/images');
  });

  app.get('/dashboard', function(req, res) {
      console.log("GET dash");
      res.redirect('/dashboard/images');
  });

  app.get('/dashboard/images', /*userAuthenticated,*/ function(req, res) {
      console.log("GET images");
      res.render('images', {
        title: 'Images'
      });
  });
//IMAGES API
  /*app.get('/api/images', function(req, res) {
      console.log("GET images api");
      if(req.param("from") && req.param("to")){
        var from = parseInt(req.param("from"));
        var to = parseInt(req.param("to"));
        Image.find({ "ts": {"$gt" : from, "$lt" : to}}, function (err, images) {
          if (err){
            return handleError(err);
          }
          res.send(JSON.stringify(images));
        });
      }else{
        Image.find({}, function (err, images) {
          if (err){
            return handleError(err);
          }
          res.send(JSON.stringify(images));
        });
      }
  });*/


  app.get('/api/images_metadata', function(req, res) {
    console.log("GET images api metadata");
    gfs.collection('thumb_store').find({}).toArray(
      function (err, imagesmeta) {
        if (err){
          return handleError(err);
        }
        res.send(JSON.stringify(imagesmeta));
    });
  });

  app.get('/api/images_metadata/:_id', function(req, res) {
    console.log("GET images api metadata id");
    var tid = new ObjectID(req.param("_id"));
    gfs.collection('thumb_store').findOne({_id: tid},
      function (err, imagesmeta) {
        if (err){
          return handleError(err);
        }
        res.send(JSON.stringify(imagesmeta));
    });
  });
  /*app.get('/api/images/thumbnails', function(req, res) {
    console.log("GET images thumbnails api");
    gfs.collection('image_store').find({}).toArray(
      function (err, thumbs) {
        if (err){
          return handleError(err);
        }
        res.send(JSON.stringify(thumbs));
    });
  });
  app.get('/api/images/thumbnails/:_id', function(req, res) {
    console.log("GET images thumbnails id");
    var tid = new ObjectID(req.param("_id"));
    gfs.collection('thumb_store').findOne({_id: tid},
      function (err, thumb) {
        if (err){
          return handleError(err);
        }
        res.send(JSON.stringify(thumb));
    });
  });*/

  app.get('/api/images/thumbnails/:_id', function(req, res) {
      console.log("GET images thumb api by ID");
      var options = {
        mode: 'r',
        root: 'thumb_store',
        _id: new ObjectID(req.param("_id"))
      };
      var readStream = gfs.createReadStream(options);
      readStream.pipe(res);
  });

  /*app.get('/api/images_metadataold', function(req, res) {
      console.log("GET images api meta");
      Image.find({}).select('_id ts title seen starred').exec(
        function (err, imagesmeta) {
          if (err){
            return handleError(err);
          }
          res.send(JSON.stringify(imagesmeta));
        });
  });*/

  app.get('/api/images/:_id', function(req, res) {
      console.log("GET images api by ID");
      var options = {
        mode: 'r',
        root: 'image_store',
        _id: new ObjectID(req.param("_id"))
      };
      var readStream = gfs.createReadStream(options);
      readStream.pipe(res);
  });


  //Test
  //curl -d '{"title":"title1","data":"asas"}' -H 'content-type:application/json' "http://localhost:8080/images"
  /*app.post('/api/imagesold', function(req, res) {
      console.log("incomming post");
      var title = req.body.title;
      var data = req.body.data;
      console.log("Saving");
      var pic = new Image({title: title, pic: data});
      pic.save();
      res.send("saved in DB OK");
  });*/

  app.post('/api/images', function(req, res) {
      console.log("incomming post gridfs");

      var form = new multiparty.Form();
      form.parse(req, function(err, fields, files) {
        if (err) {
          res.writeHead(400, {'content-type': 'text/plain'});
          res.end("invalid request: " + err.message);
          return;
        }
        var tempfile = files.file[0].path;
        console.log(tempfile);
        var writestream = gfs.createWriteStream({
          mode: 'w',
          //chunkSize: 1024,
          content_type: 'image/jpeg',
          root: 'image_store'
        });
        //read temp file from /tmp
        fs.createReadStream(tempfile)
        .pipe(writestream)
        .on('error', function(err) {
          res.writeHead(400, {'content-type': 'text/plain'});
          res.end("invalid request: " + err.message);
        });

        writestream.on('close', function (file) {
          //use file object to insert id
          //console.log('FILE ID: ' + file._id);
          //console.log(util.inspect(file));
          im.resize({
            srcPath: tempfile,
            dstPath: tempfile+'.jpg',
            width:   256
          }, function(err, stdout, stderr){
            if (err) throw err;
            //Resized now we save the image thumb in the DB which can point to
            //the main image
            var thumbWriteStream = gfs.createWriteStream({
              mode: 'w',
              content_type: 'image/jpeg',
              root: 'thumb_store',
              metadata: {
                main_id: file._id,
                starred: false,
                seen: false
              }
            });
            fs.createReadStream(tempfile+'.jpg')
            .pipe(thumbWriteStream)
            .on('error', function(err) {
              res.writeHead(400, {'content-type': 'text/plain'});
              res.end("invalid request: " + err.message);
            });
            //Finaly remove both temps
            fs.unlinkSync(tempfile);
            fs.unlinkSync(tempfile+'.jpg');
            console.log('resized to fit within 128px');
          });
        });
        res.writeHead(200, {'content-type': 'text/plain'});
        res.end('OK');
      });
  });

  //Add thumb deletion
  app.delete('/api/images/:_id', function(req, res) {
    console.log("DELETE images api");
    var options = {
      mode: 'w',
      root: 'image_store',
      _id: req.param("_id")
    };
    gfs.remove(options, function (err) {
      if (err) return handleError(err);
      console.log('delete success');
    });
  });

  /*app.delete('/api/imagesold/:_id', function(req, res) {
    console.log("DELETE images api");
    Image.remove({_id: req.param("_id")}, function (err) {
        if (err) {
           return handleError(err);
        }
    });
  });*/
};
