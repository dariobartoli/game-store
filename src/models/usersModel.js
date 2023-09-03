const mongoose = require('../config/mongo')

const userSchema = new mongoose.Schema({
    userName: String,
    lastName: String,
    email: String,
    password: String,
})

const User = mongoose.model('users', userSchema)

async function add(data){
    try {
        const newUser = new User(data)
        newUser.save()
        return newUser
    } catch (error) {
        throw (`impossible create a user ${error}`)
    }
}

async function getAll(){
    try {
        const users = await User.find({})
        return users
    } catch (error) {
        throw (`impossible get users ${error}`)
    }
}


module.exports = {add, getAll}