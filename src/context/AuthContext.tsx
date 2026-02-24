import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserProfile {
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('finverse_token');
    if (token) {
      setIsAuthenticated(true);
      setUser({ name: "Alex Rivera", email: "alex.rivera@finverse.io" });
    }
    setLoading(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem('finverse_token', token);
    setIsAuthenticated(true);
    setUser({ name: "Alex Rivera", email: "alex.rivera@finverse.io" });
  };

  const logout = () => {
    localStorage.removeItem('finverse_token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};