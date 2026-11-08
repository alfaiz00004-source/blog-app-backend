const Blogs = require("../models/blog");
const Likes = require("../models/likesModel");
const mongoose = require("mongoose");
const Comments = require("../models/commentsModel");
const throwError = require("../utils/throwError");

async function createBlog(req, res) {
    const { title, blog } = req.body;
    if (!title || !blog) {
      throwError("All fields are required",400)
    }
    const myblog = await Blogs.create({
      title: title,
      blog: blog,
      createdBy: req.user.userId,
    });
    res.status(201).json({
      message: "blog created successfully",
      blog: myblog,
    });
  
}

async function getBlogsCount(req,res) {
  const totalBlogs = await Blogs.countDocuments();
  return res.json({totalBlogs:totalBlogs,
    limit:10
  });
}

async function getBlogs(req, res) {  
  const pages = parseInt(req.query.pages);
  const limit = req.query.limit || 10;
  const skip = (pages-1)*limit || 0;

    const blogs = await Blogs.find().populate("createdBy", "email").skip(skip).limit(limit).sort({updatedAt:-1});
    return res.json(blogs);
    
}

async function getOneBlog(req, res) {
    const blogId = req.params.blogId;
    const blog = await Blogs.findById(blogId).populate("createdBy", "email");

    if (!blog) {
      throwError("blog not found",404);
    }
    return res.json(blog);

}

async function updateBlog(req, res) {

    const { title, blog } = req.body;
    const blogId = req.params.blogId;
    const userId = req.user.userId;

    let updateFields = {};
    if (title !== undefined) {
      updateFields.title = title;
    }
    if (blog !== undefined) {
      updateFields.blog = blog;
    }

    if (Object.keys(updateFields).length === 0) {
      throwError("Please provide title or blog content to update",400)
    }
    const myBlog = await Blogs.findOneAndUpdate(
      { _id: blogId, createdBy: userId },
      {
        $set: updateFields,
      },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!myBlog) {
      throwError("Blog not found or you are not authorized to update it",403)
    }
    return res.status(200).json({
      message: "Blog updated sucessfully",
      blog: myBlog,
    });
}

async function deleteBlog(req, res) {
  let session;
  try {
    session = await mongoose.startSession();
    const blogId = req.params.blogId;
    const userId = req.user.userId;
    await session.withTransaction(async () => {
      const myBlog = await Blogs.findOneAndDelete({
        _id: blogId,
        createdBy: userId,
      }).session(session);
      if (!myBlog) {
        throwError("Blog not found or you are not authorized to delete it",403)
      }
      const totalLikes = myBlog.totalLikes;
      const totalComments = myBlog.commentsCount;
      if (totalComments > 0) {
        await Comments.deleteMany({ blog: blogId }, { session });
      }
      if (totalLikes > 0) {
        await Likes.deleteMany({ blog: blogId }, { session });
      }
    });

    return res.status(200).json({
      message: "Blog deleted sucessfully",
    });
  }  finally {
    await session.endSession();
  }
}

async function getMyBlogs(req, res) {
    const me = req.user.userId;
    const myBlogs = await Blogs.find({ createdBy: me }).populate(
      "createdBy",
      "email",
    ).sort({updatedAt:-1});
    if (!myBlogs) {
      throwError("your blogs not found",404)
    }
    return res.json(myBlogs);
  
}

async function getMyLikedBlogs(req, res) {
    const userId = req.user.userId;
    const likes = await Likes.find({ user: userId }).populate({
      path: "blog",
      populate: {
        path: "createdBy",
        select: "email",
      },
    }).sort({updatedAt:-1});
    const blogs = likes.map((like) => like.blog).filter(Boolean);
    res.json(blogs);
}
module.exports = {
  createBlog,
  getBlogsCount,
  getBlogs,
  getOneBlog,
  updateBlog,
  deleteBlog,
  getMyBlogs,
  getMyLikedBlogs,
};
