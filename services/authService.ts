import { supabase } from '../lib/supabase';
import { User } from '../types';

export const isAdvancedPermissionsUser = (email: string) => {
  return String(email || '').trim().toLowerCase() === 'andreluisscheeren14.a@gmail.com';
};

// Helper para ler variáveis de ambiente de forma segura (Vite/Vercel)
const getEnv = (key: string) => {
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      return String(import.meta.env[key]).trim();
    }
  } catch (e) {}

  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      // @ts-ignore
      return String(process.env[key]).trim();
    }
  } catch (e) {}
  
  return '';
};

// --- MOCK SERVICE (Fallback LocalStorage) ---
const LOCAL_STORAGE_KEY = 'nexus_users';
const CURRENT_USER_KEY = 'nexus_current_user';

// Usuário Mestre para garantir acesso sempre
const MASTER_USER = {
  id: 'master-admin-id',
  email: 'admin@nexus.com',
  password: '123456', 
  name: 'Admin Nexus',
  plan: 'free' // Mantido como free para testes de bloqueio
};

const mockAuth = {
  login: async (email: string, password: string): Promise<User> => {
    // Simula delay de rede
    await new Promise(r => setTimeout(r, 600)); 
    
    // 1. Verificar Usuário Mestre (Sempre funciona)
    if (email.toLowerCase().trim() === MASTER_USER.email && password === MASTER_USER.password) {
        const userObj: User = { 
            id: MASTER_USER.id, 
            email: MASTER_USER.email, 
            name: MASTER_USER.name, 
            plan: 'free' as 'free'
        };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userObj));
        return userObj;
    }

    // 2. Verificar LocalStorage
    const users = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password);
    
    if (!user) throw new Error('Email ou senha incorretos. Tente criar uma conta nova.');
    
    const userObj: User = { 
      id: user.id, 
      email: user.email, 
      name: user.name, 
      plan: user.plan || 'free'
    };
    
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userObj));
    return userObj;
  },

  register: async (name: string, email: string, password: string): Promise<User> => {
    await new Promise(r => setTimeout(r, 600));
    const users = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    
    if (users.find((u: any) => u.email.toLowerCase() === email.toLowerCase().trim())) {
      throw new Error('Este email já está cadastrado. Tente fazer login.');
    }

    // Por padrão, cria como FREE. O usuário deve comprar o plano.
    const newUser = { 
        id: crypto.randomUUID(), 
        name, 
        email: email.trim(), 
        password, 
        plan: 'free' 
    };
    
    users.push(newUser);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users));
    
    const userObj: User = { id: newUser.id, email: newUser.email, name: newUser.name, plan: 'free' };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userObj));
    return userObj;
  },

  upgradeToPro: async (): Promise<User> => {
    await new Promise(r => setTimeout(r, 1000));
    const currentUserStr = localStorage.getItem(CURRENT_USER_KEY);
    if (!currentUserStr) throw new Error("Não logado");
    
    const currentUser = JSON.parse(currentUserStr);
    const updatedUser = { ...currentUser, plan: 'pro' };
    
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    
    // Atualiza na lista de usuários também
    const users = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    const updatedUsers = users.map((u: any) => u.id === currentUser.id ? { ...u, plan: 'pro' } : u);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedUsers));

    return updatedUser as User;
  },

  logout: async () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: async (): Promise<User | null> => {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }
};

// --- REAL SERVICE ---

const isSupabaseConfigured = () => {
  const url = getEnv('VITE_SUPABASE_URL') || getEnv('SUPABASE_URL');
  const key = getEnv('VITE_SUPABASE_ANON_KEY') || getEnv('SUPABASE_ANON_KEY');
  
  // Verificação rígida: só retorna true se NÃO for placeholder
  return !!url && !!key && !url.includes('placeholder') && !key.includes('placeholder');
};

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    if (isSupabaseConfigured()) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            if (data.user) {
                return {
                    id: data.user.id,
                    email: data.user.email || '',
                    name: data.user.user_metadata.name || 'Trader',
                    plan: data.user.user_metadata.plan || 'free'
                };
            }
        } catch (e) {
            console.warn("Supabase login falhou, tentando local...", e);
        }
    }
    return mockAuth.login(email, password);
  },

  register: async (name: string, email: string, password: string): Promise<User> => {
    if (isSupabaseConfigured()) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: { 
                data: { 
                    name,
                    plan: 'free' 
                } 
                },
            });

            if (error) throw error;
            if (data.user) {
                return {
                    id: data.user.id,
                    email: data.user.email || '',
                    name: name,
                    plan: 'free'
                };
            }
        } catch (e) {
            console.warn("Supabase register falhou, tentando local...", e);
        }
    }
    return mockAuth.register(name, email, password);
  },

  upgradeToPro: async (): Promise<User> => {
    if (isSupabaseConfigured()) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase.auth.updateUser({
                    data: { plan: 'pro' }
                });
                return {
                    id: user.id,
                    email: user.email || '',
                    name: user.user_metadata.name,
                    plan: 'pro'
                };
            }
        } catch (e) {}
    }
    return mockAuth.upgradeToPro();
  },
  
  // VALIDAÇÃO DA CHAVE DE LICENÇA
  activateProPlan: async (licenseKey: string): Promise<User> => {
      // Chave universal atualizada conforme solicitação
      const SERVER_KEY = getEnv('VITE_LICENSE_KEY') || getEnv('NEXT_PUBLIC_ACCESS_KEY') || 'NX-NEXUS-TRADE';
      
      const normalizedInput = licenseKey.trim().toUpperCase();
      const normalizedServerKey = SERVER_KEY.trim().toUpperCase();
      
      const isValid = normalizedInput === normalizedServerKey;

      if (isValid) {
          return authService.upgradeToPro();
      } else {
          throw new Error(`Chave inválida. Verifique o código enviado ao seu email.`);
      }
  },

  logout: async () => {
    try {
      if (isSupabaseConfigured()) await supabase.auth.signOut();
    } catch (e) {}
    await mockAuth.logout();
  },

  getCurrentUser: async (): Promise<User | null> => {
    if (isSupabaseConfigured()) {
        try {
            const { data } = await supabase.auth.getUser();
            if (data.user) {
            return {
                id: data.user.id,
                email: data.user.email || '',
                name: data.user.user_metadata.name || 'Trader',
                plan: data.user.user_metadata.plan || 'free'
            };
            }
        } catch (e) {}
    }
    return mockAuth.getCurrentUser();
  }
};
