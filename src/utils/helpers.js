export const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // anything not a letter/number → dash
    .replace(/^-+|-+$/g, ''); // trim leading/trailing dashes

export const ApiError = (error) => {
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return {
      statusCode: 409,
      message: `${field} already exists`,
    };
  }

  if (error.name === 'ValidationError') {
    return {
      statusCode: 400,
      message: Object.values(error.errors)
        .map((e) => e.message)
        .join(', '),
    };
  }

  if (error.name === 'CastError') {
    return {
      statusCode: 400,
      message: `Invalid ${error.path}: ${error.value}`,
    };
  }

  return { statusCode: 500, message: 'Internal server error' };
};

export const ApiResponse = ({ message, data }) => {
  return { error: false, message, data };
};

export const authorData = 'name username avatar';
