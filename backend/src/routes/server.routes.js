const express = require('express');
const router = express.Router();

const gasto = require('../controllers/gastos.controllers');
const usuario = require('../controllers/usuarios.controllers');

router.get('/misitio', (req, res) => {
  res.send(`
    <h1>Bienvenido al Backend de Cálculo de Gastos</h1>
    <p>Servidor Express.js conectado a MongoDB.</p>
    <ul>
      <li><a href="/misitio/about">/misitio/about</a></li>
      <li><a href="/misitio/contactos">/misitio/contactos</a></li>
      <li><a href="/misitio/health">/misitio/health</a></li>
      <li><a href="/misitio/gastos">/misitio/gastos</a></li>
      <li><a href="/misitio/usuarios">/misitio/usuarios</a></li>
    </ul>
  `);
});

router.get('/misitio/about', (req, res) => {
  res.send(`
    <h1>Acerca del sitio</h1>
    <p>Aplicación backend para registrar usuarios, gastos deducibles e ingresos.</p>
    <p>La información se guarda en MongoDB usando Mongoose.</p>
  `);
});

router.get('/misitio/contactos', (req, res) => {
  res.send(`
    <h1>Contactos</h1>
    <p>Proyecto académico de Programación y Plataformas Web.</p>
    <p>Correo de prueba: contacto@gastos.local</p>
  `);
});

router.get('/misitio/health', (req, res) => {
  res.json({
    ok: true,
    message: 'Servidor activo',
    app: process.env.APP_NAME || 'Backend Calculo de Gastos',
    timestamp: new Date().toISOString()
  });
});

// Endpoints de gastos
router.get('/misitio/gastos', gasto.getGastos);
router.get('/misitio/gastos/:id', gasto.getGastoById);
router.post('/misitio/gastos', gasto.addGasto);
router.put('/misitio/gastos/:id', gasto.updateGasto);
router.delete('/misitio/gastos/:id', gasto.deleteGasto);

// Endpoints de usuarios
router.get('/misitio/usuarios', usuario.getUsuarios);
router.get('/misitio/usuarios/:id', usuario.getUsuarioById);
router.post('/misitio/usuarios', usuario.addUsuario);
router.put('/misitio/usuarios/:id', usuario.updateUsuario);
router.delete('/misitio/usuarios/:id', usuario.deleteUsuario);

module.exports = router;
