const UserModel = require('../models/users')
const ProductModel = require(`../models/products`)
const mongoose = require('../config/mongo')

const add = async(req,res) => {
    try {
        const userId = req.user.id
        const gameId = req.body.id
        const user = await UserModel.findById(userId)
        const game = await ProductModel.findById(gameId)
        const gameObjectId = new mongoose.Types.ObjectId(gameId); // Usamos mongoose.Types.ObjectId(gameId) para convertir gameId en un ObjectId.
        if(user.wishlist.some(wishlistGame => wishlistGame.equals(gameObjectId))){//some() para verificar si algún elemento en el array user.games tiene un _id igual a gameId. Esto simplifica la comprobación de si el juego está en la biblioteca del usuario.
            return res.status(409).json({message: "this game is already in your wishlist"})
        }
        if(user.games.some(libraryGame => libraryGame.equals(gameObjectId))){// utilizamos el método equals() para comparar si el ObjectId del juego coincide con algún ObjectId en la lista de deseos o en la biblioteca 
            return res.status(409).json({message: "this game is already in your library"})
        }
        user.wishlist.push(gameId)
        await user.save()
        return res.status(201).json({message: "game add to wishlist"})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

const remove = async(req,res) => {
    try {
        const userId = req.user.id
        const {id} = req.params
        const user = await UserModel.findById(userId)
        const game = await ProductModel.findById(id)
        const gameObjectId = new mongoose.Types.ObjectId(id)
        if(!user.wishlist.some(wislistgame => wislistgame.equals(gameObjectId))){
            return res.status(409).json({message: "this game isn't in your wishlist"})
        }
        user.wishlist = user.wishlist.filter(item => item != id)
        user.save()
        return res.status(200).json({message: "game removed to wishlist"})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

const get = async(req,res) => {
    try {
        const user = await UserModel.findById(req.user.id).populate('wishlist')
        const wishlist = user.wishlist
        return res.status(200).json({message: "your wishlist", wishlist})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

module.exports = {add, remove, get}