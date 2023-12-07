const jwt = require("jsonwebtoken");
require("dotenv").config();
const UserModel = require("../models/users");
const redisClient = require("../config/redis")

const userVerify = async (req, res, next) => {
  try {
    const bearerToken = req.header("authorization"); // trae el bearer token que pasamos en la autorizacion
    if (!bearerToken) return res.status(401).json({ message: "invalid token" });
    const token = bearerToken.split(" ")[1]; //dividir el array, y tomar la posicion uno que es la del token
    const user = await dataFromToken(token);
    if (!user.id) return res.status(401).json({ message: "sesion expired" });
    const { loginAuthorization } = await UserModel.findById(user.id);
    if (!loginAuthorization)
      return res.status(401).json({ message: "invalid access" });
    const key = bearerToken.concat("logout");
    const valor = await isTokenBlacklisted(key)
    if(valor){
        return res.status(401).json({ message: "sesion expired" });
    }
    req.user = user; //devolvemos la credencial del usuario loggeado
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const admin = async (req, res, next) => {
  try {
    if (!req.user.admin)
      return res.status(403).json({ message: "unauthorized access" }); //como al req.user ya lo almacene arriba ahora lo tengo disponible aca como en otro js
    next();
  } catch (error) {
    if (!user)
      return res.status(500).json({ message: "it have ocurred an error" });
  }
};

//funcion que creamos para validar el token
const dataFromToken = async (token) => {
  try {
    return jwt.verify(token, process.env.TOKEN_SIGNATURE, (err, data) => {
      if (err) return err;
      return data;
    });
  } catch (error) {
    throw error;
  }
};
//funcion para verificar si un token está en la lista negra
const isTokenBlacklisted = async (key) => {
  try {
    const token = await redisClient.get(key);
    if(token){
        return true
    }else{
        return false
    }
  } catch (error) {
    throw error;
  }
};

module.exports = { userVerify, admin };
