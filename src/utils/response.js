/**
 * Standard success response shape used across every endpoint.
 *
 * {
 *   success: true,
 *   data: <payload>,
 *   meta: <optional metadata like pagination>
 * }
 */
export const sendSuccess = (
  res,
  data,
  message,
  { statusCode = 200, meta = null } = {},
) => {
  const body = { success: true, message, data };
  if (meta) body.data.meta = meta;
  return res.status(statusCode).json(body);
};
