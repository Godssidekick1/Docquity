// const validateRequest = (schema) => async (req, res, next) => {
//   try {
//     //validating data against schema
//     await schema.parseAsync(req.body);
//     //if pass, move to validation
//     next();
//   } catch (error) { //if fail:
//     return res.status(400).json({
//       error: 'Validation failed',
//       details: error.errors.map(err => ({
//         path: err.path.join('.'),
//         message: err.message
//       }))
//     });
//   }
// };

// module.exports = validateRequest; 