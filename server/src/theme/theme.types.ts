var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var themeSchema = new Schema({
    theme: {type: String, unique: true},
    neighboors: [{
        node: String,
        weight: Number
    }],
});

export var ThemeModel = mongoose.model('Theme', themeSchema);