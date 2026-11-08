const mongoose = require("mongoose");
const commentsSchema = new mongoose.Schema(
  {
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blogs",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

commentsSchema.index({ blog: 1, createdAt: -1 });
const Comments = mongoose.model("Comments", commentsSchema);

module.exports = Comments;
