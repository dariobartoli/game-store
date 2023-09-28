const CartModel = require('../models/carts')
const ProductModel = require('../models/products')
const UserModel = require('../models/users')

const addToCart = async(req,res) => {
    try {
        const userId = req.user.id
        const user = await UserModel.findById(userId)
        const game = req.body.id
        const variant = req.body.variant
        const gameExists = await ProductModel.findById(game)
        const gameInYourLibrary = user.games.filter((item) => item.valueOf() == game)
        if(gameInYourLibrary.length > 0){
            throw new Error("this game is already in your library")
        }
        const variantIngame = gameExists.variant.filter((item) => item._id == variant)
        if(variantIngame.length == 0){
            throw new Error("invalid data in game/edition")
        }
        if(user.cart){
            const cart = await CartModel.findById(user.cart.valueOf())
            const searchGame = cart.gamesInCart.filter((item) => item.game == game)
            if(searchGame.length > 0){
                throw new Error("this game is already in your cart");
            }
            cart.gamesInCart.push({
                variant,
                game
            })
            await cart.save()
        }else{
            const cart = new CartModel()
            cart.gamesInCart.push({
                variant,
                game
            })
            user.cart = cart._id
            await Promise.all([user.save(), cart.save()])
        }
        return res.status(201).json({ message: "product add to cart"});
    } catch (error) {
        return res.status(500).json({ message: error.message});
    }
}

const cleanCart = async(req, res) => {
    try {
        const idUser = req.user.id
        const user = await UserModel.findById(idUser)
        if (!user.cart) {
            throw new Error("you don't have anything in your cart")
        }
        await CartModel.findByIdAndRemove(user.cart);
        user.cart = undefined;
        await user.save();
        return res.status(200).json({message: "cart cleaned"})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

const removeToCart = async(req,res) => {
    try {
        const idUser = req.user.id
        const idGame = req.body.id
        const gameExists = await ProductModel.findById(idGame)
        const user = await UserModel.findById(idUser)
        const cart = await CartModel.findById(user.cart)
        if (!user.cart) {
            throw new Error("you don't have anything in your cart")
        }
        cart.gamesInCart = cart.gamesInCart.filter((game) => game._id.toString() != idGame)
        if(cart.gamesInCart.length == 0){
            user.cart = undefined;
        }
        await Promise.all([cart.save(), user.save()])
        return res.status(200).json({message: "game removed of the cart"})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

const getCart = async(req,res) => {
    try {
        const idUser = req.user.id
        const user = await UserModel.findById(idUser)
        if(!user.cart){
            throw new Error("you don't have anything in your cart")
        }
        const cartUser = await CartModel.findById(user.cart.valueOf()).populate("gamesInCart.game")
        return res.status(200).json({message: "your cart", cartUser})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

const purchase = async(req,res) => {
    try {
        const userId = req.user.id
        const user = await UserModel.findById(userId)
        if (!user.cart) {
            throw new Error("you don't have anything in your cart")
        }
        const cart = await CartModel.findById(user.cart.valueOf())
        let total = 0
        for (const item of cart.gamesInCart) {
            let game = await ProductModel.findById(item.game.valueOf())
            const variant = game.variant.find(v => v._id.equals(item.variant));
            if (variant) {
                total += variant.price;
            }
            console.log(total);
        }
        if(user.wallet < total.toFixed(2)){
            throw new Error("insufficient balance")
        }

        user.wishlist = user.wishlist.filter(wishlistGameId => {
            return !cart.gamesInCart.some(cartGame => wishlistGameId.equals(cartGame.game));
        }); //Utilizamos cart.gamesInCart.some() para verificar si un juego en la lista de deseos (user.wishlist) está en el carrito de compra (cart.gamesInCart)

        user.wallet = user.wallet.toFixed(2) - total.toFixed(2)
        for (const item of cart.gamesInCart) {
            user.games.push(item.game)
        }
        await CartModel.findByIdAndRemove(user.cart);
        user.cart = undefined;
        await user.save();
        return res.status(200).json({message: "purchase successful"})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

module.exports = {addToCart, cleanCart, removeToCart, getCart, purchase}