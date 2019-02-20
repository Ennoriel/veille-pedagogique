var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var articleSchema = new Schema({
    title: String,
    url: {type: String, trim: true},
    language: {type: String, unique: true, enum:['fr']},
    medium: {type: String, unique: true, enum:['video', 'presse', 'blog']},
    description: String,
    siteInternet: String,
    themes: [{type: String, unique: true}],
    auteur: [{type: Number}],
    tweetId: [{type: Number}],
    createdAt: {type: Date, default: new Date()}
});

export var ArticleModel = mongoose.model('Article', articleSchema);