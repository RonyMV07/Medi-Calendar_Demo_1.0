import axios from 'axios';

const API_URL = '/api';

// Configurar axios con el token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Autenticación
export const register = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/register`, { email, password });
  return response.data;
};

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  return response.data;
};

// Registros diarios
export const crearRegistro = async (fecha_registro, modulos) => {
  const response = await axios.post(
    `${API_URL}/registros`,
    { fecha_registro, modulos },
    { headers: getAuthHeader() }
  );
  return response.data;
};

export const obtenerRegistros = async (fechaInicio, fechaFin) => {
  const params = {};
  if (fechaInicio) params.fechaInicio = fechaInicio;
  if (fechaFin) params.fechaFin = fechaFin;
  
  const response = await axios.get(`${API_URL}/registros`, {
    params,
    headers: getAuthHeader()
  });
  return response.data;
};

export const obtenerRegistroPorFecha = async (fecha) => {
  const response = await axios.get(`${API_URL}/registros/${fecha}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

// Métricas
export const obtenerEvolucion = async (fechaInicio, fechaFin, tipo) => {
  const params = { tipo };
  if (fechaInicio) params.fechaInicio = fechaInicio;
  if (fechaFin) params.fechaFin = fechaFin;
  
  const response = await axios.get(`${API_URL}/metricas/evolucion`, {
    params,
    headers: getAuthHeader()
  });
  return response.data;
};

export const obtenerIndiceBienestar = async () => {
  const response = await axios.get(`${API_URL}/metricas/bienestar`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const verificarReflexion = async () => {
  const response = await axios.get(`${API_URL}/metricas/reflexion`, {
    headers: getAuthHeader()
  });
  return response.data;
};
