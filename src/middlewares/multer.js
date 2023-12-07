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
    const fileTypes = /jpeg|jpg|png|webp/;
    const mimetype = fileTypes.test(file.mimetype); //comprobamos si coincide la extension
    const extName = fileTypes.test(path.extname(file.originalname)); // sacar la extension del nombre del archivo y comprobar
    if (mimetype && extName) {
      return cb(null, true);
    }
    cb("Error, file doesn't support");
  },
}).single("imagen"); //single que sera solo una imagen la que subira, el parametro es el nombre de la key

const uploadMulti = multer({
  storage: storage,
  limits: {
    fileSize: 3000000, // Limitamos el tamaño de cada imagen a 3MB
  },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|webp/;
    const mimetype = fileTypes.test(file.mimetype); // Comprobamos si coincide la extensión
    const extName = fileTypes.test(path.extname(file.originalname)); // Sacamos la extensión del nombre del archivo y comprobamos
    if (mimetype && extName) {
      return cb(null, true);
    }
    cb("Error, file doesn't support");
  },
}).array("images", 10); // "imagenes" es el nombre del campo en el formulario y 10 es el número máximo de imágenes permitidas



module.exports = {upload, uploadMulti}
