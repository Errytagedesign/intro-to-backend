import { User } from '../models/user.model.js';
import { ApiError } from '../utils/helpers.js';

const createUser = async (req, res) => {
  try {
    if (Object.values(req.body).some((v) => v === '')) {
      return res.status(400).json({
        message: 'All field are required',
      });
    }

    const user = await User.create(req.body);
    const { password, ...safeUser } = user.toObject();
    res
      .status(201)
      .json({ message: 'User created successfully', user: safeUser });
  } catch (error) {
    console.log('Error', error);
    const { statusCode, message } = ApiError(error);
    res.status(statusCode).json({ error: true, message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const results = await User.find();
    res.status(200).json({
      message: 'Fetched all users successfully',
      status: 200,
      error: false,
      posts: results,
    });
  } catch (error) {
    console.log('Error', error);
    const { statusCode, message } = ApiError(error);
    res.status(statusCode).json({ error: true, message });
  }
};

const getAUser = async (req, res) => {
  try {
    const results = await User.findById(req.params.id);
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

const updateUser = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: 'No data provided for update',
      });
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ message: 'User Not found' });
    }

    res.status(200).json({
      message: 'User updated successfully',
      user,
    });
  } catch (error) {
    console.log('Error', error);
    const { statusCode, message } = ApiError(error);
    res.status(statusCode).json({ error: true, message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const results = await User.findByIdAndDelete(req.params.id);
    if (!results) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.status(200).json({
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.log('Error', error);
    const { statusCode, message } = ApiError(error);
    res.status(statusCode).json({ error: true, message });
  }
};

export { createUser, getAllUsers, getAUser, updateUser, deleteUser };
