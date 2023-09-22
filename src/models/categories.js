const mongoose = require("../config/mongo");

const categorySchema = new mongoose.Schema(
  {
    nameCategory: String,
    description: String,
  },
  { timestamps: true }
);

categorySchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
  },
});

const CategoryModel = mongoose.model("Categories", categorySchema);

module.exports = CategoryModel;
