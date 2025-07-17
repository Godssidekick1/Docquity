const validate = (schema) => async (req, res, next) => {
  try {
    // Validate both req.params and req.body
    await schema.parseAsync({ params: req.params, body: req.body });
    return next();
  } catch (error) {
    return res.status(400).json({
      error: "Validation failed",
      details: error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }))
    });
  }
};

module.exports = { validate };