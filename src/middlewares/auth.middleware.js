import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiErrors.js";

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user info to req.user
 */

const verifyToken = (authHeader) => {
  if (!authHeader?.startsWith("Bearer ")) {
    throw ApiError.unauthorized(
      "Authentication required. Provide a Bearer token.",
    );
  }
  const token = authHeader.split(" ")[1];
  if (!token) throw ApiError.unauthorized("No token provided");
  return jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
};

const loadUser = async (decoded) => {
  const user = await User.findById(decoded.userId).select("-password");
  if (!user) throw ApiError.unauthorized("User no longer exists");
  return user;
};

const authenticate = async (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      ApiError.unauthorized(
        "Authentication required. Please provide a valid token.",
      ),
    );
  }

  // Extract token (remove "Bearer " prefix)
  const token = authHeader.split(" ")[1];

  if (!token) {
    return next(
      ApiError.unauthorized("Authentication required. No token provided."),
    );
  }

  try {
    const decoded = verifyToken(authHeader);

    req.user = await loadUser(decoded);
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(ApiError.unauthorized("Invalid token"));
    }
    if (error.name === "TokenExpiredError") {
      return next(ApiError.unauthorized("Token has expired"));
    }

    return next(ApiError.unauthorized("Authentication error"));
  }
};

const optionalAuthenticate = async (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  // Extract token (remove "Bearer " prefix)
  const token = authHeader.split(" ")[1];

  if (!token) {
    return next();
  }

  try {
    const decoded = verifyToken(authHeader);

    req.user = await loadUser(decoded);
    next();
  } catch (error) {
    return next();
  }
};

const authorize = (model) => {
  return async (req, res, next) => {
    try {
      // Get the resource (post, comment, etc.) from database
      // This is just an example - you'd implement this per resource type
      const resourceDoc = await model.findById(req.params.id);

      if (!resourceDoc) {
        return next(ApiError.notFound("Resource not found"));
      }

      // Check if the current user is the author
      // This assumes the resource has an 'author' field with user ID
      if (resourceDoc.author.toString() !== req.user.userId) {
        return next(
          ApiError.forbidden(
            "Forbidden. You do not have permission to modify this resource.",
          ),
        );
      }

      // Attach resource to request for next middleware
      req.resource = resourceDoc;
      next();
    } catch (error) {
      console.error(error);
      next(ApiError.internal("Authorization error"));
    }
  };
};

const authenticateAdmin = async (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      ApiError.unauthorized(
        "Authentication required. Please provide a valid token.",
      ),
    );
  }

  // Extract token (remove "Bearer " prefix)
  const token = authHeader.split(" ")[1];

  if (!token) {
    return next(
      ApiError.unauthorized("Authentication required. No token provided."),
    );
  }

  try {
    const decoded = verifyToken(authHeader);
    req.user = await loadUser(decoded);

    if (decoded.role !== "admin") {
      return next(ApiError.forbidden("Forbidden. Admins only."));
    }

    // req.user = decoded; // Already set above with loadUser
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(ApiError.unauthorized("Invalid token"));
    }
    if (error.name === "TokenExpiredError") {
      return next(ApiError.unauthorized("Token has expired"));
    }

    console.error(error);
    next(ApiError.internal("Authentication error"));
  }
};

// allow access if the authenticated user owns :id, or is an admin
const isSelfOrAdmin = (req, res, next) => {
  if (req.user.userId === req.params.id || req.user.role === "admin") {
    return next();
  }
  return next(
    ApiError.forbidden(
      "Forbidden. You do not have permission to access this resource.",
    ),
  );
};

const authorizeAdmin = (model) => {
  return async (req, res, next) => {
    try {
      // Get the resource (post, comment, etc.) from database
      // This is just an example - you'd implement this per resource type
      const adminDoc = await model.findById(req.params.userId);

      if (!adminDoc) {
        return next(ApiError.notFound("Admin not found"));
      }

      // Check if the current user is the author
      // This assumes the resource has an 'author' field with user ID
      if (adminDoc.role.toString() !== "admin") {
        return next(
          ApiError.forbidden(
            "Forbidden. You do not have permission to modify this resource.",
          ),
        );
      }

      // Attach resource to request for next middleware
      req.resource = adminDoc;
      next();
    } catch (error) {
      console.error(error);
      next(ApiError.internal("Authorization error"));
    }
  };
};

export {
  authenticate,
  authenticateAdmin,
  authorize,
  authorizeAdmin,
  isSelfOrAdmin,
  optionalAuthenticate,
};
