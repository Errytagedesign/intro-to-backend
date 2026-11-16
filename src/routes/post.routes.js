import { Router } from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getAPost,
  getPostByUser,
  updatePost,
} from "../controllers/post.controllers.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { Post } from "../models/post.model.js";
import { asyncHandler } from "../utils/helpers.js";

const router = Router();

router
  .route("/")
  .post(authenticate, createPost)
  .get(asyncHandler(getAllPosts))
  .get(authenticate, asyncHandler(getPostByUser));
router
  .route("/:id")
  .get(asyncHandler(getAPost))
  .patch(authenticate, authorize(Post), asyncHandler(updatePost))
  .delete(authenticate, authorize(Post), asyncHandler(deletePost));

export default router;
