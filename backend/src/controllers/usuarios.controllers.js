const Usuario = require('../models/Usuario');
const normalizarGastos = require('../utils/normalizarGastos');
const { responderOk, responderError } = require('../utils/responder');

const usuariosControllers = {};

const prepararUsuario = (body) => {
  const datos = { ...body };

  if (datos.gastos) {
    datos.gastos = normalizarGastos(datos.gastos);
  }

  const totalGastos = Array.isArray(datos.gastos)
    ? datos.gastos.reduce((total, gasto) => total + Number(gasto.monto || 0), 0)
    : 0;

  datos.totalGastos = totalGastos;

  if (datos.ingresos !== undefined) {
    datos.baseImponible = Math.max(Number(datos.ingresos || 0) - totalGastos, 0);
  }

  return datos;
};

usuariosControllers.getUsuarios = async (req, res) => {
  try {
    const filtro = {};

    if (req.query.cedula) filtro.cedula = req.query.cedula;
    if (req.query.periodo) filtro.periodo = Number(req.query.periodo);

    const usuarios = await Usuario.find(filtro).sort({ createdAt: -1 });
    return responderOk(res, 200, 'Listado de usuarios obtenido correctamente', usuarios);
  } catch (error) {
    return responderError(res, 500, 'Error al obtener los usuarios', error);
  }
};

usuariosControllers.getUsuarioById = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      return responderError(res, 404, 'No existe un usuario con ese ID');
    }

    return responderOk(res, 200, 'Usuario encontrado correctamente', usuario);
  } catch (error) {
    return responderError(res, 500, 'Error al buscar el usuario', error);
  }
};

usuariosControllers.addUsuario = async (req, res) => {
  try {
    const datos = prepararUsuario(req.body);
    const nuevoUsuario = new Usuario(datos);
    const usuarioGuardado = await nuevoUsuario.save();
    return responderOk(res, 201, 'Nuevo usuario registrado correctamente', usuarioGuardado);
  } catch (error) {
    if (error.code === 11000) {
      return responderError(res, 400, 'Ya existe un usuario con esa cédula o email', error);
    }
    return responderError(res, 400, 'Error al registrar el usuario', error);
  }
};

usuariosControllers.updateUsuario = async (req, res) => {
  try {
    const usuarioActual = await Usuario.findById(req.params.id);

    if (!usuarioActual) {
      return responderError(res, 404, 'No existe un usuario con ese ID');
    }

    const datos = prepararUsuario({
      nombre: req.body.nombre ?? usuarioActual.nombre,
      cedula: req.body.cedula ?? usuarioActual.cedula,
      email: req.body.email ?? usuarioActual.email,
      periodo: req.body.periodo ?? usuarioActual.periodo,
      gastos: req.body.gastos ?? usuarioActual.gastos,
      ingresos: req.body.ingresos ?? usuarioActual.ingresos
    });

    const usuarioActualizado = await Usuario.findByIdAndUpdate(req.params.id, datos, {
      new: true,
      runValidators: true
    });

    return responderOk(res, 200, 'Usuario actualizado correctamente', usuarioActualizado);
  } catch (error) {
    if (error.code === 11000) {
      return responderError(res, 400, 'Ya existe un usuario con esa cédula o email', error);
    }
    return responderError(res, 400, 'Error al actualizar el usuario', error);
  }
};

usuariosControllers.deleteUsuario = async (req, res) => {
  try {
    const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);

    if (!usuarioEliminado) {
      return responderError(res, 404, 'No existe un usuario con ese ID');
    }

    return responderOk(res, 200, 'Usuario eliminado correctamente', usuarioEliminado);
  } catch (error) {
    return responderError(res, 500, 'Error al eliminar el usuario', error);
  }
};

module.exports = usuariosControllers;
