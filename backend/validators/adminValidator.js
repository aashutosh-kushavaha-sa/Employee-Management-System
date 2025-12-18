const Joi = require('joi');
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  passwordConfirm: Joi.any().valid(Joi.ref('password')).required().messages({'any.only':'Passwords must match'})
});
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});
module.exports = { registerSchema, loginSchema };
