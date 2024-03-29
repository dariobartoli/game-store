const UserModel = require("../models/users");
const redisClient = require("../config/redis");
const bcrypt = require("bcrypt");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
require("dotenv").config();

const getAll = async (req, res) => {
  try {
    let users = await UserModel.find();
    return res.status(200).json({ message: "all users", users: users });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message });
  }
};

const get = async (req, res) => {
  try {
    const userCache = await redisClient.get(req.user.id); //busco en redis si ese id existe, si no devuelve null
    if (userCache) {
      console.log("devuelvo de cache");
      return res
        .status(200)
        .json({ message: "user data:", user: JSON.parse(userCache) });
    }
    console.log("devuelto de bd");
    let user = await UserModel.findOne({ _id: req.user.id })
      .select("_id email firstName lastName publications profileImage messages wishlist nickName wallet friends games reviews friendsRequest background description cart")
      .populate("cart");
    redisClient.set(req.user.id.valueOf(), JSON.stringify(user), {
      EX: parseInt(process.env.REDIS_TTL),
    }); //guardar en cache si no está
    return res.status(200).json({ message: "user data:", user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message });
  }
};

const getOneUser = async(req,res) => {
  try {
    const {id} = req.params
    let user =  await UserModel.findById(id)
    return res.status(200).json({message:"user", user: user})
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
}

const set = async (req, res) => {
  try {
    const id = req.user.id;
    const image = req.file;
    const { firstName, lastName, password, nickName, description } = req.body;
    const users = await UserModel.find();
    if(nickName != undefined){
      const filterNick = users.some((item) => {
        // Verifica si item.nickName está definido y es una cadena
        if (item.nickName && typeof item.nickName === "string") {
          return item.nickName.toLowerCase() === nickName.toLowerCase();
        }
        // Si item.nickName no está definido o no es una cadena, no realiza la comparación
        return false;
      });
      if (filterNick) {
        return res.status(409).json({message: "this nickname is already in use"})
      }
    }
    let urlImage = "";
    if (image) {
      await cloudinary.uploader.upload(image.path, function (error, result) {
        if (error) {
          throw new Error(error);
        } else {
          urlImage = result.url; // Result contiene la información sobre la imagen cargada
        }
      });
      fs.unlink(image.path, (err) => {
        if (err) {
          throw new Error(err);
        } else {
          //console.log("Archivo local eliminado con éxito.");
        }
      });
    }
    if(firstName == "" && lastName == "" && password == "" && nickName == "" && description == "" && urlImage == ""){
      throw new Error('Invalid data')
    }
    if(nickName.length > 25){
      throw new Error('"nickName" length must be less than or equal to 25 characters long')
    }
    if(description.length > 250){
      throw new Error('"description" length must be less than or equal to 250 characters long')
    }

    updateFields = {};
    if (firstName) {
      updateFields.firstName = firstName;
    }
    if (lastName) {
      updateFields.lastName = lastName;
    }
    if (nickName) {
      updateFields.nickName = nickName;
    }
    if (password) {
      let passwordHashed = await bcrypt.hash(password, 10);
      updateFields.password = passwordHashed;
    }
    if (urlImage) {
      updateFields.profileImage = urlImage;
    }
    if (description) {
      updateFields.description = description;
    }
    const user = await UserModel.findByIdAndUpdate(id, updateFields, { new: true });
    redisClient.set(req.user.id.valueOf(), JSON.stringify(user), {
      EX: parseInt(process.env.REDIS_TTL),
    }); //actualizamos la cache
    return res.status(200).json({ message: "user modify", user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addFriend = async (req, res) => {
  try {
    const userId = req.user.id;
    const idFriend = req.body.id;
    if (userId == idFriend) {
      return res.status(403).json({message: "dont possible execute this action"})
    }
    const userFriend = await UserModel.findById(idFriend);
    for (const element of userFriend.friendsRequest) {
      if (element == userId) {
        return res.status(400).json({message: "you have already sended this request to this user"})
      }
    }
    for (const element of userFriend.friends) {
      if (element.valueOf() == userId) {
        return res.status(400).json({message: "this user already is your friend"})
      }
    }
    userFriend.friendsRequest.push(userId);
    userFriend.save();
    return res.status(201).json({ message: "friend request sent" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const responseRequest = async (req, res) => {
  try {
    const { id, response } = req.body;
    if (req.user.id == id) {
      return res.status(403).json({message: "dont possible execute this action"})
    }
    const user = await UserModel.findById(req.user.id);
    const userFriend = await UserModel.findById(id);
    const exists = user.friendsRequest.filter(
      (request) => request.toString() == id
    );
    if (exists.length == 0) {
      return res.status(409).json({message: "request don't found"})
    }
    if (response) {
      user.friends.push(userFriend);
      userFriend.friends.push(user);
      user.friendsRequest = user.friendsRequest.filter(
        (request) => request.toString() !== id
      );
      await Promise.all([userFriend.save(), user.save()]);
      return res.status(201).json({ message: "user added to your friends" });
    } else {
      user.friendsRequest = user.friendsRequest.filter(
        (request) => request.toString() !== id
      );
      await user.save();
      return res.status(200).json({ message: "request to friend reject" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const removeFriend = async (req, res) => {
  try {
    const userId = req.user.id;
    const {id} = req.params;
    const user = await UserModel.findById(userId);
    const userRemove = await UserModel.findById(id);
    user.friends.map((friend) => {
      if (friend.valueOf() == id) {
        user.friends = user.friends.filter(
          (friend) => friend.toString() != id
        );
        userRemove.friends = userRemove.friends.filter(
          (friend) => friend.toString() != userId
        );
        Promise.all([user.save(), userRemove.save()]);
        return res.status(200).json({
          message: "the user has been removed of your list of friends",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getAll, get, set, addFriend, responseRequest, removeFriend, getOneUser };
