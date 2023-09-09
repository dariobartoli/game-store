const mongoose = require('../config/mongo')

const categorySchema = new mongoose.Schema({
    nameCategory: String,
    description: String
  }, {timestamps: true});
  
const CategoryModel = mongoose.model('Categories', categorySchema);

module.exports = CategoryModel