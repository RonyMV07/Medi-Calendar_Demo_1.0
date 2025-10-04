import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { crearRegistro, obtenerRegistroPorFecha, obtenerRegistros } from '../utils/api';
import { format } from 'date-fns';
import '../styles/CalendarPage.css';

const CalendarPage = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [registros, setRegistros] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    cardiovascular: { presion_sistolica: '', presion_diastolica: '', frecuencia_cardiaca: '' },
    sueno: { duracion_horas: '', calidad_percibida: '', notas_sueno: '' },
    ejercicios: { tipo_actividad: '', duracion_min: '', esfuerzo_percibido: '' },
    peso: { peso_kg: '', objetivo_peso: '' },
    estado_emocional_dia: ''
  });

  useEffect(() => {
    fetchRegistros();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      loadRegistroForDate(selectedDate);
    }
  }, [selectedDate]);

  const fetchRegistros = async () => {
    try {
      const data = await obtenerRegistros();
      setRegistros(data);
    } catch (error) {
      console.error('Error al cargar registros:', error);
    }
  };

  const loadRegistroForDate = async (date) => {
    try {
      const fechaStr = format(date, 'yyyy-MM-dd');
      const registro = await obtenerRegistroPorFecha(fechaStr);
      if (registro && registro.modulos) {
        setFormData(registro.modulos);
      } else {
        resetForm();
      }
    } catch (error) {
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      cardiovascular: { presion_sistolica: '', presion_diastolica: '', frecuencia_cardiaca: '' },
      sueno: { duracion_horas: '', calidad_percibida: '', notas_sueno: '' },
      ejercicios: { tipo_actividad: '', duracion_min: '', esfuerzo_percibido: '' },
      peso: { peso_kg: '', objetivo_peso: '' },
      estado_emocional_dia: ''
    });
  };

  const handleInputChange = (modulo, campo, valor) => {
    setFormData(prev => ({
      ...prev,
      [modulo]: {
        ...prev[modulo],
        [campo]: valor
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const fechaStr = format(selectedDate, 'yyyy-MM-dd');
      await crearRegistro(fechaStr, formData);
      setMessage('✅ Registro guardado exitosamente');
      setShowForm(false);
      fetchRegistros();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error al guardar el registro');
    } finally {
      setLoading(false);
    }
  };

  const tileClassName = ({ date }) => {
    const fechaStr = format(date, 'yyyy-MM-dd');
    const tieneRegistro = registros.some(r => 
      format(new Date(r.fecha_registro), 'yyyy-MM-dd') === fechaStr
    );
    return tieneRegistro ? 'has-registro' : null;
  };

  return (
    <div className="calendar-page">
      <nav className="navbar">
        <h2>🏥 MediCalendar</h2>
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Volver al Dashboard
        </button>
      </nav>

      <div className="calendar-content">
        <h1>📅 Calendario de Registros</h1>
        
        {message && <div className="message">{message}</div>}

        <div className="calendar-container">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileClassName={tileClassName}
            locale="es-ES"
          />
        </div>

        <div className="selected-date">
          <h3>Fecha seleccionada: {format(selectedDate, 'dd/MM/yyyy')}</h3>
          <button 
            className="btn-register" 
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cerrar Formulario' : '+ Registrar Datos'}
          </button>
        </div>

        {showForm && (
          <form className="registro-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>❤️ Cardiovascular</h3>
              <div className="form-row">
                <input
                  type="number"
                  placeholder="Presión Sistólica"
                  value={formData.cardiovascular.presion_sistolica}
                  onChange={(e) => handleInputChange('cardiovascular', 'presion_sistolica', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Presión Diastólica"
                  value={formData.cardiovascular.presion_diastolica}
                  onChange={(e) => handleInputChange('cardiovascular', 'presion_diastolica', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Frecuencia Cardíaca"
                  value={formData.cardiovascular.frecuencia_cardiaca}
                  onChange={(e) => handleInputChange('cardiovascular', 'frecuencia_cardiaca', e.target.value)}
                />
              </div>
            </div>

            <div className="form-section">
              <h3>😴 Sueño</h3>
              <div className="form-row">
                <input
                  type="number"
                  step="0.5"
                  placeholder="Horas de sueño"
                  value={formData.sueno.duracion_horas}
                  onChange={(e) => handleInputChange('sueno', 'duracion_horas', e.target.value)}
                />
                <select
                  value={formData.sueno.calidad_percibida}
                  onChange={(e) => handleInputChange('sueno', 'calidad_percibida', e.target.value)}
                >
                  <option value="">Calidad (1-5)</option>
                  <option value="1">1 - Muy mala</option>
                  <option value="2">2 - Mala</option>
                  <option value="3">3 - Regular</option>
                  <option value="4">4 - Buena</option>
                  <option value="5">5 - Excelente</option>
                </select>
              </div>
              <textarea
                placeholder="Notas sobre el sueño"
                value={formData.sueno.notas_sueno}
                onChange={(e) => handleInputChange('sueno', 'notas_sueno', e.target.value)}
              />
            </div>

            <div className="form-section">
              <h3>🏃 Ejercicio</h3>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Tipo de actividad"
                  value={formData.ejercicios.tipo_actividad}
                  onChange={(e) => handleInputChange('ejercicios', 'tipo_actividad', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Duración (min)"
                  value={formData.ejercicios.duracion_min}
                  onChange={(e) => handleInputChange('ejercicios', 'duracion_min', e.target.value)}
                />
                <select
                  value={formData.ejercicios.esfuerzo_percibido}
                  onChange={(e) => handleInputChange('ejercicios', 'esfuerzo_percibido', e.target.value)}
                >
                  <option value="">Esfuerzo (1-10)</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-section">
              <h3>⚖️ Peso</h3>
              <div className="form-row">
                <input
                  type="number"
                  step="0.1"
                  placeholder="Peso (kg)"
                  value={formData.peso.peso_kg}
                  onChange={(e) => handleInputChange('peso', 'peso_kg', e.target.value)}
                />
                <input
                  type="number"
                  step="0.1"
                  placeholder="Objetivo de peso (kg)"
                  value={formData.peso.objetivo_peso}
                  onChange={(e) => handleInputChange('peso', 'objetivo_peso', e.target.value)}
                />
              </div>
            </div>

            <div className="form-section">
              <h3>😊 Estado Emocional</h3>
              <input
                type="text"
                placeholder="¿Cómo te sientes hoy?"
                value={formData.estado_emocional_dia}
                onChange={(e) => setFormData({...formData, estado_emocional_dia: e.target.value})}
              />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Guardando...' : '💾 Guardar Registro'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
