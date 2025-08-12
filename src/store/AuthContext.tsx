import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { jwtDecode } from 'jwt-decode';
import http from '../services/http';

type Role = 'admin' | 'staff' | 'viewer';
type JwtPayload = { id: number; email: string; role: Role; exp?: number };

type AuthState = {
  token: string | null;
  user: JwtPayload | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  hasRole: (...roles: Role[]) => boolean;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<JwtPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate on mount
  useEffect(() => {
    const t = localStorage.getItem('auth_token');
    if (!t) {
      setIsLoading(false);
      return;
    }
    setToken(t);
    http.defaults.headers.common.Authorization = `Bearer ${t}`;

    let decoded: JwtPayload | null = null;
    try {
      decoded = jwtDecode<JwtPayload>(t);
    } catch {
      decoded = null;
    }
    if (decoded?.exp && Date.now() / 1000 > decoded.exp) {
      // expired
      localStorage.removeItem('auth_token');
      setToken(null);
      setUser(null);
      setIsLoading(false);
      return;
    }

    // Optimistically set decoded (fast UX)
    if (decoded) setUser(decoded);

    // Validate token against backend (optional but solid)
    (async () => {
      try {
        const res = await http.get('/auth/me'); // will include token via interceptor
        // merge backend truth with decoded token (or just rely on backend)
        setUser((prev) => prev ?? decoded ?? { ...res.data });
      } catch {
        // token invalid server-side
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = (t: string) => {
    localStorage.setItem('auth_token', t);
    setToken(t);
    try {
      const decoded = jwtDecode<JwtPayload>(t);
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

  const value = useMemo<AuthState>(
    () => ({
      token,
      user,
      isLoading,
      isAuthenticated: !!token && !!user,
      login,
      logout,
      hasRole: (...roles) => !!user && roles.includes(user.role),
    }),
    [token, user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
