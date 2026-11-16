import { Router } from "express";
import {
  createComment,
  getCommentsByPostId,
} from "../controllers/comment.controllers.js";
import { optionalAuthenticate } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { asyncHandler } from "../utils/helpers.js";
import {
  commentSchema,
  idParamSchema,
  paginationQuerySchema,
} from "../validators/post.validator.js";

const router = Router();

router.post(
  "/posts/:id/comments",
  optionalAuthenticate,
  validate({ params: idParamSchema, body: commentSchema }),
  asyncHandler(createComment),
);

router.get(
  "/posts/:id/comments",
  optionalAuthenticate,
  validate({ params: idParamSchema, query: paginationQuerySchema }),
  asyncHandler(getCommentsByPostId),
);

export default router;
