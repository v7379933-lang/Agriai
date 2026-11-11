export const validateRequest = (schema) => (req, res, next) => {
  try {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed for request parameters',
        error: {
          code: 'VALIDATION_ERROR',
          details: parsed.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        }
      });
    }
    req.validatedBody = parsed.data;
    next();
  } catch (err) {
    next(err);
  }
};

