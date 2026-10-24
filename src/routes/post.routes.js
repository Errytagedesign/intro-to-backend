import { Router } from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getAPost,
  updatePost,
} from "../controllers/post.controllers.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { Post } from "../models/post.model.js";

const router = Router();

router.route("/").post(authenticate, createPost).get(getAllPosts);
router
  .route("/:id")
  .get(getAPost)
  .patch(authenticate, authorize(Post), updatePost)
  .delete(authenticate, authorize(Post), deletePost);

export default router;
