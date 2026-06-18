const Gasto = require('../models/Gasto');
const { responderOk, responderError } = require('../utils/responder');

const gastosControllers = {};

gastosControllers.getGastos = async (req, res) => {
  try {
    const filtro = {};

    if (req.query.cedula) filtro.cedula = req.query.cedula;
    if (req.query.tipo) filtro.tipo = String(req.query.tipo).toLowerCase();
    if (req.query.periodo) filtro.periodo = Number(req.query.periodo);

    const gastos = await Gasto.find(filtro).sort({ createdAt: -1 });
    return responderOk(res, 200, 'Listado de gastos obtenido correctamente', gastos);
  } catch (error) {
    return responderError(res, 500, 'Error al obtener los gastos', error);
  }
};

gastosControllers.getGastoById = async (req, res) => {
  try {
    const gasto = await Gasto.findById(req.params.id);

    if (!gasto) {
      return responderError(res, 404, 'No existe un gasto con ese ID');
    }

    return responderOk(res, 200, 'Gasto encontrado correctamente', gasto);
  } catch (error) {
    return responderError(res, 500, 'Error al buscar el gasto', error);
  }
};

gastosControllers.addGasto = async (req, res) => {
  try {
    const nuevoGasto = new Gasto(req.body);
    const gastoGuardado = await nuevoGasto.save();
    return responderOk(res, 201, 'Nuevo gasto registrado correctamente', gastoGuardado);
  } catch (error) {
    return responderError(res, 400, 'Error al registrar el gasto', error);
  }
};

gastosControllers.updateGasto = async (req, res) => {
  try {
    const gastoActualizado = await Gasto.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!gastoActualizado) {
      return responderError(res, 404, 'No existe un gasto con ese ID');
    }

    return responderOk(res, 200, 'Gasto actualizado correctamente', gastoActualizado);
  } catch (error) {
    return responderError(res, 400, 'Error al actualizar el gasto', error);
  }
};

gastosControllers.deleteGasto = async (req, res) => {
  try {
    const gastoEliminado = await Gasto.findByIdAndDelete(req.params.id);

    if (!gastoEliminado) {
      return responderError(res, 404, 'No existe un gasto con ese ID');
    }

    return responderOk(res, 200, 'Gasto eliminado correctamente', gastoEliminado);
  } catch (error) {
    return responderError(res, 500, 'Error al eliminar el gasto', error);
  }
};

module.exports = gastosControllers;
