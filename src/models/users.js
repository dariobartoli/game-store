const mongoose = require("../config/mongo");
const bcrypt = require("bcrypt")
require('dotenv').config();

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, required: true, index: { unique: true } },
    password: {type: String, required: true, select: false},
    publications: [{
      publication: Object,
    }],
    admin: Boolean,
    loginAuthorization: Boolean,
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  transform: function (doc, ret) {
    // Excluir los campos created_at y updated_at del resultado JSON
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
  },
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password); //this.password, la contraseña guardada en el objeto
}

const UserModel = mongoose.model("Users", userSchema);

module.exports = UserModel;
