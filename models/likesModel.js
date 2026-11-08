const mongoose = require("mongoose");

const likesSchema = new mongoose.Schema({
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blogs",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
});

likesSchema.index({ blog: 1, user: 1 }, { unique: true });
const Likes = mongoose.model("Likes", likesSchema);

module.exports = Likes;
