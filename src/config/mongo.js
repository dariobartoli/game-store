const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = (process.env.NODE_ENV === 'test') ? process.env.MONGO_URI + 'TEST' : process.env.MONGO_URI
console.log(mongoUri);

// Establecemos la conexión con MongoDB
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Manejamos eventos de conexión y error
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión:'));
db.once('open', () => {
  //console.log('Conexión exitosa con la base de datos.');
});

module.exports = mongoose