const mongoose = require("../config/mongo");

const reviewSchema = new mongoose.Schema(
  {
    idGame: String,
    text: String,
    recommended: Boolean,
    userId: String,
    aprobado: {type: Boolean, default: false}
  },
  { timestamps: true }
);

reviewSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
  },
});

const ReviewModel = mongoose.model("Reviews", reviewSchema);

module.exports = ReviewModel;
