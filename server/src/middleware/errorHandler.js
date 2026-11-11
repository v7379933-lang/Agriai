export const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${req.method} ${req.url}:`, err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An internal server error occurred';

  res.status(statusCode).json({
    success: false,
    message,
    data: null,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      details: err.details || null
    }
  });
};

