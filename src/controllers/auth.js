const UserModel = require("../models/users");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require('dotenv').config();

const register = async (req, res) => {
    try {
        let {firstName, lastName, email, password} = req.body
        let passwordHashed = await bcrypt.hash(password, 10)
        let newUser = new UserModel({firstName, lastName, email, password: passwordHashed, admin: false, loginAuthorization: true})
        const user = await newUser.save()
        const sanitizedUser = { ...user._doc }; //creamos una copia del usuario y eliminamos la pass al json que queremos mostrar
        delete sanitizedUser.password;
        return res.status(201).json({ message:"user saved" , sanitizedUser});  
    } catch (error) {
        return res.status(500).json({message: "it has ocurred an error", error: error})
    }
}


const login = async (req, res) => {
    try {
      let {email, password} = req.body
      const user = await UserModel.findOne({email: email}).select('_id email password admin loginAuthorization')
      console.log(user);
      if(!user) return res.status(401).json({ message: "user doesn't exist"});
      if(!user.loginAuthorization){
        return res.status(403).json({message: "invalid access"})
      }

      let logged = await user.comparePassword(password)
      if(!logged) return res.status(401).json({ message: "password incorrect"});
  
      const token = jwt.sign(
        { email: user.email, id: user._id, admin: user.admin },
        process.env.TOKEN_SIGNATURE)
      
      return res.status(200).json({ message: "login successful", token});
    
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: "it have ocurred an error" })
    }
};

module.exports = {register, login}