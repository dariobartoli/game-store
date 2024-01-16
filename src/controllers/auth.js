const UserModel = require("../models/users");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require('dotenv').config();
const redisClient = require("../config/redis")
const { faker } = require('@faker-js/faker');

const register = async (req, res) => {
    try {
        let {firstName, lastName, email, password} = req.body
        let emailTrue = await UserModel.find({email: email})
        if(emailTrue.length > 0){
          return res.status(409).json({message: "this email is already register"})
        }
        let passwordHashed = await bcrypt.hash(password, 10)
        let newUser = new UserModel({firstName, lastName, email, password: passwordHashed, admin: false, loginAuthorization: true, wallet: 1000, profileImage: 'https://i.ibb.co/gPdnx88/blank-profile-picture-973460-960-720.webp', nickName: faker.internet.userName()})
        const user = await newUser.save()
        const sanitizedUser = { ...user._doc }; //creamos una copia del usuario y eliminamos la pass al json que queremos mostrar
        delete sanitizedUser.password;
        return res.status(201).json({ message:"successful registration" , sanitizedUser});  
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message})
    }
}

const login = async (req, res) => {
    try {
      let {emailOrNick, password} = req.body
      const user = await UserModel.findOne({
        $or: [
          {email: emailOrNick},
          {nickName: emailOrNick}
        ]
      }).select('_id email password admin loginAuthorization firstName lastName publications profileImage messages wishlist nickName wallet friends games reviews friendsRequest background description cart')
      if(user == null) return res.status(401).json({ message: "user doesn't exist"});
      if(!user.loginAuthorization){
        return res.status(403).json({message: "invalid access"})
      }

      let logged = await user.comparePassword(password)
      if(!logged) return res.status(401).json({ message: "password incorrect"});
  
      const token = jwt.sign(
        { email: user.email, id: user._id, admin: user.admin, authorization: user.loginAuthorization},
        process.env.TOKEN_SIGNATURE, {expiresIn: '60m'})
      const userCache = JSON.stringify({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        publications: user.publications,
        messages: user.messages,
        profileImage: user.profileImage,
        wishlist: user.wishlist,
        nickName: user.nickName,
        wallet: user.wallet,
        friends: user.friends,
        games: user.games,
        reviews: user.reviews,
        friendRequest: user.friendsRequest,
        background: user.background,
        description: user.description,
        cart: user.cart
      })//guardamos la informacion del usuario que guardaremos en la cache, redis solo almacena texto
      redisClient.set(user.id.valueOf(), userCache, {EX: parseInt(process.env.REDIS_TTL)})//guardamos la informacion en la cache, con un id(key), la informacion y el tiempo de expiracion
      //usamos valueOf, para sacar solo el id, sino devolveria un object(id)
      return res.status(201).json({ message: "login successful", token, userId: user._id});
    
    } catch (error) {
      return res.status(500).json({ message: "it has ocurred an error" })
    }
};

const logout = async(req,res) => {
  try {
    const bearerToken = req.header('authorization')
    if (!bearerToken) return res.status(401).json({ message: "invalid data"});
    const key = bearerToken.concat('logout')
    const blackList = JSON.stringify({
      token: bearerToken
    })
    let expirationInSeconds = 3600
    redisClient.set(key.valueOf(), blackList, {EX: expirationInSeconds})
    return res.status(200).json({ message: "logout successful"});
  } catch (error) {
    return res.status(500).json({ message: "it has ocurred an error" })
  }
}

module.exports = {register, login, logout}