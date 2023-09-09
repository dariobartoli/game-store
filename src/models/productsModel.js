const mongoose = require('../config/mongo')

const productSchema = new mongoose.Schema({
    gameName: String,
    price: Number,
    description: String,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
    },
/*     variant: [{
      edition: String,
      price: Number
    }] */
  }, {timestamps: true});
  
const ProductModel = mongoose.model('products', productSchema);

module.exports = ProductModel