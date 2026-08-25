import { createContext, useContext, useMemo, useState } from 'react';
import { clearSession, getSession, saveSession } from '../../core/services/Storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getSession);

  const login = (account) => {
    setUser(account);
    saveSession(account);
  };

  const logout = () => {
    setUser(null);
    clearSession();
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
