const normalizarGastos = (gastos = []) => {
  if (!Array.isArray(gastos)) return [];

  return gastos.map((item) => {
    // Acepta formato: { "salud": 320 }
    const claves = Object.keys(item || {});
    if (claves.length === 1 && item.tipo === undefined && item.monto === undefined) {
      const tipo = claves[0];
      return {
        tipo,
        monto: Number(item[tipo])
      };
    }

    // Acepta formato: { "tipo": "salud", "monto": 320 }
    return {
      tipo: item.tipo,
      monto: Number(item.monto)
    };
  });
};

module.exports = normalizarGastos;
