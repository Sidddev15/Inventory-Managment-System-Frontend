import { createContext, useState, useEffect, useMemo, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

type jwtPayload = {
  id: number;
  email: string;
  role: 'admin' | 'staff' | 'viewer';
  exp?: number;
};

type AuthState = {
  token: string | null;
  user: jwtPayload | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (...roles: Array<jwtPayload['role']>) => boolean;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('auth-token')
  );
  const [user, setUser] = useState<jwtPayload | null>(() => {
    const t = localStorage.getItem('auth-token');
    if (!t) return null;
    try {
      return jwtDecode<jwtPayload>(t);
    } catch {
      return null;
    }
  });

  const login = (t: string) => {
    localStorage.setItem('auth_token', t);
    setToken(t);
    try {
      const decoded = jwtDecode<jwtPayload>(t);
      setUser(decoded);
    } catch {
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (user?.exp && Date.now() / 1000 > user.exp) {
      logout();
    }
  }, []); //run once

  const value = useMemo<AuthState>(
    () => ({
      token,
      user,
      login,
      logout,
      isAuthenticated: !!token && !!user,
      hasRole: (...roles) => !!user && roles.includes(user.role),
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
