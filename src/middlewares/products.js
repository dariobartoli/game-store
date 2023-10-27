const Joi = require("joi");

const productLogger = (req, res, next) => {
  //console.log("it go for products");
  next();
};

const dataValidation = (req, res, next) => {
  const schema = Joi.object({
    gameName: Joi.string().min(3).max(60).required(),
    description: Joi.string().min(1).max(500).required(),
    category: Joi.alternatives().try(
      Joi.array().items(Joi.string().alphanum()).required(),
      Joi.string().alphanum().required()
    ),
    developer: Joi.string().required(),
    publisher: Joi.string().required(),
    'variant[0].edition': Joi.string().required(),
    'variant[0].price': Joi.number().positive().required(),
    'variant[1].edition': Joi.string(),
    'variant[1].price': Joi.number().positive(),
    'variant[2].edition': Joi.string(),
    'variant[2].price': Joi.number().positive(),
  });
  const validationResult = schema.validate(req.body, {
    allowUnknown: true, // Permitir campos no especificados en el esquema variant[1], variant[0], etc
  });
  if (validationResult.error) {
    res
      .status(404)
      .json({ message: validationResult.error.details[0].message });
    console.error(validationResult.error.details);
  } else {
    //console.log("Data is valid");
    next();
  }
};

const isAlphaNum = (req, res, next) => {
  const schema = Joi.string().alphanum().required();
  const validationResult = schema.validate(req.params.id);
  if (validationResult.error) {
    res
      .status(404)
      .json({ message: validationResult.error.details[0].message });
    console.error(validationResult.error.details);
  } else {
    //console.log("Data is valid");
    next();
  }
};

module.exports = { dataValidation, productLogger, isAlphaNum };
