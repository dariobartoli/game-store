const Joi = require("joi");

const dataValidation = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(30).required(),
    text: Joi.string().min(10).required(),
  });
  const validationResult = schema.validate(req.body);
  if (validationResult.error) {
    res
      .status(404)
      .json({ message: validationResult.error.details[0].message });
    console.error(validationResult.error.details);
  } else {
    console.log("Data is valid");
    next();
  }
};

const commentValidation = (req, res, next) => {
  const schema = Joi.object({
    text: Joi.string().min(3).max(300).required(),
    id: Joi.string().alphanum().required()
  })
  const validationResult = schema.validate(req.body);
  if (validationResult.error) {
    res
      .status(404)
      .json({ message: validationResult.error.details[0].message });
    console.error(validationResult.error.details);
  } else {
    console.log("Data is valid");
    next();
  }
}

module.exports = { dataValidation, commentValidation};
