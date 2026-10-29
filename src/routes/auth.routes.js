import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { asyncHandler } from "../utils/helpers.js";
import {
  register,
  login,
  loginAdmin,
  currentUser,
} from "../controllers/auth.controllers.js";

const router = Router();

// 📝 Register a new user
router.post(
  "/register",
  validate({ body: registerSchema }),
  asyncHandler(register),
);

// 🔑 Login user
router.post("/login", validate({ body: loginSchema }), asyncHandler(login));

// 🔑 Login admin
router.post(
  "/admin/login",
  validate({ body: loginSchema }),
  asyncHandler(loginAdmin),
);

// 👤 Get current user (protected route)
router.get("/me", authenticate, asyncHandler(currentUser));

export default router;
