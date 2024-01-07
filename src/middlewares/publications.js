const Joi = require("joi");

const dataValidation = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(30).required(),
    text: Joi.string().min(10).max(500).required(),
    images: Joi.array() // Definimos un arreglo para las imágenes
      .min(1) // Al menos una imagen es requerida
      .max(1)
      .items(Joi.string()), // Cada elemento del arreglo debe ser una cadena (puedes ajustar esto según tus necesidades)
  });
  const validationResult = schema.validate(req.body);
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

const commentValidation = (req, res, next) => {
  const schema = Joi.object({
    text: Joi.string().min(3).max(200).required(),
    id: Joi.string().alphanum().required()
  })
  const validationResult = schema.validate(req.body);
  if (validationResult.error) {
    res
      .status(404)
      .json({ message: validationResult.error.details[0].message });
    console.error(validationResult.error.details);
  } else {
    //console.log("Data is valid");
    next();
  }
}

module.exports = { dataValidation, commentValidation};
