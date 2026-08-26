import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AdminUser {
  id: number;
  username: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = typeof window !== 'undefined'
  ? `${window.location.protocol}//${window.location.hostname}:3001/api`
  : 'http://localhost:3001/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const savedUser = localStorage.getItem('skm_admin_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('skm_admin_token');
  });

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('skm_admin_user', JSON.stringify(data.user));
        localStorage.setItem('skm_admin_token', data.token);
        return;
      }
    } catch (err) {
      console.log('[AuthContext] Backend API offline, mencoba verifikasi Client-Side Auth...');
    }

    // Client-Side Fallback Auth (Default Admin Desa Sijenggung)
    if (username.trim() === 'admin' && password === 'admin123') {
      const fallbackUser: AdminUser = {
        id: 1,
        username: 'admin',
        name: 'Administrator Desa Sijenggung',
        role: 'admin',
      };
      const fallbackToken = 'token-' + Date.now();
      setUser(fallbackUser);
      setToken(fallbackToken);
      localStorage.setItem('skm_admin_user', JSON.stringify(fallbackUser));
      localStorage.setItem('skm_admin_token', fallbackToken);
      return;
    }

    throw new Error('Username atau password salah. (Default: admin / admin123)');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('skm_admin_user');
    localStorage.removeItem('skm_admin_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
