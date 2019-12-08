var mongoose = require('mongoose');

var Schema = mongoose.Schema;

const ARTICLE_MEDIUM = ['video', 'presse', 'blog', "document"];

var articleSchema = new Schema({
    title: String,
    url: {type: String, trim: true, unique: true},
    language: {type: String},
    medium: {type: String, enum: ARTICLE_MEDIUM},
    description: String,
    siteInternet: String,
    themes: [{type: String, unique: true}],
    notYetIndexedThemes: [{type: String, unique: true}],
    auteur: [{type: Number}],
    tweetId: [{type: Number}],
    isVisible: Boolean,
    createdAt: {type: Date, default: new Date()},
    approvedAt: {type: Date, default: new Date()},
    indexedAt: {type: Date, default: new Date()}
});

export var ArticleModel = mongoose.model('Article', articleSchema);