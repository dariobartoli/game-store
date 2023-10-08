const UserModel = require("../models/users");
const PublicationModel = require('../models/publications')

const get = async(req,res) => {
    try {
        return res.status(200).json({ message:"welcome admin"}); 
    } catch (error) {
        return res.status(500).json({message: "it has ocurred an error", error: error})
    }
}

const disabledUser = async(req,res) => {
    try {
        const filter = {email: req.body.email};
        const update = {loginAuthorization: false}
        const user = await UserModel.findOne(filter)
        if(!user){
            return res.status(409).json({message: "user doesn't exist"})
        }
        const result = await UserModel.updateOne(filter, update);
        return res.status(200).json({message:"user disabled"})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

const disabledPublication = async(req,res) => {
    try {
        const {idUser, idPub} = req.body;
        const update = {active: false}; 
        const user = await UserModel.findById({_id: idUser})
        const publicationIndex = user.publications.findIndex(element => element.publication._id.toString() === idPub);
        if (publicationIndex === -1) {
            return res.status(409).json({message: "Publication not found"})
        }
        const publication = await PublicationModel.findOne({_id: idPub})
        if(!publication){
            return res.status(409).json({message: "publication doesn't exist"})
        }
        user.publications[publicationIndex].publication.active = false
        await PublicationModel.updateOne({_id: idPub}, update);
        user.save()
        return res.status(200).json({message:"publication disabled"})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}


module.exports = {get, disabledUser, disabledPublication}