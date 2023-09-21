const UserModel = require("../models/users");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require('dotenv').config();
const redisClient = require("../config/redis")

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
      const user = await UserModel.findOne({email: email}).select('_id email password admin loginAuthorization firstName lastName publications')
      if(!user) return res.status(401).json({ message: "user doesn't exist"});
      if(!user.loginAuthorization){
        return res.status(403).json({message: "invalid access"})
      }

      let logged = await user.comparePassword(password)
      if(!logged) return res.status(401).json({ message: "password incorrect"});
  
      const token = jwt.sign(
        { email: user.email, id: user._id, admin: user.admin },
        process.env.TOKEN_SIGNATURE)
      const userCache = JSON.stringify({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        publications: user.publications
      })//guardamos la informacion del usuario que guardaremos en la cache, redis solo almacena texto

      redisClient.set(user.id.valueOf(), userCache, {EX: parseInt(process.env.REDIS_TTL)})//guardamos la informacion en la cache, con un id(key), la informacion y el tiempo de expiracion
      //usamos valueOf, para sacar solo el id, sino devolveria un object(id)
      return res.status(200).json({ message: "login successful", token});
    
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: "it have ocurred an error" })
    }
};

module.exports = {register, login}