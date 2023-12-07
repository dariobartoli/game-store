const redisClient = require("../config/redis");
const PublicationModel = require("../models/publications");
const UserModel = require("../models/users");
require("dotenv").config();
const cloudinary = require("../config/cloudinary");
const fs = require("fs");



const create = async (req, res) => {
  try {
    const { title, text } = req.body;
    const images = req.files;
    const uploadedImages = [];
    const uploadPromises = images.map(async (image) => {
      const imagePath = image.path;
      try {
        const result = await cloudinary.uploader.upload(imagePath);
        uploadedImages.push(result.url);
      } catch (error) {
        throw new Error(error);
      }
    });
    await Promise.all(uploadPromises);
    for (let i = 0; i < images.length; i++) {
      const imagePath = images[i].path;
      fs.unlink(imagePath, (err) => {
        if (err) {
          throw new Error(err)
        } else {
          //console.log('Archivo local eliminado con éxito.');
        }
      });
    }

    let imagesUpload = []
    if(uploadedImages.length > 0){
      for (let i = 0; i < uploadedImages.length; i++) {
        imagesUpload.push(uploadedImages[i])
      }
    }

    let publication = new PublicationModel({
      title,
      text,
      active: true,
      show: false,
      user: req.user.id,
      images: imagesUpload,
      likes: [],
      comments: [],
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
      .json({ message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const publications = await PublicationModel.find();
    return res.status(200).json({ message: "all publications", publications });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "it has ocurred an error", error: error });
  }
};

const get = async (req, res) => {
  try {
    const idCache = req.user.id.concat("publication");
    const publicationCache = await redisClient.get(idCache);
    if (publicationCache) {
      //console.log("devuelto de cache");
      return res.status(200).json(JSON.parse(publicationCache));
    }
    const userProfile = await UserModel.findById(req.user.id).populate("publications");
    const publications = userProfile.publications;
    if (publications.length == 0) {
      return res.status(400).json({message: "you don't have publications"})
    }
    //console.log("devuelto de db");

    // Realiza la operación de populate en las publicaciones para llenar los usuarios que comentan
    const populatedPublications = await PublicationModel
    .find({ _id: { $in: publications.map(p => p._id) } })
    .populate("comments.user");
    const cache = JSON.stringify({
      publications,
    });
    redisClient.set(idCache.valueOf(), cache, {
      EX: parseInt(process.env.REDIS_TTL),
    });
    return res.status(200).json({ publications });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const set = async (req, res) => {
  try {
    const idCache = req.user.id.concat("publication");
    const publicationCache = await redisClient.get(idCache);
    const { id, title, text } = req.body;
    const userLogged = await UserModel.findById({ _id: req.user.id });
    const publicationIndex = userLogged.publications.findIndex(
      (element) => element.toString() === id
    );
    if (publicationIndex === -1) {
      return res.status(400).json({message: "Publication not found"})
    }
    const updatedPublication = await PublicationModel.findOneAndUpdate(
      { _id: id },
      { title: title, text: text },
      { new: true } // Para obtener la publicación actualizada
    );
    if (publicationCache) {
      //si existe cache, sobreescribirla con la nueva informacion de publications
      const user = await userLogged.populate("publications");
      const publications = user.publications;
      const cache = JSON.stringify({
        publications,
      });
      redisClient.set(idCache.valueOf(), cache, {
        EX: parseInt(process.env.REDIS_TTL),
      });
    }
    return res
      .status(200)
      .json({ message: "publication edited", publication: updatedPublication });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const delet = async (req, res) => {
  try {
    const {id} = req.params;
    const userLogged = await UserModel.findById({ _id: req.user.id });
    const publicationIndex = userLogged.publications.findIndex(
      (element) => element.toString() === id
    );
    if (publicationIndex === -1) {
      return res.status(400).json({message: "Publication not found"})
    }
    await PublicationModel.findByIdAndDelete({ _id: id});
    return res.status(200).json({ message: "publication deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addLike = async(req, res) => {
  try {
    const publication = await PublicationModel.findById(req.body.id)
    const liked = publication.likes.some(item => item.toString() == req.user.id)
    if(liked){
      const updatedLikes = publication.likes.filter(item => item.toString() != req.user.id)
      publication.likes = updatedLikes;
      await publication.save()
      return res.status(201).json({message: "disliked"})
    }
    publication.likes.push(req.user.id)
    await publication.save()
    return res.status(201).json({ message: "liked" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const addComment = async(req,res) => {
  try {
    const publication = await PublicationModel.findById(req.body.id)
    const text = req.body.text
    const user = req.user.id
    const commentAdd = {
      text,
      user
    }
    publication.comments.push(commentAdd)
    publication.save()
    return res.status(201).json({message:"comment added successful"})
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
}

const setShow = async(req,res) => {
  try {
    const idPublication = req.body.id;
    const publication = await PublicationModel.findById(idPublication);
    if (!publication) {
      return res.status(404).json({ message: "Publication doesn't found" });
    }
    publication.show = !publication.show;
    await publication.save();
    return res.status(200).json({ message: "show change", updatedShowValue: publication.show });
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
}

const getOnePublication = async(req,res) => {
  try {
    const {id} = req.params
    const publication = await PublicationModel.findById(id)
    if(!publication) {
      return res.status(404).json({ message: "Publication doesn't found" });
    }
    
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
}

const deletComment = async(req,res) => {
  try {
    const {publicationId, commentId} = req.body
    const userLogged = await UserModel.findById({ _id: req.user.id });
    const publication = await PublicationModel.findById(publicationId)
    const comment = publication.comments.find(item => item._id.valueOf() === commentId)
    if(!comment){
      return res.status(403).json({ message: "comment don't found"});
    }
    const commentUser = publication.comments.find(item => item.user.valueOf() === userLogged._id.valueOf() && item._id.valueOf() === commentId);
    if(!commentUser){
      return res.status(403).json({ message: "comment don't found for the user"});
    }
    const updatePublication = publication.comments.filter(item => item._id.valueOf() != commentId)
    publication.comments = updatePublication
    await publication.save()
    return res.status(200).json({ message: "comment deleted"});
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
}

module.exports = { create, getAll, set, delet, get, addLike, addComment, setShow, getOnePublication, deletComment};
