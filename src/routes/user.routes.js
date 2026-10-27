import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getAUser,
  updateUser,
} from "../controllers/user.controllers.js";
import {
  authenticate,
  authenticateAdmin,
  isSelfOrAdmin,
} from "../middlewares/auth.middleware.js";
import { getPostByUser } from "../controllers/post.controllers.js";

const router = Router();

router
  .route("/")
  .post(authenticateAdmin, createUser)
  .get(authenticateAdmin, getAllUsers); // this result into: User = /api/users while GET = /api/users
router
  .route("/:id")
  .get(authenticate, isSelfOrAdmin, getAUser)
  .patch(authenticate, isSelfOrAdmin, updateUser)
  .delete(authenticate, isSelfOrAdmin, deleteUser); // this result into: GET = /api/User/id, PATCH= /api/User/id, DELETE = /api/User/id
router.route("/:id/posts").get(authenticate, isSelfOrAdmin, getPostByUser);

export default router;
