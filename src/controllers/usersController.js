const UserModel = require('../models/usersModel')

const add = async(req,res) =>{
    try {
        let newUser = new UserModel(req.body)
        newUser.save()
        return res.status(201).json({ message:"user created" ,newUser });  
    } catch (error) {
        return res.status(500).json({message: "it has ocurred an error", error: error})
    }
}

const getAll = async(req,res) =>{
    try {
        let users = await UserModel.find()
        return res.status(200).json({ message:"all users" ,users: users});
    } catch (error) {
        return res.status(500).json({message: "it has ocurred an error", error: error})
    }
}

const login = async(req,res) => {
    try {
        let {userEmail, password} = (req.body)
        let userLogin = await UserModel.findOne({email: userEmail})
        if(!userLogin){
            throw new Error("email or password incorrect")
        }
        if(userLogin.password != password){
            console.log("contra incorrecta");
            throw new Error("email or password incorrect")
        }
        return res.status(200).json({ message:"login sucessful"});
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

module.exports = {add, getAll, login}