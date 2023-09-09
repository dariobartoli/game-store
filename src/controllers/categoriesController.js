const CategoryModel = require('../models/categoriesModel');
const ProductModel = require('../models/productsModel');


const add = async(req,res) => {
    try {
        let newCategory = new CategoryModel(req.body)
        newCategory.save()
        return res.status(201).json({message: "category created", newCategory})
    } catch (error) {
        return res.status(500).json({ message: "it has ocurred an error", error: error});
    }
}

const get = async(req,res) => {
    try {
        let categories = await CategoryModel.find()
        return res.status(200).json({message: "all categories", categories})
    } catch (error) {
        return res.status(500).json({ message: "it has ocurred an error", error: error});
    }
}


module.exports = {add, get}