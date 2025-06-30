// const validate = (schema) => async (req, res, next) => {
//   try {
//     // Validate only req.body
//     await schema.parseAsync(req.body);
//     return next();
//   } catch (error) {
//     return res.status(400).json({
//       error: "Validation failed",
//       details: error.errors.map(err => ({
//         path: err.path.join('.'),
//         message: err.message
//       }))
//     });
//   }
// };

// module.exports = { validate };