var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var hashtagSchema = new Schema({
    entry: {type: String, unique: true},
    articleToBeDeleted: Boolean,
    themeToBeDeleted: Boolean,
    associatedThemes: [{type: String}],
});

export var HashtagModel = mongoose.model('Hashtag', hashtagSchema);