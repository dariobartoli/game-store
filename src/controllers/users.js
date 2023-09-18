const UserModel = require('../models/users')
const redisClient = require('../config/redis')

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
        let user = await UserModel.findOne({_id: req.user.id}).select('_id email firstName lastName publications')
        return res.status(200).json({ message:"user data:" ,user }); 
    } catch (error) {
        return res.status(500).json({message: "it has ocurred an error", error: error})
    }
}

/* const get = async(req,res) => {
    try {
        let user = await UserModel.findOne({_id: req.user.id})
        return res.status(200).json({ message:"user data:" ,user }); 
    } catch (error) {
        return res.status(500).json({message: "it has ocurred an error", error: error})
    }
} */

module.exports = {getAll, get}