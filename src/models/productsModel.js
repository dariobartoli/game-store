const mongoose = require('../config/mongo')

const productSchema = new mongoose.Schema({
    gameName: String,
    price: Number,
    description: String,
/*     variant: [{
      edition: String,
      price: Number
    }] */
  });
  
const Product = mongoose.model('products', productSchema);


async function getAll() {
    try {
      const products = await Product.find();
      return products
    } catch (error) {
      throw (`imposible retornar ${error}`)
    }
}

async function get(id) {
    try {
      const products = await Product.findById(id);
      return products
    } catch (error) {
      throw (`imposible retornar ${error}`)
    }
}

async function add(data) {
    try {
      const newProduct = new Product(data);
      newProduct.save()
      return newProduct
    } catch (error) {
      throw (`imposible retornar ${error}`)
    }
}

async function del(id) {
    try {
      const products = await Product.findByIdAndRemove(id);
      return true
    } catch (error) {
      throw (`imposible retornar ${error}`)
    }
}

async function set(id, update) {
    try {
      const product = await Product.findByIdAndUpdate(id, update);
      product.save()
      return product
    } catch (error) {
      throw (`imposible retornar ${error}`)
    }
}


module.exports = {getAll, add, del, set, get}