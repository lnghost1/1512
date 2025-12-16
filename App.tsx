
import React, { useState, useEffect, useContext, createContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Learning } from './pages/Learning';
import { Ranking } from './pages/Ranking';
import { Community } from './pages/Community';
import { Checkout } from './pages/Checkout';
import { Layout } from './components/Layout';
import { User, AuthState } from './types';
import { authService } from './services/authService';
import { supabase } from './lib/supabase';

// Auth Context
interface AuthContextType extends AuthState {
  login: (e: string, p: string) => Promise<void>;
  register: (n: string, e: string, p: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Verificar sessão inicial
    const initAuth = async () => {
      try {
        const u = await authService.getCurrentUser();
        setUser(u);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    initAuth();

    // 2. Escutar mudanças (Supabase)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata.name || 'Trader',
          plan: session.user.user_metadata.plan || 'free'
        });
      } else if (event === 'SIGNED_OUT') {
        // Handled by logout manually to clear localstorage mock
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, pass: string) => {
    const loggedUser = await authService.login(email, pass);
    setUser(loggedUser);
  };

  const register = async (name: string, email: string, pass: string) => {
    const registeredUser = await authService.register(name, email, pass);
    setUser(registeredUser);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-[#00E599]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00E599] mb-4"></div>
        <div className="text-sm font-mono tracking-widest uppercase animate-pulse">Carregando NexusTrade...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      <HashRouter>
        <Routes>
          {/* Root redirect logic: If user is logged in -> Dashboard, else -> Login will be handled by protected route logic or explicit redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route 
            path="/login" 
            element={!user ? <Login /> : <Navigate to="/dashboard" replace />} 
          />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              user ? (
                <Layout>
                  <Dashboard />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
           <Route 
            path="/checkout" 
            element={
              user ? (
                <Checkout />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/learning" 
            element={
              user ? (
                <Layout>
                  <Learning />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/ranking" 
            element={
              user ? (
                <Layout>
                  <Ranking />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/community" 
            element={
              user ? (
                <Layout>
                  <Community />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthContext.Provider>
  );
};

export default App;
