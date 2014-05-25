var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var imageSchema = new Schema({
    title: { type: String, default: 'Title' },
    pic: String,
    ts: { type: Date, default: Date.now },
    seen: { type: Boolean, default: false },
    starred: { type: Boolean, default: false }
});

var Image = mongoose.model('Image', imageSchema);

module.exports = mongoose.model('Image', Image);
