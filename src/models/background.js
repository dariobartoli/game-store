const mongoose = require("../config/mongo");

const backgroundSchema = new mongoose.Schema({
    url: String,
    name: String,
}, {timestamps: true})

const BackgroundModel = mongoose.model('Background', backgroundSchema)

module.exports = BackgroundModel