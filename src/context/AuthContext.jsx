import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Check for token on app load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      // Placeholder user data; replace with actual user data from backend
      setUser({ email: 'user@example.com' });
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
    setUser({ email: 'user@example.com' }); // Placeholder; update with backend response
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};