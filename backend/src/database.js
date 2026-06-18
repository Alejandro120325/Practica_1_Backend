const mongoose = require('mongoose');

const conectarDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gastos_db';
    await mongoose.connect(mongoUri);
    console.log('MongoDB conectado correctamente');
  } catch (error) {
    console.error('Error al conectar con MongoDB:');
    console.error(error.message);
    console.error('Revisa que MongoDB esté encendido en el puerto 27017.');
  }
};

module.exports = conectarDB;
