var mongoose = require('mongoose');

var RecipeSchema = new mongoose.Schema({
    name: { type: String, required: true }
});

var Recipe = mongoose.model('Recipe', RecipeSchema);

module.exports = Recipe;