const jwt = require("jsonwebtoken")
require('dotenv').config();

const userVerify = async (req, res, next) => {
    try {
        const bearerToken = req.header('authorization') // trae el bearer token que pasamos en la autorizacion
        if (!bearerToken) return res.status(401).json({ message: "invalid data"});

        const token = bearerToken.split(' ')[1] //dividir el array, y tomar la posicion uno que es la del token
        const user = await dataFromToken(token)
        if (!user.id) return res.status(401).json({ message: "invalid data2"});

        req.user = user //devolvemos la credencial del usuario loggeado
        next();
    } catch (error) {
        if (!user) return res.status(500).json({ message: "it have ocurred an error"});
    }
};

const admin = async (req, res, next) => {
    try {
        if(!req.user.admin) return res.status(403).json({ message: "unauthorized access"}); //como al req.user ya lo almacene arriba ahora lo tengo disponible aca como en otro js
        next();
    } catch (error) {
        if (!user) return res.status(500).json({ message: "it have ocurred an error"});
    }
};

//funcion que creamos para validar el token
const dataFromToken = async (token) => {
    try {
        return jwt.verify(token, process.env.TOKEN_SIGNATURE, (err, data) => {
            if(err) return err
            return data
        })    
    } catch (error) {
        throw error
    }
}

module.exports = {userVerify, admin}