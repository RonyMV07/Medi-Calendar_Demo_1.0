const mongoose = require('mongoose');

const moduloSchema = new mongoose.Schema({
  // Módulo 1: Cardiovascular
  cardiovascular: {
    presion_sistolica: Number,
    presion_diastolica: Number,
    frecuencia_cardiaca: Number
  },
  // Módulo 2: Sueño
  sueno: {
    duracion_horas: Number,
    calidad_percibida: { type: Number, min: 1, max: 5 },
    notas_sueno: String
  },
  // Módulo 3: Ejercicios
  ejercicios: {
    tipo_actividad: String,
    duracion_min: Number,
    esfuerzo_percibido: { type: Number, min: 1, max: 10 }
  },
  // Módulo 4: Peso
  peso: {
    peso_kg: Number,
    imc: Number, // Calculado en backend
    objetivo_peso: Number
  },
  // Módulo 5: Medicación
  medicacion: [{
    medicamento_id: String,
    dosis_tomada: Boolean,
    hora_registro: Date
  }],
  // Módulo 6: Citas
  citas: [{
    fecha_cita: Date,
    medico_especialidad: String,
    motivo: String,
    recordatorio_activo: Boolean
  }],
  estado_emocional_dia: String // Campo general
});

const registroSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fecha_registro: { type: Date, required: true, index: true },
  modulos: moduloSchema
});

module.exports = mongoose.model('RegistroDiario', registroSchema);
