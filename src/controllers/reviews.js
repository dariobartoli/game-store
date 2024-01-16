const ReviewModel = require('../models/reviews')
const UserModel = require('../models/users')
const ProductModel = require('../models/products')
const mongoose = require('../config/mongo')

const add = async(req,res) => {
    try {
        const user = await UserModel.findById(req.user.id)
        const game = await ProductModel.findById(req.body.id)
        const {text, recommended} = req.body
        const gameObjectId = new mongoose.Types.ObjectId(game)
        const review = {
            idGame: game._id,
            text,
            recommended,
            userId: user._id,
        }
        if(!user.games.some(item => item.equals(gameObjectId))){
            return res.status(409).json({message: "you haven't this game"})
        }
        const userHasReviewedGame = user.reviews.some(reviewId => game.reviews.includes(reviewId));
        if (userHasReviewedGame) {
            return res.status(409).json({message: "You have already reviewed this game"})
        }
        const newReview = new ReviewModel(review)
        user.reviews.push(newReview)
        game.reviews.push(newReview)
        await Promise.all([newReview.save(), user.save(), game.save()])
    return res.status(201).json({message: "review sent to moderator, please wait", newReview})   
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

const get = async(req,res) => {
    try {
        const user = await UserModel.findById(req.user.id).populate('reviews')
        const reviews = user.reviews
        return res.status(200).json({message: "your reviews", reviews})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

const getAll = async(req, res) => {
    try {
        const {id} = req.params
        const game = await ProductModel.findById(id).populate("reviews")
        const reviews = game.reviews
        return res.status(200).json({message: "reviews", reviews})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

const remove = async(req, res) => {
    try {
        const {id} = req.params
        const review = await ReviewModel.findById(id)
        const user = await UserModel.findById(req.user.id)
        const product = await ProductModel.findById(review.idGame)
        user.reviews = user.reviews.filter(item =>  item != id)
        product.reviews = product.reviews.filter(item => item != id)
        await ReviewModel.findByIdAndDelete(id)
        await Promise.all([user.save(), product.save()])
        return res.status(200).json({message: "review removed"})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

module.exports = {add, get, remove, getAll}