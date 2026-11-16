import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import { ApiError, authorData } from "../utils/helpers.js";
import { sendSuccess } from "../utils/response.js";

const createComment = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    throw ApiError.notFound("Post not found");
  }

  const comment = await Comment.create({
    post: post._id,
    author: req.user ? req.user.userId : null,
    content: req.body.content,
  });

  await Post.updateOne({ _id: post._id }, { $inc: { commentsCount: 1 } });

  return sendSuccess(res, { comment }, "Comment created successfully", {
    statusCode: 201,
  });
};

const getCommentsByPostId = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    throw ApiError.notFound("Post not found");
  }

  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const [total, comments] = await Promise.all([
    Comment.countDocuments({ post: post._id }),
    Comment.find({ post: post._id })
      .populate("author", authorData)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
  ]);

  const totalPages = Math.ceil(total / limit);

  return sendSuccess(res, { comments }, "Fetched all comments successfully", {
    statusCode: 200,
    meta: {
      total,
      totalPages,
      currentPage: page,
      limit: limit,
    },
  });
};

export { createComment, getCommentsByPostId };
