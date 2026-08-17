import { Router } from 'express';
import {
  createUser,
  deleteUser,
  getAllUsers,
  getAUser,
  updateUser,
} from '../controllers/user.controllers.js';

const router = Router();

router.route('/').post(createUser).get(getAllUsers); // this result into: User = /api/Users while GET = /api/Users
router.route('/:id').get(getAUser).patch(updateUser).delete(deleteUser); // this result into: GET = /api/User/id, PATCH= /api/User/id, DELETE = /api/User/id

export default router;
