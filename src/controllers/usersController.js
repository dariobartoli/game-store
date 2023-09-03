const usersModel = require('../models/usersModel')

const add = async(req,res) =>{
    try {
        let user = await usersModel.add(req.body)
        return res.status(201).json({ message:"user created" ,user });  
    } catch (error) {
        return res.status(500).json({message: "it has ocurred an error", error: error})
    }
}

const getAll = async(req,res) =>{
    try {
        let users = await usersModel.getAll()
        return res.status(200).json({ message:"all users" ,users: users});
    } catch (error) {
        return res.status(500).json({message: "it has ocurred an error", error: error})
    }
}

module.exports = {add, getAll}