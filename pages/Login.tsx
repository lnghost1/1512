import React, { useState } from 'react';
import { Input } from '../components/Input';
import { Logo } from '../components/Logo';
import { useAuth } from '../App';
import { Lock, Mail, User as UserIcon, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';

export const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
        setSuccessMessage('Conta criada com sucesso! Entrando...');
        // Pequeno delay para o usuário ver a msg
        setTimeout(async () => {
           try {
             await login(email, password);
           } catch (loginErr) {
             // Se falhar o login automático (ex: precisa confirmar email), avisa
             setSuccessMessage('Cadastro realizado! Se não entrar automaticamente, verifique seu email ou faça login.');
             setIsLogin(true);
           }
        }, 1500);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] grid-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Efeitos de Fundo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-nexus-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="w-full max-w-md relative z-10">
        
        {/* Header da Logo */}
        <div className="flex justify-center mb-10">
          <Logo size={48} className="scale-110" />
        </div>

        <div className="glass-panel rounded-2xl p-8 shadow-2xl border border-nexus-border backdrop-blur-xl">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-1">
              {isLogin ? 'Bem-vindo de volta' : 'Criar nova conta'}
            </h2>
            <p className="text-nexus-muted text-sm">
              {isLogin ? 'Acesse o terminal de alta performance.' : 'Junte-se à elite do trading com IA.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-wider text-nexus-muted uppercase ml-1">Nome Completo</label>
                <div className="relative group">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-nexus-primary transition-colors" size={18} />
                  <input 
                    className="w-full pl-10 pr-4 py-3 bg-nexus-card/50 border border-nexus-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-nexus-primary focus:ring-1 focus:ring-nexus-primary transition-all"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold tracking-wider text-nexus-muted uppercase ml-1">Email Corporativo</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-nexus-primary transition-colors" size={18} />
                <input 
                  type="email"
                  className="w-full pl-10 pr-4 py-3 bg-nexus-card/50 border border-nexus-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-nexus-primary focus:ring-1 focus:ring-nexus-primary transition-all"
                  placeholder="trader@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold tracking-wider text-nexus-muted uppercase ml-1">Senha de Acesso</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-nexus-primary transition-colors" size={18} />
                <input 
                  type="password"
                  className="w-full pl-10 pr-4 py-3 bg-nexus-card/50 border border-nexus-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-nexus-primary focus:ring-1 focus:ring-nexus-primary transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs flex items-center gap-2 animate-shake">
                <AlertTriangle size={14} />
                {error}
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-nexus-primary/10 border border-nexus-primary/20 rounded-lg text-nexus-primary text-xs flex items-center gap-2">
                <CheckCircle size={14} />
                {successMessage}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 px-4 bg-nexus-primary hover:bg-nexus-400 text-black font-bold rounded-lg transition-all transform active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,229,153,0.3)] hover:shadow-[0_0_25px_rgba(0,229,153,0.5)]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Autenticando...
                </span>
              ) : (
                <>
                  {isLogin ? 'Acessar Plataforma' : 'Criar Conta Grátis'} 
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center pt-6 border-t border-white/5">
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); setSuccessMessage(''); }}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {isLogin ? 'Novo por aqui? ' : 'Já é membro? '}
              <span className="text-nexus-primary font-medium hover:underline">
                {isLogin ? 'Criar conta' : 'Fazer Login'}
              </span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-6 text-nexus-muted/20 text-[10px] font-mono tracking-widest uppercase">
        NexusTrade AI v3.0 • Secure Connection
      </div>
    </div>
  );
};