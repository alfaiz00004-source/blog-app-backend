const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    blog: {
      type: String,
      required: true,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    totalLikes: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { timestamps: true },
);

blogSchema.index({ createdBy: 1 });
const Blogs = mongoose.model("Blogs", blogSchema);

module.exports = Blogs;
