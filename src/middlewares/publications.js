const Joi = require("joi");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../public/images"), // direccion de donde se guardaran las imagenes
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); //para poder cambiar el nombre del archivo como queramos, cb es el callback
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 3000000, //limitamos el tamaño de la imagen 3mb
  },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const mimetype = fileTypes.test(file.mimetype); //comprobamos si coincide la extension
    const extName = fileTypes.test(path.extname(file.originalname)); // sacar la extension del nombre del archivo y comprobar
    if (mimetype && extName) {
      return cb(null, true);
    }
    cb("Error, file doesn't support");
  },
}).single("imagen"); //single que sera solo una imagen la que subira, el parametro es el nombre de la key

const dataValidation = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Error al cargar el archivo", error: err });
    }
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
  });
};

module.exports = { dataValidation, upload };
