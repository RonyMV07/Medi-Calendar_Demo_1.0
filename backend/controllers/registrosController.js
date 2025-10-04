const RegistroDiario = require('../models/RegistroDiario');

// Crear o actualizar registro diario
exports.crearRegistro = async (req, res) => {
  try {
    const { fecha_registro, modulos } = req.body;
    const usuario_id = req.userId;

    // Calcular IMC si hay datos de peso
    if (modulos?.peso?.peso_kg) {
      // Asumiendo altura de 1.70m por defecto (debería estar en perfil de usuario)
      const altura = 1.70; 
      modulos.peso.imc = (modulos.peso.peso_kg / (altura * altura)).toFixed(2);
    }

    // Verificar si ya existe un registro para esta fecha
    const registroExistente = await RegistroDiario.findOne({
      usuario_id,
      fecha_registro: new Date(fecha_registro)
    });

    if (registroExistente) {
      // Actualizar registro existente
      registroExistente.modulos = modulos;
      await registroExistente.save();
      return res.json(registroExistente);
    }

    // Crear nuevo registro
    const nuevoRegistro = new RegistroDiario({
      usuario_id,
      fecha_registro: new Date(fecha_registro),
      modulos
    });

    await nuevoRegistro.save();
    res.status(201).json(nuevoRegistro);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener registros del usuario
exports.obtenerRegistros = async (req, res) => {
  try {
    const usuario_id = req.userId;
    const { fechaInicio, fechaFin } = req.query;

    let query = { usuario_id };

    if (fechaInicio || fechaFin) {
      query.fecha_registro = {};
      if (fechaInicio) query.fecha_registro.$gte = new Date(fechaInicio);
      if (fechaFin) query.fecha_registro.$lte = new Date(fechaFin);
    }

    const registros = await RegistroDiario.find(query).sort({ fecha_registro: -1 });
    res.json(registros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener registro por fecha específica
exports.obtenerRegistroPorFecha = async (req, res) => {
  try {
    const usuario_id = req.userId;
    const { fecha } = req.params;

    const registro = await RegistroDiario.findOne({
      usuario_id,
      fecha_registro: new Date(fecha)
    });

    if (!registro) {
      return res.status(404).json({ message: 'No hay registro para esta fecha' });
    }

    res.json(registro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar registro
exports.eliminarRegistro = async (req, res) => {
  try {
    const usuario_id = req.userId;
    const { id } = req.params;

    const registro = await RegistroDiario.findOneAndDelete({
      _id: id,
      usuario_id
    });

    if (!registro) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }

    res.json({ message: 'Registro eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
