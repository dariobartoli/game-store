const mongoose = require('../config/mongo')

const publicationSchema = new mongoose.Schema({
    title: String,
    text: String,
    active: Boolean,
    images: Array,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: "Users"}],
    comments: [{
      text: String,
      user: {type: mongoose.Schema.Types.ObjectId, ref: "Users"}
    }],
  }, {timestamps: true});


  publicationSchema.set("toJSON", {
    transform: function (doc, ret) {
      delete ret.__v;
      delete ret.createdAt;
      delete ret.updatedAt;
      if (ret.user) {
        delete ret.user._id;
        delete ret.user.admin;
        delete ret.user.loginAuthorization;
        delete ret.user.publications;
      }
    },
  });
  
const PublicationModel = mongoose.model('Publications', publicationSchema);

module.exports = PublicationModel