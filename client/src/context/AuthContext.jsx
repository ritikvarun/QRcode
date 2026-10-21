import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('qr_admin_token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('qr_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  // Sync session on mount
  useEffect(() => {
    const checkCurrentAuth = async () => {
      const storedToken = localStorage.getItem('qr_admin_token');
      if (storedToken) {
        try {
          const res = await authApi.getMe();
          if (res.user) {
            setUser(res.user);
            localStorage.setItem('qr_admin_user', JSON.stringify(res.user));
          }
        } catch {
          // Token expired or invalid
          logout();
        }
      }
      setLoading(false);
    };

    checkCurrentAuth();

    const handleAuthExpired = () => {
      logout();
    };

    window.addEventListener('qr_auth_expired', handleAuthExpired);
    return () => window.removeEventListener('qr_auth_expired', handleAuthExpired);
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('qr_admin_token', res.token);
      localStorage.setItem('qr_admin_user', JSON.stringify(res.user));
      return { success: true };
    }
    return { success: false, message: res.message || 'Login failed' };
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('qr_admin_token');
    localStorage.removeItem('qr_admin_user');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
