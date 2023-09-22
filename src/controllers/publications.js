const redisClient = require("../config/redis");
const PublicationModel = require("../models/publications");
const UserModel = require("../models/users");
const path = require('path')
require('dotenv').config();

const create = async (req, res) => {
  try {
    const { title, text } = req.body;
    let publication = new PublicationModel({
      title,
      text,
      active: true,
      user: req.user.id,
    });
    let userLogger = await UserModel.findById(req.user.id);
    if (!userLogger) {
      return res.status(404).json({ message: "User not found" });
    }
    userLogger.publications.push(publication._id);
    Promise.all([publication.save(), userLogger.save()]);
    return res.status(201).json({
      message: "publication has been created successful",
      publication,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "it has ocurred an error", error: error });
  }
};

const getAll = async (req, res) => {
  try {
    const publications = await PublicationModel.find();
    return res.status(200).json({ message: "all publications", publications });
  } catch (error) {
    return res.status(500).json({ message: "it has ocurred an error", error: error });
  }
};

const get = async(req,res) => {
  try {
    const idCache = req.user.id.concat("publication");
    const publicationCache = await redisClient.get(idCache)
    if(publicationCache){
      console.log("devuelto de cache");
      return res.status(200).json(JSON.parse(publicationCache))
    }
    const userProfile = await UserModel.findById(req.user.id).populate('publications')
    const publications = userProfile.publications
    if(publications.length == 0){
      throw new Error("you don't have publications")
    }
    console.log("devuelto de db");
    const cache = JSON.stringify({
      publications
    })
    redisClient.set(idCache.valueOf(), cache, {EX: parseInt(process.env.REDIS_TTL)})
    return res.status(200).json({publications});
  } catch (error) {
    return res.status(500).json({ message: error.message});
  }
}

const set = async (req, res) => {
  try {
    const idCache = req.user.id.concat('publication')
    const publicationCache = await redisClient.get(idCache)
    const { id, title, text } = req.body;
    const userLogged = await UserModel.findById({ _id: req.user.id });
    const publicationIndex = userLogged.publications.findIndex(
      (element) => element.toString() === id
    );
    if (publicationIndex === -1) {
      throw new Error("Publication not found");
    }
    const updatedPublication = await PublicationModel.findOneAndUpdate(
      { _id: id },
      { title: title, text: text },
      { new: true } // Para obtener la publicación actualizada
    );
    if(publicationCache){ //si existe cache, sobreescribirla con la nueva informacion de publications
      const user = await userLogged.populate('publications')
      const publications = user.publications
      const cache = JSON.stringify({
        publications
      })
      redisClient.set(idCache.valueOf(), cache, {EX: parseInt(process.env.REDIS_TTL)})
    }
    return res.status(200).json({ message: "publication edited", publication: updatedPublication });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const delet = async (req, res) => {
  try {
    const filter = req.body.id;
    const userLogged = await UserModel.findById({ _id: req.user.id });
    const publicationIndex = userLogged.publications.findIndex(
      (element) => element.toString() === filter
    );
    if (publicationIndex === -1) {
      throw new Error("Publication not found");
    }
    await PublicationModel.findByIdAndDelete({ _id: filter });
    return res.status(200).json({ message: "publication deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const probando = async (req, res) => {
  try {
    const { title, text } = req.body;
    const { filename, size } = req.file;
/*     const ext = path.extname(req.file.originalname).slice(1)
    if(size > 3000000){
      throw new Error("file too much heavy")
    }
    if(!ext.includes("jpg"||"jpeg"||"png")){
      throw new Error("file extension doesn't support")
    } */
    let publication = new PublicationModel({
      title,
      text,
      image: filename,
      active: true,
      user: req.user.id,
    });
    let userLogger = await UserModel.findById(req.user.id);
    if (!userLogger) {
      return res.status(404).json({ message: "User not found" });
    }
    userLogger.publications.push({ publication });
    Promise.all([publication.save(), userLogger.save()]);
    return res.status(201).json({
      message: "publication has been created successful",
      publication,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message});
  }
};

module.exports = { create, getAll, set, delet, probando, get};
