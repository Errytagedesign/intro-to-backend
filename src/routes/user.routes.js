import { Router } from 'express';
import {
  createUser,
  deleteUser,
  getAllUsers,
  getAUser,
  updateUser,
} from '../controllers/user.controllers.js';
import { getPostByUser } from '../controllers/post.controllers.js';

const router = Router();

router.route('/').post(createUser).get(getAllUsers); // this result into: User = /api/users while GET = /api/users
router.route('/:id').get(getAUser).patch(updateUser).delete(deleteUser); // this result into: GET = /api/User/id, PATCH= /api/User/id, DELETE = /api/User/id
router.route('/:id/posts').get(getPostByUser);

export default router;
