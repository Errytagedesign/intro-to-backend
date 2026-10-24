import { Router } from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getAPost,
  updatePost,
} from "../controllers/post.controllers.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(authenticate, createPost).get(getAllPosts);
router
  .route("/:id")
  .get(getAPost)
  .patch(authenticate, updatePost)
  .delete(authenticate, deletePost);

export default router;
