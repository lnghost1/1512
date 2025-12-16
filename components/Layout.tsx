
import React from 'react';
import { LogOut, LayoutDashboard, BookOpen, Menu, X, Trophy, Users, Crown, Zap, ExternalLink } from 'lucide-react';
import { useAuth } from '../App';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const BROKER_LINK = "https://trade.polariumbroker.com/register?aff=753731&aff_model=revenue&afftrack=";

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) => `
    flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium border border-transparent
    ${isActive(path) 
      ? 'bg-nexus-primary/10 text-nexus-primary border-nexus-primary/20 shadow-[0_0_15px_rgba(0,229,153,0.1)]' 
      : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}
  `;

  return (
    <div className="min-h-screen bg-[#050505] grid-bg flex text-gray-100 font-sans selection:bg-nexus-primary selection:text-black">
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-nexus-card border-r border-nexus-border hidden md:flex flex-col sticky top-0 h-screen z-50">
        <div className="p-6 border-b border-nexus-border flex items-center justify-center">
            <Link to="/dashboard">
                <Logo size={28} />
            </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto">
          <div className="px-4 mb-2 text-[10px] font-bold text-nexus-muted uppercase tracking-wider">Menu Principal</div>
          <Link to="/dashboard" className={navLinkClass('/dashboard')}>
            <LayoutDashboard size={18} />
            <span>Análise Gráfica</span>
          </Link>
          <Link to="/ranking" className={navLinkClass('/ranking')}>
            <Trophy size={18} />
            <span>Ranking Global</span>
          </Link>
          <div className="mt-6 px-4 mb-2 text-[10px] font-bold text-nexus-muted uppercase tracking-wider">Social & Educação</div>
          <Link to="/community" className={navLinkClass('/community')}>
            <Users size={18} />
            <span>Comunidade</span>
          </Link>
          <Link to="/learning" className={navLinkClass('/learning')}>
            <BookOpen size={18} />
            <span>Aprendizado</span>
          </Link>
        </nav>

        <div className="p-4 bg-black/20 space-y-4">
            {/* Banner Corretora */}
            <div className="p-3 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border border-blue-500/20 rounded-xl">
               <div className="flex items-center gap-2 text-blue-400 font-bold text-[10px] uppercase mb-1">
                 <Zap size={12} /> Corretora Oficial
               </div>
               <p className="text-xs text-gray-300 mb-2 leading-tight">Ainda não tem conta para operar?</p>
               <a 
                 href={BROKER_LINK}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="block w-full text-center bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold py-2 rounded transition-colors"
               >
                 CRIAR CONTA GRÁTIS
               </a>
            </div>

            {/* Plan Status Card */}
            {user?.plan === 'free' && (
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-center">
                    <div className="text-xs text-gray-400 mb-2">Plano Grátis</div>
                    <Link to="/checkout" className="block w-full bg-nexus-primary text-black text-xs font-bold py-2 rounded hover:bg-nexus-400 transition-colors">
                        Fazer Upgrade
                    </Link>
                </div>
            )}

            <div className="border-t border-nexus-border pt-4">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-nexus-primary to-nexus-800 flex items-center justify-center text-sm font-bold text-white shadow-lg relative">
                    {user?.name.charAt(0).toUpperCase()}
                    {user?.plan === 'pro' && (
                        <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-0.5">
                            <Crown size={8} className="text-black" fill="black" />
                        </div>
                    )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold truncate text-white">{user?.name}</p>
                    <p className="text-[10px] text-nexus-primary flex items-center gap-1 uppercase font-bold">
                        <span className={`w-1.5 h-1.5 rounded-full ${user?.plan === 'pro' ? 'bg-yellow-500' : 'bg-nexus-primary'} animate-pulse`}></span>
                        {user?.plan === 'pro' ? 'Trader Pro' : 'Membro Free'}
                    </p>
                    </div>
                </div>
                <button 
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-gray-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 border border-transparent rounded-lg transition-all"
                >
                    <LogOut size={14} />
                    Desconectar
                </button>
            </div>
        </div>
      </aside>

      {/* Mobile Header & Menu Overlay */}
      <div className={`fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-xl md:hidden transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-3">
             <Logo size={24} />
             <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-white/5 rounded-lg"><X size={24} /></button>
          </div>
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-nexus-border bg-white/5">
              <span className={`w-2 h-2 rounded-full ${user?.plan === 'pro' ? 'bg-yellow-500' : 'bg-nexus-primary'} animate-pulse`}></span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-200">
                {user?.plan === 'pro' ? 'Plano Pro' : 'Plano Free'}
              </span>
            </div>
          </div>
          <nav className="space-y-2 flex-1">
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className={navLinkClass('/dashboard')}>
              <LayoutDashboard size={20} />
              <span>Análise Gráfica</span>
            </Link>
            <Link to="/ranking" onClick={() => setMobileMenuOpen(false)} className={navLinkClass('/ranking')}>
              <Trophy size={20} />
              <span>Ranking</span>
            </Link>
            <Link to="/community" onClick={() => setMobileMenuOpen(false)} className={navLinkClass('/community')}>
              <Users size={20} />
              <span>Comunidade</span>
            </Link>
            <Link to="/learning" onClick={() => setMobileMenuOpen(false)} className={navLinkClass('/learning')}>
              <BookOpen size={20} />
              <span>Aprendizado</span>
            </Link>
            {user?.plan === 'free' && (
                <Link to="/checkout" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-nexus-primary text-black font-bold mt-4">
                    <Crown size={20} />
                    <span>Virar PRO</span>
                </Link>
            )}
             <a 
                 href={BROKER_LINK}
                 target="_blank"
                 rel="noopener noreferrer"
                 onClick={() => setMobileMenuOpen(false)}
                 className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold mt-2"
               >
                 <Zap size={20} />
                 <span>Criar Conta Corretora</span>
             </a>
          </nav>
          <button onClick={logout} className="flex items-center gap-3 px-4 py-4 text-red-400 bg-red-500/10 rounded-xl justify-center font-bold">
            <LogOut size={20} />
            <span>Sair do App</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="md:hidden bg-[#050505]/80 backdrop-blur-md border-b border-nexus-border p-4 flex justify-between items-center sticky top-0 z-40">
          <Logo size={24} showText={true} />
          <button onClick={() => setMobileMenuOpen(true)} className="text-gray-400 p-2 border border-nexus-border rounded-lg">
            <Menu size={24} />
          </button>
        </header>
        <div className="flex-1 p-4 md:p-8 overflow-y-auto scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  );
};
