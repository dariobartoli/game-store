const mongoose = require("../config/mongo");
const bcrypt = require("bcrypt");
const redisClient = require("../config/redis");
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

/* userSchema.pre('save', async function(next) {
  let user = this;
  if (!user.isModified('password')) return next();
  const salt = await bcrypt.genSaltSync(parseInt(process.env.SALT));
  const passwordHashed = await bcrypt.hash(user.password, salt)
  user.password = passwordHashed;
  next();
}); */
userSchema.post('save', function(doc, next){
  const user = JSON.stringify({
    id: doc._id,
    firstName: doc.firstName,
    lastName: doc.lastName,
    email: doc.email,
    publications: doc.publications
  })
  redisClient.set(doc._id.valueOf(), user, {EX: parseInt(process.env.REDIS_TTL)})
  next();
})



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
