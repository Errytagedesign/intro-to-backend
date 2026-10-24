import express from "express";
import cors from "cors";
import postRouter from "./routes/post.routes.js";
import userRouter from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRoutes);

export default app;
