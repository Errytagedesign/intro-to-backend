import { Post } from '../models/post.model.js';

const createPost = async (req, res) => {
  try {
    if (Object.values(req.body).some((v) => v === '')) {
      return res.status(400).json({
        message: 'All field are required',
      });
    }

    const post = await Post.create(req.body);

    res.status(201).json({
      message: 'Post created successfully',
      post,
    });
  } catch (error) {
    console.log('Error', error);
    res.status(500).json({
      message: 'Internal Server error',
      error,
    });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const results = await Post.find();
    res.status(200).json(results);
  } catch (error) {
    console.log('Error', error);
    res.status(500).json({
      message: 'Internal Server error',
      error,
    });
  }
};

const getAPost = async (req, res) => {
  try {
    const results = await Post.findById(req.params.id);
    if (!results) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.status(200).json(results);
  } catch (error) {
    console.log('Error', error);
    res.status(500).json({
      message: 'Internal Server error',
      error,
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const findPost = await Post.findById(req.params.id);
    if (!findPost) {
      return res.status(404).json({ message: 'Post Not found' });
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: 'No data provided for update',
      });
    }

    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json({
      message: 'Post updated successfully',
      post,
    });
  } catch (error) {
    console.log('Error', error);
    res.status(500).json({
      message: 'Internal Server error',
      error,
    });
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
    res.status(500).json({
      message: 'Internal Server error',
      error,
    });
  }
};

export { createPost, getAllPosts, getAPost, updatePost, deletePost };
