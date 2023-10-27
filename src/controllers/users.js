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
      .select("_id email firstName lastName publications messages cart")
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
    const { firstName, lastName, password, nickName } = req.body;
    const users = await UserModel.find();
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
    user = await UserModel.findByIdAndUpdate(id, updateFields, { new: true });
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
      return res.status(409).json({message: "request dont found"})
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
    const idUserRemove = req.body.id;
    const user = await UserModel.findById(userId);
    const userRemove = await UserModel.findById(idUserRemove);
    user.friends.map((friend) => {
      if (friend.valueOf() == idUserRemove) {
        user.friends = user.friends.filter(
          (friend) => friend.toString() != idUserRemove
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
