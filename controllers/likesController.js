const mongoose = require("mongoose");
const Likes = require("../models/likesModel");
const Blogs = require("../models/blog");
const throwError = require("../utils/throwError");

async function handleLikes(req, res) {
  const session = await mongoose.startSession();
  try {
    const userId = req.user.userId;
    const blogId = req.params.blogId;
    let responseData;
    await session.withTransaction(async () => {
      const isLiked = await Likes.exists({
        blog: blogId,
        user: userId,
      }).session(session);
      if (isLiked) {
        const removeLike = await Likes.deleteOne(
          { blog: blogId, user: userId },
          { session },
        );
        if (removeLike.deletedCount !== 1) {
          throwError("Failed to remove like", 500);
        }
        const updateBlog = await Blogs.findOneAndUpdate(
          { _id: blogId },
          { $inc: { totalLikes: -1 } },
          { session, returnDocument: "after" },
        );
        if (!updateBlog) {
          throwError("Failed to update like count", 500);
        }
        responseData = {
          message: "Blog unliked successfully",
          isLiked: false,
          totalLikes: updateBlog.totalLikes,
        };
      } else {
        await Likes.create([{ blog: blogId, user: userId }], {
          session,
        });

        const updateBlog = await Blogs.findByIdAndUpdate(
          blogId,
          {
            $inc: { totalLikes: 1 },
          },
          { session, returnDocument: "after" },
        );
        if (!updateBlog) {
          throwError("Failed to update like count", 500);
        }

        responseData = {
          message: "Blog liked successfully",
          isLiked: true,
          totalLikes: updateBlog.totalLikes,
        };
      }
    });
    return res.status(200).json(responseData);
  } finally {
    await session.endSession();
  }
}

module.exports = { handleLikes };
