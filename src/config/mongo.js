const mongoose = require('mongoose');
require('dotenv').config();

// Establecemos la conexión con MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Manejamos eventos de conexión y error
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión:'));
db.once('open', () => {
  console.log('Conexión exitosa con la base de datos.');
});

module.exports = mongoose