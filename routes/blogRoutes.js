const express = require("express");
const {
  createBlog,
  getBlogs,
  getOneBlog,
  updateBlog,
  deleteBlog,
  getMyBlogs,
  getMyLikedBlogs,
  getBlogsCount,
} = require("../controllers/blogController");
const { protection } = require("../middlewares/authMiddleware");
const {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} = require("../controllers/commentsController");
const { handleLikes } = require("../controllers/likesController");

const router = express.Router();
router.get("/myBlogs", protection, getMyBlogs);
router.get("/myLikedBlogs", protection, getMyLikedBlogs);
router.get("/totalBlogs",getBlogsCount);
router.post("/", protection, createBlog);
router.get("/", getBlogs);
router.get("/:blogId", protection, getOneBlog);
router.patch("/:blogId", protection, updateBlog);
router.delete("/:blogId", protection, deleteBlog);


//comments routes
router.post("/:blogId/comments", protection, createComment);
router.get("/:blogId/comments", protection, getComments);
router.patch("/:blogId/comments/:commentId", protection, updateComment);
router.delete("/:blogId/comments/:commentId", protection, deleteComment);

//likes routes
router.post("/:blogId/likes", protection, handleLikes);

module.exports = router;
