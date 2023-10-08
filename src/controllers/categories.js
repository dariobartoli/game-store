const CategoryModel = require('../models/categories');
const ProductModel = require('../models/products');


const add = async(req,res) => {
    try {
        const filter = (req.body.nameCategory)
        const categories = await CategoryModel.find()
        let hasCreated = false
        for (const element of categories) {
            if(element.nameCategory.toLowerCase() === filter.toLowerCase()){
                hasCreated = true
            }
        }
        if(hasCreated){
            return res.status(409).json({message: 'This category has already been created'})
        }
        let newCategory = new CategoryModel(req.body)
        newCategory.save()
        return res.status(201).json({message: "category created", newCategory})
    } catch (error) {
        return res.status(500).json({ message: error.message});
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