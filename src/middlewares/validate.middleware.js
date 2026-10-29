import ApiError from "../utils/ApiErrors.js";

/**
 * Zod validation middleware factory.
 *
 * Usage:
 *   router.post('/', validate({ body: createPostSchema }), handler)
 *   router.get('/', validate({ query: listPostsQuerySchema }), handler)
 *   router.get('/:id', validate({ params: idParamSchema }), handler)
 *
 * On success, replaces req.body / req.query / req.params with the
 * parsed (typed & sanitized) values, so handlers can trust them.
 */
const validate = (schemas) => (req, res, next) => {
  try {
    for (const key of ["body", "query", "params"]) {
      if (schemas[key]) {
        const result = schemas[key].safeParse(req[key]);
        if (!result.success) {
          const details = result.error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          }));
          return next(ApiError.badRequest("Validation failed", details));
        }
        // Overwrite with parsed values (defaults/coercions applied)
        req[key] = result.data;
      }
    }
    next();
  } catch (err) {
    next(err);
  }
};

export default validate;
