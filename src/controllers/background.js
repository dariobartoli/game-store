const BackgroundModel = require('../models/background')
const UserModel = require('../models/users')
const redisClient = require("../config/redis")




const addBackground = async(req,res) => {
    try {
        const {url, name} = req.body
        const backgrounds = await BackgroundModel.find()
        const backfilter = backgrounds.filter((item) => item.name.toLowerCase() == name.toLowerCase())
        if(backfilter.length > 0){
            throw new Error("background already exists")
        }
        let newBackground = new BackgroundModel(req.body)
        await newBackground.save()
        return res.status(201).json({message: 'background added', newBackground})
    } catch (error) {
        return res.status(500).json({ message: error.message});
    }
}

const changeBackground = async(req, res) => {
    try {
        const nameBg = req.body.name
        const user = await UserModel.findById(req.user.id)
        const background = await BackgroundModel.find({name: nameBg})
        console.log(background);
        user.background = background[0].url
        await user.save()
        redisClient.set(req.user.id.valueOf(), JSON.stringify(user), {
            EX: parseInt(process.env.REDIS_TTL),
        }); //actualizar la cache del usuario
        return res.status(201).json({message: 'background changed', background})
    } catch (error) {
        return res.status(500).json({ message: error.message});
    }
}

module.exports = {addBackground, changeBackground}