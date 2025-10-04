import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { obtenerEvolucion } from '../utils/api';
import { format } from 'date-fns';
import '../styles/ChartsPage.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartsPage = () => {
  const navigate = useNavigate();
  const [tipoMetrica, setTipoMetrica] = useState('peso');
  const [periodo, setPeriodo] = useState('30');
  const [datosGrafico, setDatosGrafico] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvolucion();
  }, [tipoMetrica, periodo]);

  const fetchEvolucion = async () => {
    setLoading(true);
    try {
      const fechaFin = new Date();
      const fechaInicio = new Date();
      fechaInicio.setDate(fechaInicio.getDate() - parseInt(periodo));

      const data = await obtenerEvolucion(
        fechaInicio.toISOString().split('T')[0],
        fechaFin.toISOString().split('T')[0],
        tipoMetrica
      );

      prepararDatosGrafico(data);
    } catch (error) {
      console.error('Error al cargar evolución:', error);
    } finally {
      setLoading(false);
    }
  };

  const prepararDatosGrafico = (data) => {
    if (!data || data.length === 0) {
      setDatosGrafico(null);
      return;
    }

    const labels = data.map(d => format(new Date(d.fecha), 'dd/MM'));
    
    let datasets = [];

    switch (tipoMetrica) {
      case 'peso':
        datasets = [
          {
            label: 'Peso (kg)',
            data: data.map(d => d.valor),
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            tension: 0.4
          }
        ];
        break;
      
      case 'cardiovascular':
        datasets = [
          {
            label: 'Sistólica',
            data: data.map(d => d.sistolica),
            borderColor: '#f56565',
            backgroundColor: 'rgba(245, 101, 101, 0.1)',
            tension: 0.4
          },
          {
            label: 'Diastólica',
            data: data.map(d => d.diastolica),
            borderColor: '#4299e1',
            backgroundColor: 'rgba(66, 153, 225, 0.1)',
            tension: 0.4
          }
        ];
        break;
      
      case 'sueno':
        datasets = [
          {
            label: 'Horas de sueño',
            data: data.map(d => d.duracion),
            borderColor: '#9f7aea',
            backgroundColor: 'rgba(159, 122, 234, 0.1)',
            tension: 0.4
          }
        ];
        break;
      
      case 'ejercicio':
        datasets = [
          {
            label: 'Duración (min)',
            data: data.map(d => d.duracion),
            borderColor: '#48bb78',
            backgroundColor: 'rgba(72, 187, 120, 0.1)',
            tension: 0.4
          }
        ];
        break;
      
      default:
        break;
    }

    setDatosGrafico({
      labels,
      datasets
    });
  };

  const opciones = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Evolución de ${tipoMetrica.charAt(0).toUpperCase() + tipoMetrica.slice(1)}`
      }
    },
    scales: {
      y: {
        beginAtZero: false
      }
    }
  };

  return (
    <div className="charts-page">
      <nav className="navbar">
        <h2>🏥 MediCalendar</h2>
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Volver al Dashboard
        </button>
      </nav>

      <div className="charts-content">
        <h1>📊 Evolución de Métricas</h1>

        <div className="controls">
          <div className="control-group">
            <label>Tipo de Métrica:</label>
            <select value={tipoMetrica} onChange={(e) => setTipoMetrica(e.target.value)}>
              <option value="peso">Peso</option>
              <option value="cardiovascular">Cardiovascular</option>
              <option value="sueno">Sueño</option>
              <option value="ejercicio">Ejercicio</option>
            </select>
          </div>

          <div className="control-group">
            <label>Periodo:</label>
            <select value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
              <option value="7">Última semana</option>
              <option value="30">Último mes</option>
              <option value="90">Últimos 3 meses</option>
              <option value="365">Último año</option>
            </select>
          </div>
        </div>

        <div className="chart-container">
          {loading ? (
            <div className="loading">Cargando datos...</div>
          ) : datosGrafico ? (
            <Line data={datosGrafico} options={opciones} />
          ) : (
            <div className="no-data">
              <p>No hay datos disponibles para este periodo</p>
              <p>Comienza a registrar tus datos en el calendario</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartsPage;
