
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { ArrowRight, CheckCircle, Shield, Play, AlertTriangle, Lock, Clock, Battery, Zap } from 'lucide-react';
 import { WhatsAppIcon } from '../components/WhatsAppIcon';

export const Landing: React.FC = () => {
  // Timer de escassez falso para aumentar conversão
  const [timeLeft, setTimeLeft] = useState({ minutes: 14, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds === 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        }
        return { ...prev, seconds: prev.seconds - 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden">
      
      {/* --- BARRA DE URGÊNCIA --- */}
      <div className="bg-red-600 text-white text-center py-2 px-4 font-bold text-xs md:text-sm uppercase tracking-widest animate-pulse sticky top-0 z-50">
        <span className="flex items-center justify-center gap-2">
          <AlertTriangle size={16} fill="white" className="text-red-600" />
          Atenção: As vagas para o plano vitalício encerram em {timeLeft.minutes}:{timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}
        </span>
      </div>

      {/* --- HERO SECTION --- */}
      <header className="relative pt-12 pb-20 px-4 overflow-hidden">
        {/* Background Efeitos */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639322537228-ad7116995e5d?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/90 to-[#050505]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-nexus-primary/10 via-transparent to-transparent opacity-50"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          
          <Logo size={40} className="mb-8" />

          <div className="inline-flex items-center gap-2 bg-nexus-primary/10 border border-nexus-primary/50 text-nexus-primary px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nexus-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-nexus-primary"></span>
            </span>
            Nova Tecnologia Liberada
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.05] uppercase tracking-tight">
            Descubra Como <span className="text-transparent bg-clip-text bg-gradient-to-r from-nexus-primary to-green-400">Extrair Lucro</span> do Mercado Usando <span className="bg-white text-black px-2 transform -skew-x-6 inline-block">Inteligência Artificial</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
            O NexusTrade analisa <b>milhões de candles em segundos</b> e te diz exatamente onde entrar e onde sair. <span className="text-nexus-primary font-bold">Sem achismo. Sem emocional.</span>
          </p>

          {/* VSL (Video Sales Letter) */}
          <div className="w-full max-w-4xl aspect-video bg-black rounded-xl border-4 border-nexus-primary/30 shadow-[0_0_100px_rgba(0,229,153,0.15)] relative group cursor-pointer overflow-hidden mb-10">
             <img 
               src="https://images.unsplash.com/photo-1640340434855-6084b1f4901c?q=80&w=1600&auto=format&fit=crop" 
               className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
               alt="Capa do Vídeo"
             />
             <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-24 h-24 bg-nexus-primary rounded-full flex items-center justify-center pl-2 shadow-[0_0_50px_rgba(0,229,153,0.5)] animate-pulse group-hover:scale-110 transition-transform">
                 <Play size={40} fill="black" className="text-black" />
               </div>
             </div>
             <div className="absolute bottom-0 w-full bg-black/80 py-3 text-center text-sm font-bold text-white uppercase tracking-wider">
               <span className="text-nexus-primary">PASSO 1:</span> Assista ao vídeo de apresentação
             </div>
          </div>

          {/* BOTÃO CTA PRINCIPAL */}
          <div className="w-full max-w-md mx-auto space-y-4">
            <a href="#checkout" className="block w-full bg-gradient-to-r from-nexus-primary to-green-500 hover:from-green-400 hover:to-nexus-primary text-black text-xl md:text-2xl font-black uppercase py-6 rounded-xl shadow-[0_0_40px_rgba(0,229,153,0.4)] hover:shadow-[0_0_60px_rgba(0,229,153,0.6)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 animate-pulse-slow">
              Quero Meu Acesso Agora <ArrowRight size={28} strokeWidth={3} />
            </a>
            <div className="flex justify-center items-center gap-4 text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1"><Shield size={12} /> Compra Segura</span>
              <span className="flex items-center gap-1"><Zap size={12} /> Acesso Imediato</span>
              <span className="flex items-center gap-1"><Lock size={12} /> Privacidade Total</span>
            </div>
          </div>
        </div>
      </header>

      {/* --- FAIXA DE RESULTADOS (PROVA SOCIAL) --- */}
      <section className="py-8 bg-nexus-primary/5 border-y border-nexus-primary/10 overflow-hidden">
         <div className="max-w-6xl mx-auto px-4">
            <p className="text-center text-nexus-primary font-bold uppercase tracking-widest text-xs mb-6">Trader Scan • Nexus AI • Pattern Recognition</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
               <div className="bg-black/40 p-4 rounded-lg border border-white/5">
                  <div className="text-3xl font-black text-white">98.2%</div>
                  <div className="text-xs text-gray-400 uppercase">Precisão Atual</div>
               </div>
               <div className="bg-black/40 p-4 rounded-lg border border-white/5">
                  <div className="text-3xl font-black text-white">+12.4k</div>
                  <div className="text-xs text-gray-400 uppercase">Traders Ativos</div>
               </div>
               <div className="bg-black/40 p-4 rounded-lg border border-white/5">
                  <div className="text-3xl font-black text-white">24/7</div>
                  <div className="text-xs text-gray-400 uppercase">Monitoramento</div>
               </div>
               <div className="bg-black/40 p-4 rounded-lg border border-white/5">
                  <div className="text-3xl font-black text-white">0.2s</div>
                  <div className="text-xs text-gray-400 uppercase">Tempo de Análise</div>
               </div>
            </div>
         </div>
      </section>

      {/* --- O PROBLEMA VS SOLUÇÃO --- */}
      <section className="py-20 bg-[#080808]">
        <div className="max-w-5xl mx-auto px-4">
           <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                 <h2 className="text-3xl md:text-4xl font-black uppercase mb-6 leading-tight">
                    Por que você <span className="text-red-500 line-through">perde dinheiro</span> todos os dias?
                 </h2>
                 <ul className="space-y-6">
                    <li className="flex gap-4">
                       <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500 shrink-0"><AlertTriangle /></div>
                       <div>
                          <h3 className="font-bold text-lg text-white">Overtrading</h3>
                          <p className="text-gray-400 text-sm">Você opera quando não deve, movido pela ansiedade, e devolve todo o lucro.</p>
                       </div>
                    </li>
                    <li className="flex gap-4">
                       <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500 shrink-0"><Clock /></div>
                       <div>
                          <h3 className="font-bold text-lg text-white">Falta de Tempo</h3>
                          <p className="text-gray-400 text-sm">Você perde as melhores oportunidades porque não pode ficar 24h na frente da tela.</p>
                       </div>
                    </li>
                    <li className="flex gap-4">
                       <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500 shrink-0"><Battery /></div>
                       <div>
                          <h3 className="font-bold text-lg text-white">Cansaço Mental</h3>
                          <p className="text-gray-400 text-sm">Depois de 1 hora analisando, seu cérebro falha e você comete erros bobos.</p>
                       </div>
                    </li>
                 </ul>
              </div>
              
              <div className="relative">
                 <div className="absolute inset-0 bg-nexus-primary/20 blur-[80px] rounded-full"></div>
                 <div className="relative bg-[#0A0A0A] border border-nexus-primary rounded-2xl p-8 shadow-2xl">
                    <div className="text-xs font-bold text-nexus-primary uppercase tracking-widest mb-4">A Solução NexusTrade</div>
                    <h3 className="text-2xl font-black text-white mb-4">Nós fazemos o trabalho duro. Você aperta o botão.</h3>
                    <p className="text-gray-300 mb-6">
                       Nossa Inteligência Artificial foi treinada com milhões de padrões gráficos. Ela não sente medo, não sente ganância e não cansa.
                    </p>
                    <div className="p-4 bg-nexus-primary/10 border border-nexus-primary/20 rounded-lg flex items-center gap-4">
                       <CheckCircle className="text-nexus-primary" size={32} />
                       <div className="font-bold text-white">Resultado: 98% de Assertividade na identificação de tendências.</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* --- COMO FUNCIONA (Passo a Passo) --- */}
      <section className="py-20 relative overflow-hidden">
         <div className="absolute inset-0 grid-bg opacity-10"></div>
         <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
            <h2 className="text-3xl md:text-5xl font-black uppercase mb-16">
               Como você vai <span className="text-nexus-primary">lucrar</span> hoje
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
               <div className="bg-[#0A0A0A] p-6 rounded-2xl border border-white/10 hover:border-nexus-primary transition-colors group">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-2xl font-black text-white mx-auto mb-6 group-hover:bg-nexus-primary group-hover:text-black transition-colors">1</div>
                  <h3 className="text-xl font-bold text-white mb-2">Tire um Print</h3>
                  <p className="text-gray-400 text-sm">Viu um gráfico interessante? Tire um print ou copie a imagem.</p>
               </div>
               <div className="bg-[#0A0A0A] p-6 rounded-2xl border border-white/10 hover:border-nexus-primary transition-colors group">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-2xl font-black text-white mx-auto mb-6 group-hover:bg-nexus-primary group-hover:text-black transition-colors">2</div>
                  <h3 className="text-xl font-bold text-white mb-2">Envie para a IA</h3>
                  <p className="text-gray-400 text-sm">Cole no NexusTrade. Em 2 segundos nossa IA processa os dados.</p>
               </div>
               <div className="bg-[#0A0A0A] p-6 rounded-2xl border border-white/10 hover:border-nexus-primary transition-colors group">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-2xl font-black text-white mx-auto mb-6 group-hover:bg-nexus-primary group-hover:text-black transition-colors">3</div>
                  <h3 className="text-xl font-bold text-white mb-2">Lucre</h3>
                  <p className="text-gray-400 text-sm">Receba o sinal (Compra/Venda) e opere com confiança institucional.</p>
               </div>
            </div>
         </div>
      </section>

      {/* --- OFFER SECTION (Checkout Anchor) --- */}
      <section id="checkout" className="py-24 bg-[#0A0A0A] border-t border-nexus-primary/30 relative overflow-hidden">
        {/* Luz de fundo pulsante */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-nexus-primary/5 blur-[120px] rounded-full animate-pulse-slow"></div>

        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <div className="bg-black border-2 border-nexus-primary rounded-3xl p-8 md:p-12 shadow-[0_0_80px_rgba(0,229,153,0.15)] text-center relative overflow-hidden">
            
            {/* Faixa de Promoção */}
            <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-black uppercase px-6 py-2 rounded-bl-xl">
               Oferta Exclusiva
            </div>

            <div className="mb-8">
               <h3 className="text-3xl md:text-5xl font-black text-white uppercase mb-2">Acesso <span className="text-nexus-primary">Vitalício</span></h3>
               <p className="text-gray-400 text-lg">Pare de pagar mensalidades. Tenha a ferramenta para sempre.</p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-10">
               <div className="text-gray-500 line-through text-xl font-medium">R$ 497,00</div>
               <div className="text-6xl md:text-7xl font-black text-white tracking-tighter">R$ 49,90</div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-left mb-10 bg-[#0A0A0A] p-6 rounded-xl border border-white/10">
               <li className="flex items-center gap-2 text-sm text-white"><CheckCircle className="text-nexus-primary" size={16} /> Uploads Ilimitados</li>
               <li className="flex items-center gap-2 text-sm text-white"><CheckCircle className="text-nexus-primary" size={16} /> Análise Técnica IA v3.0</li>
               <li className="flex items-center gap-2 text-sm text-white"><WhatsAppIcon className="text-nexus-primary" size={16} /> Suporte VIP WhatsApp</li>
               <li className="flex items-center gap-2 text-sm text-white"><CheckCircle className="text-nexus-primary" size={16} /> Acesso Mobile e PC</li>
            </div>

            <Link 
              to="/checkout"
              className="w-full bg-green-600 hover:bg-green-500 text-white font-black text-xl md:text-2xl py-6 rounded-xl shadow-lg flex items-center justify-center gap-3 uppercase transition-transform hover:scale-[1.02] animate-pulse-slow"
            >
              GARANTIR MINHA VAGA AGORA <ArrowRight size={28} />
            </Link>
            
            <p className="mt-6 text-xs text-gray-500 font-bold uppercase tracking-widest">
               Pagamento Único • Garantia de 7 Dias • Acesso Imediato
            </p>
          </div>

          <div className="mt-8 flex justify-center items-center gap-8 grayscale opacity-50">
             {/* Fake Security Badges */}
             <div className="flex items-center gap-2 text-gray-400 font-bold text-xs"><Lock size={14}/> SSL SECURE</div>
             <div className="flex items-center gap-2 text-gray-400 font-bold text-xs"><Shield size={14}/> 7-DAY GUARANTEE</div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-8 bg-black text-center border-t border-white/10 text-xs text-gray-600">
        <p className="mb-2">NexusTrade © 2024 - Todos os direitos reservados.</p>
        <p>Aviso: Trading envolve riscos. Resultados passados não garantem lucros futuros.</p>
      </footer>

    </div>
  );
};
