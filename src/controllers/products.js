const ProductModel = require("../models/products");

const getAll = async (req, res) => {
  try {
    products = await ProductModel.find().populate('category')
    return res
      .status(200)
      .json({ message: "all products", products: products });
  } catch (error) {
    return res.status(500).json({ message: "it has ocurred an error", error: error});
  }
};


const add = async (req, res) => {
    try {
      let newProduct =  new ProductModel(req.body)
      newProduct.save()
      return res.status(201).json({ message:"product created" ,newProduct });  
    } catch (error) {
      return res.status(500).json({message: "it has ocurred an error", error: error})
    }
  };

const del = async(req, res) => {
    try {
        const {id} = req.params
        product = await ProductModel.findByIdAndRemove(id)
        return res.status(200).json({message: "product removed"})
    } catch (error) {
        return res.status(500).json({message: "it has ocurred an error", error: error})    
    }
}

const set = async(req,res) => {
    try {
        const {id} = req.params
        product = await ProductModel.findByIdAndUpdate(id, req.body)
        return res.status(200).json({message: "product have been update"})
    } catch (error) {
        return res.status(500).json({message: "it has ocurred an error", error: error}) 
    }
}

const get = async(req,res) => {
    try {
        const{id} = req.params
        product = await ProductModel.findById(id).populate('category')
        return res.status(200).json({message: "product searched", product: product})
    } catch (error) {
        return res.status(500).json({message: "it has ocurred an error", error: error}) 
    }
}

module.exports = { getAll, add, del, set, get};
