import React from 'react';
import '../styles/ReflectionModal.css';

const ReflectionModal = ({ onClose, diasSinRegistro }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>💭 Momento de Reflexión</h2>
        <p className="modal-message">
          Han pasado {diasSinRegistro} días desde tu último registro.
        </p>
        <p className="modal-subtitle">
          Es normal tener días difíciles. ¿Qué te ha impedido registrar tus datos?
        </p>
        
        <div className="reflection-suggestions">
          <h3>Sugerencias para retomar el hábito:</h3>
          <ul>
            <li>📱 Configura una alarma diaria como recordatorio</li>
            <li>⏰ Asocia el registro con una actividad rutinaria (ej: después del desayuno)</li>
            <li>🎯 Empieza pequeño: registra solo 1 o 2 módulos hoy</li>
            <li>💪 Recuerda que cada día es una nueva oportunidad</li>
          </ul>
        </div>

        <div className="modal-actions">
          <button className="btn-close" onClick={onClose}>
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReflectionModal;
