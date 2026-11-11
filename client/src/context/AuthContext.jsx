import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('agrismart_user');
    return saved ? JSON.parse(saved) : {
      id: 'f1111111-1111-1111-1111-111111111111',
      email: 'ramesh.farmer@agrismart.ai',
      role: 'farmer',
      fullName: 'Ramesh Reddy'
    };
  });

  const [language, setLanguage] = useState(() => localStorage.getItem('agrismart_lang') || 'en');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('agrismart_lang', language);
  }, [language]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await api.getProfile();
      if (res?.data) {
        setProfile(res.data);
      }
    } catch (err) {
      console.warn('Could not load profile from server:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loginAsDemoFarmer = () => {
    const farmerUser = {
      id: 'f1111111-1111-1111-1111-111111111111',
      email: 'ramesh.farmer@agrismart.ai',
      role: 'farmer',
      fullName: 'Ramesh Reddy'
    };
    localStorage.setItem('agrismart_token', 'demo-farmer-token');
    localStorage.setItem('agrismart_user', JSON.stringify(farmerUser));
    setUser(farmerUser);
  };

  const loginAsDemoAdmin = () => {
    const adminUser = {
      id: 'a0000000-0000-0000-0000-000000000000',
      email: 'admin@agrismart.ai',
      role: 'admin',
      fullName: 'System Administrator'
    };
    localStorage.setItem('agrismart_token', 'demo-admin-token');
    localStorage.setItem('agrismart_user', JSON.stringify(adminUser));
    setUser(adminUser);
  };

  const logout = () => {
    localStorage.removeItem('agrismart_token');
    localStorage.removeItem('agrismart_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      language,
      setLanguage,
      loading,
      refreshProfile: loadProfile,
      loginAsDemoFarmer,
      loginAsDemoAdmin,
      logout,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

