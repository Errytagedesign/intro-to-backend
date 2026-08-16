import { Router } from 'express';
import {
  createPost,
  deletePost,
  getAllPosts,
  getAPost,
  updatePost,
} from '../controllers/post.controllers.js';

const router = Router();

router.route('/').post(createPost).get(getAllPosts); // this result into: POST = /api/posts while GET = /api/posts
router.route('/:id').get(getAPost).patch(updatePost).delete(deletePost); // this result into: GET = /api/post/id, PATCH= /api/post/id, DELETE = /api/post/id

export default router;
