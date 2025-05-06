import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext({
  user: null,
  token: null,
  roles: [],
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [roles, setRoles] = useState([]);

  // Check for token on app load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        setToken(storedToken);
        setUser({ email: decoded.email || decoded.sub || 'user@example.com' });
        setRoles(
          decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || []
        );
      } catch (error) {
        console.error('Error decoding stored token:', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = (newToken) => {
    try {
      const decoded = jwtDecode(newToken);
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser({ email: decoded.email || decoded.sub || 'user@example.com' });
      setRoles(
        decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || []
      );
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setRoles([]);
  };

  return (
    <AuthContext.Provider value={{ user, token, roles, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};