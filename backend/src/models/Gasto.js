const mongoose = require('mongoose');

const gastoSchema = new mongoose.Schema(
  {
    cedula: {
      type: String,
      trim: true,
      required: [true, 'La cédula es obligatoria']
    },
    tipo: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, 'El tipo de gasto es obligatorio'],
      enum: ['salud', 'educacion', 'vivienda', 'alimentacion', 'vestimenta', 'turismo', 'otros']
    },
    monto: {
      type: Number,
      required: [true, 'El monto es obligatorio'],
      min: [0, 'El monto no puede ser negativo']
    },
    montoMaximoDeducible: {
      type: Number,
      default: 0,
      min: [0, 'El monto máximo deducible no puede ser negativo']
    },
    informacion: {
      type: String,
      trim: true,
      default: 'Sin información adicional'
    },
    periodo: {
      type: Number,
      default: new Date().getFullYear(),
      min: [2000, 'El período debe ser mayor o igual a 2000']
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model('Gasto', gastoSchema);
