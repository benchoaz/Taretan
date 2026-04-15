import React, { createContext, useContext, useState, useCallback } from 'react';
import { MOCK_USERS } from '../data/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const login = useCallback(async (userId, password) => {
    setLoading(true);
    setError(null);
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));
    if (password !== '123456') {
      setError('Password salah. (Demo: gunakan 123456)');
      setLoading(false);
      return false;
    }
    const found = MOCK_USERS.find(u => u.id === userId);
    if (!found) {
      setError('Akun tidak ditemukan.');
      setLoading(false);
      return false;
    }
    setUser({ ...found, token: 'demo-jwt-token-' + Date.now() });
    setLoading(false);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
  }, []);

  const hasRole = useCallback((...roles) => {
    return user ? roles.includes(user.role) : false;
  }, [user]);

  const canCreateDisposisi = useCallback(() =>
    hasRole('kepala_dinas', 'kepala_bidang', 'kepala_seksi'), [hasRole]);

  const canInputSurat = useCallback(() =>
    hasRole('operator', 'kepala_dinas', 'kepala_bidang'), [hasRole]);

  const canViewAdmin = useCallback(() =>
    hasRole('kepala_dinas', 'operator'), [hasRole]);

  return (
    <AuthContext.Provider value={{
      user, loading, error,
      login, logout,
      hasRole, canCreateDisposisi, canInputSurat, canViewAdmin,
      isLoggedIn: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
