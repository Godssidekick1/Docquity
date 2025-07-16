const validate = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
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

module.exports = {
  validate
}; 