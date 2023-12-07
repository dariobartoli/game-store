const ProductModel = require("../models/products");
const cloudinary = require('../config/cloudinary');
const fs = require('fs'); //fyle sistem es el módulo de Node.js que proporciona funciones para interactuar con el sistema de archivos, como leer archivos, escribir archivos, crear directorios, eliminar archivos y más. Es una parte fundamental de la manipulación de archivos en aplicaciones Node.js.
const UserModel = require("../models/users");

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
      if(!req.file){
        return res.status(400).json({message: "don't found image"})
      }
      const {gameName, description, category, developer, publisher} = req.body
      const imagenPath = req.file.path
      const searchGame = await ProductModel.findOne({gameName: gameName})
      if(searchGame != null){
        return res.status(409).json({message: "this game already exists in your products"})
      }
      let urlImage = ""
      await cloudinary.uploader.upload(imagenPath, function(error, result) {
        if (error) {
          throw new Error(error)
        } else {
          urlImage = result.url;// Result contiene la información sobre la imagen cargada
        }
      })
      fs.unlink(imagenPath, (err) => {
        if (err) {
          console.error('Error al eliminar el archivo local:', err);
        } else {
          //console.log('Archivo local eliminado con éxito.');
        }
      });
      let requestData = {
        gameName,
        description,
        coverImage: "",
        developer,
        publisher,
        variant: [],
        category
      }
      for (let i = 0; req.body[`variant[${i}].edition`]; i++) {
        requestData.variant.push({
          edition: req.body[`variant[${i}].edition`],
          price: parseFloat(req.body[`variant[${i}].price`])
        });
      }
      for (let i = 0; req.body[`category[${i}]`]; i++) {
        console.log("hola");
        requestData.category.push(req.body[`category[${i}]`]);
      }
      requestData.coverImage = urlImage
      let newProduct =  new ProductModel(requestData)
      newProduct.save()
      return res.status(201).json({ message:"product created", product: newProduct});  
    } catch (error) {
      return res.status(500).json({message: error.message})
    }
  };

const addImages = async(req, res) => {
  try {
    const id = req.body.id
    const images = req.files
    const uploadedImages = [];
    const product = await ProductModel.findById(id)
    if(!product){
      return res.status(400).json({message: "this product doesn't exists"})
    }
    const uploadPromises = images.map(async (image) => {
      const imagePath = image.path;
      try {
        const result = await cloudinary.uploader.upload(imagePath);
        uploadedImages.push(result.url);
      } catch (error) {
        throw new Error(error)
      }
    });
    await Promise.all(uploadPromises); //de esta manera mejoré el tiempo de respuesta

    for (let i = 0; i < images.length; i++) {
      const imagePath = images[i].path;
      fs.unlink(imagePath, (err) => {
        if (err) {
          throw new Error(err)
        } else {
          //console.log('Archivo local eliminado con éxito.');
        }
      });
    }
    if(uploadedImages.length == 0){
      return res.status(400).json({message: "there isn't anything for push in the product"})
    }
    for (let i = 0; i < uploadedImages.length; i++) {
      product.images.push(uploadedImages[i])
    }
    await product.save()
    return res.status(201).json({ message:"images added"});
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
}

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
        const imagen = req.file
        const {gameName, description, category, developer, publisher} = req.body
        let variant = []
        for (let i = 0; req.body[`variant[${i}].edition`]; i++) {
          variant.push({
            edition: req.body[`variant[${i}].edition`],
            price: parseFloat(req.body[`variant[${i}].price`])
          });
        }

        let urlImage = ""
        if(imagen){
          await cloudinary.uploader.upload(imagen.path, function(error, result) {
            if (error) {
              throw new Error(error);
            } else {
              urlImage = result.url;// Result contiene la información sobre la imagen cargada
            }
          })
          fs.unlink(imagen.path, (err) => {
            if (err) {
              console.error('Error al eliminar el archivo local:', err);
            } else {
              //console.log('Archivo local eliminado con éxito.');
            }
          });
        }
        updateFields = {}
        if(gameName){
          updateFields.gameName = gameName
        }
        if(description){
          updateFields.description = description
        }
        if(category){
          updateFields.category = category
        }
        if(developer){
          updateFields.developer = developer
        }
        if(publisher){
          updateFields.publisher = publisher
        }
        if(variant.length > 0){
          updateFields.variant = variant
        }
        if(urlImage){
          updateFields.coverImage = urlImage
        }

        product = await ProductModel.findByIdAndUpdate(id, updateFields, {new: true})
        return res.status(200).json({message: "product has been update", product})
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

const userProducts = async(req,res) => {
  try {
    const {id} = req.params
    const user = await UserModel.findById(id).populate('games')
    const library = user.games
    return res.status(200).json({message:"your games", library})
  } catch (error) {
    return res.status(500).json({message: "it has ocurred an error", error: error}) 
  }
}

module.exports = { getAll, add, del, set, get, addImages, userProducts};
