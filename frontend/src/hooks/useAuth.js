import { useState, useEffect, createContext, useContext } from 'react';
import { login as apiLogin, register as apiRegister } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un token guardado
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const email = localStorage.getItem('email');
    
    if (token && userId && email) {
      setUser({ userId, email, token });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await apiLogin(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('email', data.email);
      setUser({ userId: data.userId, email: data.email, token: data.token });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Error al iniciar sesión' };
    }
  };

  const register = async (email, password) => {
    try {
      const data = await apiRegister(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('email', data.email);
      setUser({ userId: data.userId, email: data.email, token: data.token });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Error al registrarse' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
