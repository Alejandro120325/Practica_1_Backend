const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const conectarDB = require('./src/database');
const routes = require('./src/routes/server.routes');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Conexión a MongoDB
conectarDB();

// Rutas principales
app.use(routes);

// Ruta 404
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    message: 'No se encontró la página o endpoint solicitado',
    endpoint: req.originalUrl
  });
});

app.listen(port, () => {
  console.log(`Servidor está corriendo en http://localhost:${port}`);
});
