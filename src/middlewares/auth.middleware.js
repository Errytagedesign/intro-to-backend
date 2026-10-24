import jwt from "jsonwebtoken";

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user info to req.user
 */

const authenticate = (req, res, next) => {
  console.log({ req: req.headers.authorization });
  // Get token from Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication required. Please provide a valid token.",
    });
  }

  // Extract token (remove "Bearer " prefix)
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentication required. No token provided." });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key",
    );
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }

    console.error(error);
    res.status(500).json({ message: "Authentication error" });
  }
};

const authorize = (resource) => {
  return async (req, res, next) => {
    try {
      // Get the resource (post, comment, etc.) from database
      // This is just an example - you'd implement this per resource type
      const resourceDoc = await resource.findById(req.params.id);

      if (!resourceDoc) {
        return res.status(404).json({ message: "Resource not found" });
      }

      // Check if the current user is the author
      // This assumes the resource has an 'author' field with user ID
      if (resourceDoc.author.toString() !== req.user.userId) {
        return res.status(403).json({
          message:
            "Forbidden. You do not have permission to modify this resource.",
        });
      }

      // Attach resource to request for next middleware
      req.resource = resourceDoc;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Authorization error" });
    }
  };
};

export { authenticate, authorize };
