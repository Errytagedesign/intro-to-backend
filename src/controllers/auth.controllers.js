import { User } from "../models/user.model.js";
import { ApiError } from "../utils/helpers.js";
import jwt from "jsonwebtoken";
import { sendSuccess } from "../utils/response.js";

const register = async (req, res) => {
  const { email } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser)
    throw ApiError.conflict("User already exists with this email");

  if (req.body.role === "admin") {
    throw ApiError.badRequest("Cannot register with admin role.");
  }

  // Create user (password will be hashed by pre('save') hook)
  const user = new User(req.body);
  await user.save();

  // Generate token
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "7d" },
  );

  return sendSuccess(
    res,
    {
      token,
      user: user.toJSON(),
    },
    "User registered successfully",
    { statusCode: 201 },
  );
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Find user by email and include password for verification
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw ApiError.unauthorized("Invalid credentials");

  // Check password using the model method
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized("Invalid credentials");
  }

  // Generate JWT
  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "7d" },
  );

  return sendSuccess(
    res,
    {
      token,
      user: user.toJSON(),
    },
    "Login successful",
    { statusCode: 200 },
  );
};

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  // Find user by email and include password for verification
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw ApiError.unauthorized("Invalid credentials");
  }
  if (user.role !== "admin")
    throw ApiError.unauthorized("You are not an authorized admin");

  // Check password using the model method
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized("Invalid credentials");
  }

  // Generate JWT
  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "7d" },
  );
  return sendSuccess(
    res,
    {
      token,
      user: user.toJSON(),
    },
    "Login successful",
    { statusCode: 200 },
  );
};

const currentUser = async (req, res) => {
  // req.user is attached by authenticate middleware
  const user = await User.findById(req.user.userId).select("-password");
  if (!user) throw ApiError.notFound("User not found");

  return sendSuccess(
    res,
    {
      user: user.toJSON(),
    },
    "User fetched successfully",
    { statusCode: 200 },
  );
};

export { register, login, loginAdmin, currentUser };
