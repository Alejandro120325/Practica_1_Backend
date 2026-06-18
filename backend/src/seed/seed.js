require('dotenv').config();
const mongoose = require('mongoose');
const Gasto = require('../models/Gasto');
const Usuario = require('../models/Usuario');
const normalizarGastos = require('../utils/normalizarGastos');

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gastos_db';

const gastosIniciales = [
  {
    cedula: '1714032718',
    tipo: 'salud',
    monto: 320,
    montoMaximoDeducible: 14575.6,
    informacion: 'Consultas médicas, seguros y medicinas',
    periodo: 2025
  },
  {
    cedula: '1914032718',
    tipo: 'educacion',
    monto: 1320,
    montoMaximoDeducible: 3575.6,
    informacion: 'Pensiones, útiles y transporte escolar',
    periodo: 2025
  },
  {
    cedula: '1714578718',
    tipo: 'vivienda',
    monto: 557.5,
    montoMaximoDeducible: 5575.6,
    informacion: 'Servicios básicos y arriendo',
    periodo: 2025
  }
];

const usuariosIniciales = [
  {
    nombre: 'Juan Perez',
    cedula: '1714032718',
    email: 'jperez@gmail.com',
    periodo: 2025,
    gastos: [{ salud: 320 }, { educacion: 1320 }, { vivienda: 320 }],
    ingresos: 25000
  },
  {
    nombre: 'Ana Andrade',
    cedula: '1914032718',
    email: 'aandrade@gmail.com',
    periodo: 2025,
    gastos: [{ salud: 1320 }, { educacion: 5320 }, { vivienda: 3320 }],
    ingresos: 33000
  },
  {
    nombre: 'Luis Mendez',
    cedula: '1714578718',
    email: 'lmendez@gmail.com',
    periodo: 2025,
    gastos: [{ salud: 2000 }, { educacion: 2320 }, { vivienda: 2000 }],
    ingresos: 18000
  }
];

const cargarDatos = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB conectado para cargar datos iniciales');

    await Gasto.deleteMany({});
    await Usuario.deleteMany({});

    await Gasto.insertMany(gastosIniciales);

    const usuariosPreparados = usuariosIniciales.map((usuario) => {
      const gastos = normalizarGastos(usuario.gastos);
      const totalGastos = gastos.reduce((total, gasto) => total + Number(gasto.monto || 0), 0);
      return {
        ...usuario,
        gastos,
        totalGastos,
        baseImponible: Math.max(usuario.ingresos - totalGastos, 0)
      };
    });

    await Usuario.insertMany(usuariosPreparados);

    console.log('Datos iniciales insertados correctamente');
    console.log('Base de datos:', mongoUri);
    process.exit(0);
  } catch (error) {
    console.error('Error al cargar datos iniciales:', error.message);
    process.exit(1);
  }
};

cargarDatos();
