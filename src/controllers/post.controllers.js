import { Post } from '../models/post.model.js';
import { ApiError, authorData } from '../utils/helpers.js';

const createPost = async (req, res) => {
  try {
    if (Object.values(req.body).some((v) => v === '')) {
      return res.status(400).json({
        message: 'All field are required',
      });
    }
    const { author, ...safePost } = req.body;
    const post = await Post.create(safePost);

    res.status(201).json({
      message: 'Post created successfully',
      post,
    });
  } catch (error) {
    console.log('Error', error);
    const { statusCode, message } = ApiError(error);
    res.status(statusCode).json({ error: true, message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const results = await Post.find().populate('author', authorData);
    res.status(200).json({
      message: 'Fetched all post successfully',
      posts: results,
    });
  } catch (error) {
    console.log('Error', error);
    const { statusCode, message } = ApiError(error);
    res.status(statusCode).json({ error: true, message });
  }
};

const getAPost = async (req, res) => {
  try {
    const results = await Post.findById(req.params.id).populate(
      'author',
      authorData,
    );
    if (!results) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.status(200).json(results);
  } catch (error) {
    console.log('Error', error);
    const { statusCode, message } = ApiError(error);
    res.status(statusCode).json({ error: true, message });
  }
};

const getPostByUser = async (req, res) => {
  try {
    const results = await Post.find({ author: req.params.id }).populate(
      'author',
      authorData,
    );

    res.status(200).json(results);
  } catch (error) {
    console.log('Error', error);
    const { statusCode, message } = ApiError(error);
    res.status(statusCode).json({ error: true, message });
  }
};

const updatePost = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: 'No data provided for update',
      });
    }

    const { title, subtitle, coverImage, body, slug, tag, status } = req.body;

    const safePost = { title, subtitle, coverImage, body, slug, tag, status };
    const post = await Post.findByIdAndUpdate(req.params.id, safePost, {
      new: true,
      runValidators: true,
    });
    if (!post) {
      return res.status(404).json({ message: 'Post Not found' });
    }

    res.status(200).json({
      message: 'Post updated successfully',
      post,
    });
  } catch (error) {
    console.log('Error', error);
    const { statusCode, message } = ApiError(error);
    res.status(statusCode).json({ error: true, message });
  }
};

const deletePost = async (req, res) => {
  try {
    const results = await Post.findByIdAndDelete(req.params.id);
    if (!results) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.status(200).json({
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.log('Error', error);
    const { statusCode, message } = ApiError(error);
    res.status(statusCode).json({ error: true, message });
  }
};

export {
  createPost,
  getAllPosts,
  getAPost,
  updatePost,
  deletePost,
  getPostByUser,
};
