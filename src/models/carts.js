const mongoose = require('../config/mongo')

const cartSchema = new mongoose.Schema({
    gamesInCart: [{
      variant: String,
      game:{type: mongoose.Schema.Types.ObjectId, ref: "Products"}
    }],
  }, {timestamps: true});
  
const CartModel = mongoose.model('Carts', cartSchema);

module.exports = CartModel