import { Post } from "../models/post.model.js";
import { ApiError, authorData } from "../utils/helpers.js";
import { sendSuccess } from "../utils/response.js";

const createPost = async (req, res) => {
  try {
    if (Object.values(req.body).some((v) => v === "")) {
      return res.status(400).json({
        message: "All field are required",
      });
    }

    const { author, ...safePost } = req.body;
    const post = await Post.create({ ...safePost, author: req.user.userId });

    await post.populate("author", authorData);

    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.log("Error", error);
    const { statusCode, message } = ApiError(error);
    res.status(statusCode).json({ error: true, message });
  }
};

const getAllPosts = async (req, res) => {
  const { page = 1, limit = 10, searchTerm = "" } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filter = {};

  if (searchTerm) {
    const escapedTerm = searchTerm
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = { $regex: escapedTerm, $options: "i" };

    filter.$or = [{ title: regex }, { subtitle: regex }, { body: regex }];
  }

  const [total, posts] = await Promise.all([
    Post.countDocuments(filter),
    Post.find(filter)
      .populate("author", authorData)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
  ]);

  const totalPages = Math.ceil(total / parseInt(limit));

  return sendSuccess(res, { posts }, "Fetched all post successfully", {
    statusCode: 200,
    meta: {
      total,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit),
    },
  });
};

const getAPost = async (req, res) => {
  const results = await Post.findById(req.params.id).populate(
    "author",
    authorData,
  );
  if (!results) {
    return res.status(404).json({ message: "Not found" });
  }

  return sendSuccess(res, { post: results }, "Fetched post successfully", {
    statusCode: 200,
  });
};

const getPostByUser = async (req, res) => {
  const results = await Post.find({ author: req.params.id }).populate(
    "author",
    authorData,
  );

  return sendSuccess(res, { posts: results }, "Fetched all post successfully", {
    statusCode: 200,
  });
};

const updatePost = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: "No data provided for update",
    });
  }

  const { title, subtitle, coverImage, body, slug, tag, status } = req.body;

  const safePost = { title, subtitle, coverImage, body, slug, tag, status };
  const post = await Post.findByIdAndUpdate(req.params.id, safePost, {
    returnDocument: "after",
    runValidators: true,
  });

  await post.populate("author", authorData);
  if (!post) {
    return res.status(404).json({ message: "Post Not found" });
  }

  return sendSuccess(res, { post }, "Post updated successfully", {
    statusCode: 200,
  });
};

const deletePost = async (req, res) => {
  const results = await Post.findByIdAndDelete(req.params.id);
  if (!results) {
    return res.status(404).json({ message: "Not found" });
  }
  return sendSuccess(res, {}, "Post deleted successfully", {
    statusCode: 200,
  });
};

export {
  createPost,
  deletePost,
  getAllPosts,
  getAPost,
  getPostByUser,
  updatePost,
};
