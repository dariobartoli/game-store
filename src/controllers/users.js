const UserModel = require('../models/users')
const redisClient = require('../config/redis')
require('dotenv').config();

const getAll = async(req,res) =>{
    try {
        let users = await UserModel.find()
        return res.status(200).json({ message:"all users" ,users: users});
    } catch (error) {
        return res.status(500).json({message: "it has ocurred an error", error: error})
    }
}

const get = async(req,res) => {
    try {
        const userCache = await redisClient.get(req.user.id)//busco en redis si ese id existe, si no devuelve null
        if(userCache){
            console.log("devuelvo de cache");
            return res.status(200).json({ message:"user data:" ,user: JSON.parse(userCache)}); 
        }
        console.log("devuelto de bd");
        let user = await UserModel.findOne({_id: req.user.id}).select('_id email firstName lastName publications messages cart').populate("cart")
        redisClient.set(req.user.id.valueOf(), JSON.stringify(user), {EX: parseInt(process.env.REDIS_TTL)})//guardar en cache si no está
        return res.status(200).json({ message:"user data:" ,user }); 
    } catch (error) {
        return res.status(500).json({message: "it has ocurred an error", error: error})
    }
}

const addFriend = async(req,res) => {
    try {
        const userId = req.user.id
        const idFriend = req.body.id
        if(userId == idFriend){
            throw new Error("dont possible execute this action")
        }
        const userFriend = await UserModel.findById(idFriend)
        for (const element of userFriend.friendsRequest) {
            if(element == userId){
                throw new Error("you have already sended this request to this user")
            }
        }
        for (const element of userFriend.friends) {
            if(element.valueOf() == userId){
                throw new Error("this user already is your friend")
            }
        }
        userFriend.friendsRequest.push(userId)
        userFriend.save()
        return res.status(200).json({ message:"friend request sent"}); 
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

const responseRequest = async(req,res) => {
    try {
        const {id, response} = req.body
        if(req.user.id == id){
            throw new Error("dont possible execute this action")
        }
        const user = await UserModel.findById(req.user.id)
        const userFriend = await UserModel.findById(id)
        const exists = user.friendsRequest.filter((request) => request.toString() == id)
        if(exists.length == 0){
            throw new Error("request dont found")
        }
        if(response){
            user.friends.push(userFriend)
            userFriend.friends.push(user)
            user.friendsRequest = user.friendsRequest.filter((request) => request.toString() !== id);
            await Promise.all([userFriend.save(), user.save()]) 
            return res.status(200).json({ message:"user added to your friends"}); 
        }else{
            user.friendsRequest = user.friendsRequest.filter((request) => request.toString() !== id);
            await user.save()
            return res.status(200).json({ message:"request to friend reject"}); 
        }
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

const removeFriend = async(req,res) => {
    try {
        const userId = req.user.id
        const idUserRemove = req.body.id
        const user = await UserModel.findById(userId)
        const userRemove = await UserModel.findById(idUserRemove)
        user.friends.map((friend) => {
            if(friend.valueOf() == idUserRemove){
                user.friends = user.friends.filter((friend) => friend.toString() != idUserRemove)
                userRemove.friends = userRemove.friends.filter((friend) => friend.toString() != userId)
                Promise.all([user.save(), userRemove.save()])
                return res.status(200).json({ message:"the user has been removed of your list of friends"}); 
            }
        })
    } catch (error) {
        return res.status(500).json({message: "it has ocurred an error", error: error})
    }
}


module.exports = {getAll, get, addFriend, responseRequest, removeFriend}