const Joi = require('joi');
const employeeCreateSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  age: Joi.number().integer().min(16).max(100).required(),
  gender: Joi.string().valid('Male','Female','Other').required(),
  email: Joi.string().email().required(),
  position: Joi.string().required(),
  department: Joi.string().required(),
  salary: Joi.number().min(0).required()
});
module.exports = { employeeCreateSchema };
