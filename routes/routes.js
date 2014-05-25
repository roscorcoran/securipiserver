// app/routes/routes.js
//Middleware function to test if user loggedin
function userAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect("/login");
    }
}

module.exports = function(app, passport) {
//var Account = require('./models/account');
var Image = require('../models/image');
//Account.register(new Account({ username : 'ros' }), 'test', function(err, account) {console.log(err);});
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

  app.get('/dashboard/images', userAuthenticated, function(req, res) {
      console.log("GET images");
      res.render('images', {
        title: 'Images'
      });
  });

  app.get('/api/images', function(req, res) {
      console.log("GET images api");
      Image.find({}, function (err, images) {
          if (err){
            return handleError(err);
          }
          res.send(JSON.stringify(images));
    });
  });
  app.get('/api/images/:_id', function(req, res) {
      console.log("GET images api");
      Image.findOne({_id: req.param("_id")}, function (err, image) {
          if (err){
            return handleError(err);
          }
          res.send(JSON.stringify(image));
    });
  });

  //Test
  //curl -d '{"title":"title1","data":"asas"}' -H 'content-type:application/json' "http://localhost:8080/images"
  app.post('/api/images', function(req, res) {
      console.log("incomming post");
      var title = req.body.title;
      var data = req.body.data;
      console.log("Saving");
      var pic = new Image({title: title, pic: data});
      pic.save();
      res.send("saved in DB OK");
  });

  app.post('/apig/images', function(req, res) {
      console.log("incomming post g");
      var title = req.body.title;
      var image = req.body.image;
      console.log("Saving");
      var writestream = gfs.createWriteStream({
        mode: 'r',
        root: 'my_images_store'
      });
      fs.createReadStream('/some/path').pipe(writestream);
      res.send("saved in DB OK");
  });

  app.delete('/api/images/:_id', function(req, res) {
      console.log("DELETE images api");
      Image.remove({_id: req.param("_id")}, function (err) {
          if (err) {
             return handleError(err);
          }
    });
  });
};
