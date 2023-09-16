const UserModel = require('../models/users')

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
        let user = await UserModel.findOne({_id: req.user.id})
        return res.status(200).json({ message:"user data:" ,user }); 
    } catch (error) {
        return res.status(500).json({message: "it has ocurred an error", error: error})
    }
}

module.exports = {getAll, get}