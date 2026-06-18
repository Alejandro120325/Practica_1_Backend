const mongoose = require('mongoose');

const gastoUsuarioSchema = new mongoose.Schema(
  {
    tipo: {
      type: String,
      trim: true,
      lowercase: true,
      required: true
    },
    monto: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { _id: false }
);

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      trim: true,
      required: [true, 'El nombre es obligatorio']
    },
    cedula: {
      type: String,
      trim: true,
      required: [true, 'La cédula es obligatoria'],
      unique: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, 'El email es obligatorio'],
      unique: true
    },
    periodo: {
      type: Number,
      default: new Date().getFullYear()
    },
    gastos: {
      type: [gastoUsuarioSchema],
      default: []
    },
    ingresos: {
      type: Number,
      required: [true, 'Los ingresos son obligatorios'],
      min: [0, 'Los ingresos no pueden ser negativos']
    },
    totalGastos: {
      type: Number,
      default: 0
    },
    baseImponible: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

usuarioSchema.pre('save', function calcularTotales(next) {
  this.totalGastos = this.gastos.reduce((total, gasto) => total + Number(gasto.monto || 0), 0);
  this.baseImponible = Math.max(Number(this.ingresos || 0) - this.totalGastos, 0);
  next();
});

usuarioSchema.pre('findOneAndUpdate', function calcularTotalesUpdate(next) {
  const update = this.getUpdate();

  if (update && update.gastos) {
    update.totalGastos = update.gastos.reduce((total, gasto) => total + Number(gasto.monto || 0), 0);
  }

  if (update && update.ingresos !== undefined && update.totalGastos !== undefined) {
    update.baseImponible = Math.max(Number(update.ingresos || 0) - update.totalGastos, 0);
  }

  next();
});

module.exports = mongoose.model('Usuario', usuarioSchema);
