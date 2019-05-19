var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var hashtagSchema = new Schema({
    entry: {type: String, unique: true},
    articleToBeDeleted: Boolean,
    themeToBeDeleted: Boolean,
    associatedTheme: String,
});

export var HashtagModel = mongoose.model('Hashtag', hashtagSchema);