var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var articleSchema = new Schema({
    titre: String,
    lien: {type: String, trim: true},
    themes: [{type: String, unique: true, enum:['pedagogie']}],
    dateEnregistrement: {type: Date, default: new Date()}
});

articleSchema.query.byTitre = function(titre: string) {
    return this.where({ titre: new RegExp(titre, 'i') });
};

export var ArticleModel = mongoose.model('Article', articleSchema);