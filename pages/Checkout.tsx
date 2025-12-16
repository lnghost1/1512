
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { useAuth } from '../App';
import { authService } from '../services/authService';
import { ShieldCheck, Lock, CheckCircle, Key, ExternalLink, ShoppingCart, Infinity } from 'lucide-react';

export const Checkout: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  // Link Oficial do Produto Kirvano
  const KIRVANO_PRODUCT_LINK = "https://pay.kirvano.com/e16d6c29-1f5f-491f-b3ff-e561dd625b16"; 

  const handleActivation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await authService.activateProPlan(licenseKey);
      
      // Navega e recarrega para atualizar permissões
      navigate('/dashboard');
      setTimeout(() => {
        window.location.reload();
      }, 100);
      
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Erro ao ativar chave.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] grid-bg flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 bg-nexus-card border border-nexus-border rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Lado Esquerdo: Benefícios */}
        <div className="p-8 bg-[#0A0A0A] flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-nexus-primary/5 opacity-50 pointer-events-none"></div>
          <div>
            <Logo size={28} className="mb-8" />
            <div className="text-nexus-muted text-xs font-bold uppercase tracking-widest mb-2">Plano Selecionado</div>
            <h2 className="text-3xl font-bold text-white mb-4">NexusTrade PRO</h2>
            
            <div className="my-6 p-4 bg-nexus-primary/10 border border-nexus-primary/20 rounded-xl flex items-start gap-3">
               <div className="bg-nexus-primary text-black p-1 rounded">
                 <Infinity size={20} />
               </div>
               <div>
                 <div className="text-nexus-primary text-sm font-bold mb-1">Acesso Vitalício</div>
                 <div className="text-gray-400 text-xs">Você paga uma única vez e tem acesso para sempre. Sem cobranças surpresas.</div>
               </div>
            </div>
            
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-300">
                <CheckCircle size={18} className="text-nexus-primary" /> Análises de IA Ilimitadas
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <CheckCircle size={18} className="text-nexus-primary" /> Acesso ao Grupo VIP
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <CheckCircle size={18} className="text-nexus-primary" /> Suporte Prioritário
              </li>
            </ul>
          </div>
          <div className="mt-12 pt-6 border-t border-white/5">
             <div className="flex items-center gap-2 text-nexus-muted text-sm">
              <ShieldCheck size={16} className="text-nexus-primary" /> Garantia de 7 dias pela Kirvano
            </div>
          </div>
        </div>

        {/* Lado Direito: Compra e Ativação */}
        <div className="p-8 flex flex-col justify-center">
          
          {/* Opção 1: Comprar */}
          <div className="mb-8 pb-8 border-b border-white/5">
             <div className="flex justify-between items-start mb-2">
               <h3 className="text-white font-bold flex items-center gap-2">
                  <ShoppingCart size={20} className="text-nexus-primary"/>
                  Ainda não tem acesso?
               </h3>
               <span className="bg-white/10 text-white text-[10px] font-bold px-2 py-1 rounded border border-white/20">VITALÍCIO</span>
             </div>
             <p className="text-gray-400 text-sm mb-4">Adquira sua licença agora mesmo. Você receberá o código no seu email.</p>
             
             <a 
               href={KIRVANO_PRODUCT_LINK}
               target="_blank"
               rel="noopener noreferrer"
               className="w-full bg-white text-black hover:bg-gray-200 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all group shadow-lg"
             >
                Comprar Acesso Vitalício <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform"/>
             </a>
          </div>

          {/* Opção 2: Ativar */}
          <div>
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
               <Key size={20} className="text-nexus-primary"/>
               Já tenho o código
            </h3>
            
            <form onSubmit={handleActivation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Chave de Licença</label>
                <input 
                   type="text" 
                   value={licenseKey}
                   onChange={(e) => setLicenseKey(e.target.value)}
                   className="w-full bg-black border border-nexus-border rounded-lg px-4 py-3 text-white focus:border-nexus-primary outline-none transition-colors placeholder-gray-700 font-mono uppercase" 
                   placeholder="INSIRA SEU CÓDIGO AQUI" 
                   required 
                />
              </div>

              {error && (
                 <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
                    {error}
                 </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-nexus-primary hover:bg-nexus-400 text-black font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(0,229,153,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verificando...' : (
                    <>
                        <Lock size={18} /> Validar e Liberar Acesso
                    </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
