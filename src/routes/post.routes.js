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
import validate from "../middlewares/validate.middleware.js";
import { Post } from "../models/post.model.js";
import { asyncHandler } from "../utils/helpers.js";
import {
  idParamSchema,
  paginationQuerySchema,
} from "../validators/post.validator.js";

const router = Router();

router
  .route("/")
  .post(authenticate, asyncHandler(createPost))
  .get(validate({ query: paginationQuerySchema }), asyncHandler(getAllPosts));

router
  .route("/user/:id")
  .get(
    validate({ params: idParamSchema }),
    authenticate,
    asyncHandler(getPostByUser),
  );

router
  .route("/:id")
  .get(validate({ params: idParamSchema }), asyncHandler(getAPost))
  .patch(
    authenticate,
    validate({ params: idParamSchema }),
    authorize(Post),
    asyncHandler(updatePost),
  )
  .delete(
    authenticate,
    validate({ params: idParamSchema }),
    authorize(Post),
    asyncHandler(deletePost),
  );

export default router;
