const mongoose = require('../config/mongo')

const userSchema = new mongoose.Schema({
    userName: String,
    lastName: String,
    email: String,
    password: String,
}, {timestamps: true})

const UserModel = mongoose.model('users', userSchema)

module.exports = UserModel