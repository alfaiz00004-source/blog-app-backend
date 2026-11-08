const Comments = require("../models/commentsModel");
const Blogs = require("../models/blog");
const mongoose = require("mongoose");
const throwError = require("../utils/throwError");

async function createComment(req, res) {
  let session;
  let userComment;
  try {
    session = await mongoose.startSession();
    let { comment } = req.body;
    const blogId = req.params.blogId;

    await session.withTransaction(async () => {
      const blog = await Blogs.findById(blogId).session(session);
      if (!blog) {
        throwError("blog not found", 404);
      }
      const [createComment] = await Comments.create(
        [
          {
            createdBy: req.user.userId,
            comment: comment,
            blog: blogId,
          },
        ],
        { session },
      );
      userComment = createComment;
      await Blogs.findByIdAndUpdate(
        blogId,
        { $inc: { commentsCount: 1 } },
        { session },
      );
    });

    return res.status(201).json({
      message: "comment send successfully",
      comment: userComment,
    });
  } finally {
    await session.endSession();
  }
}

async function getComments(req, res) {
  const blogId = req.params.blogId;
  const comments = await Comments.find({ blog: blogId }).sort({createdAt:-1});
  return res.json(comments);
}

async function updateComment(req, res) {
  const { comment } = req.body;
  const userId = req.user.userId;
  if (!comment) {
    throwError("all field required to update comments", 400);
  }
  const blogId = req.params.blogId;
  const myCommentsId = req.params.commentId;
  const myComment = await Comments.findOneAndUpdate(
    { _id: myCommentsId, blog: blogId, createdBy: userId },
    { comment: comment },
  );
  if (!myComment) {
    throwError("comment not found or you are not authorized to update it", 403);
  }
  return res.status(200).json({
    message: "comment updated successfully",
    updatedComment: myComment
  });
}

async function deleteComment(req, res) {
  let session;
  try {
    session = await mongoose.startSession();
    const commentId = req.params.commentId;
    const userId = req.user.userId;
    const blogId = req.params.blogId;
    await session.withTransaction(async () => {
      const myComment = await Comments.findOneAndDelete({
        _id: commentId,
        createdBy: userId,
        blog: blogId,
      }).session(session);
      if (!myComment) {
        throwError("comment not found or user not authorized", 404);
      }
      await Blogs.findByIdAndUpdate(
        blogId,
        { $inc: { commentsCount: -1 } },
        { session },
      );
    });
    return res.json({ message: "comment deleted successfully" });
  } finally {
    await session.endSession();
  }
}

module.exports = { createComment, getComments, updateComment, deleteComment };
