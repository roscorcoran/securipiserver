var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: String,
    password: String
});

function authenticate(username, password, done) {
  User.findOne({ username: username }, function (err, user) {
    if (err) { return done(err); }
    if (!user) {
      return done(null, false, { message: 'Incorrect username or password.' });
    }
    if (!user.validPassword(password)) {
      return done(null, false, { message: 'Incorrect username or password.' });
    }
    return done(null, user);
  });
}
/*
*     passport.use(new LocalStrategy(
*       function(username, password, done) {
*         User.findOne({ username: username, password: password }, function (err, user) {
*           done(err, user);
*         });
*       }
*     ));
*/

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
