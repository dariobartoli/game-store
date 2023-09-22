const mongoose = require('../config/mongo')

const productSchema = new mongoose.Schema({
    gameName: String,
    description: String,
    coverImage: String,
    variant: [{
      edition: String,
      price: Number
    }],
    category: [{type: mongoose.Schema.Types.ObjectId, ref: "Categories"}],
  }, {timestamps: true});

productSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
  },
});

const ProductModel = mongoose.model('Products', productSchema);

module.exports = ProductModel