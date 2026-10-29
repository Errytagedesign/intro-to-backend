import express from "express";
import cors from "cors";
import postRouter from "./routes/post.routes.js";
import userRouter from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import {
  notFoundHandler,
  errorHandler,
} from "./middlewares/error.middleware.js";

const app = express();

// 🌍 CORS — allow your frontend origin(s)
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS policy: origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🩺 Health check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    data: { status: "OK", timestamp: new Date().toISOString() },
  });
});

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRoutes);

// 🚫 404 (after routes) + 💥 centralized error handler (last)
app.use(notFoundHandler);
app.use(errorHandler);
export default app;
