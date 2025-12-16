
import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, AlertTriangle, TrendingUp, TrendingDown, Minus, RefreshCw, Trash2, Activity, Crosshair, Clipboard, FileImage, CheckCircle, Lock, ExternalLink, Zap, X } from 'lucide-react';
import { analyzeChart, fileToGenerativePart } from '../services/geminiService';
import { historyService } from '../services/historyService';
import { AnalysisResult, HistoryItem } from '../types';
import { useAuth } from '../App';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false); // Estado para controlar o modal de bloqueio
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isPro = user?.plan === 'pro';
  const KIRVANO_LINK = "https://pay.kirvano.com/e16d6c29-1f5f-491f-b3ff-e561dd625b16";
  const BROKER_LINK = "https://trade.polariumbroker.com/register?aff=753731&aff_model=revenue&afftrack=";

  // Carregar histórico
  useEffect(() => {
    const loadHistory = async () => {
      const items = await historyService.getHistory();
      setHistory(items);
    };
    loadHistory();
  }, [user]);

  // Listener para Colar (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (loading || result || showPaywall) return;

      if (e.clipboardData && e.clipboardData.items) {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            if (blob) {
              handleFileSelect(blob);
            }
            break;
          }
        }
      }
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [loading, result, showPaywall]);

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
    } else {
      setError('Por favor, selecione apenas arquivos de imagem.');
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !preview) return;

    setLoading(true);
    setError(null);

    // LÓGICA DE BLOQUEIO PÓS-CLICK (SIMULAÇÃO)
    if (!isPro) {
        // Simula o tempo de análise da IA para gerar expectativa
        await new Promise(r => setTimeout(r, 2500)); 
        
        setLoading(false);
        setShowPaywall(true); // Exibe o modal de bloqueio
        return;
    }

    try {
      const base64 = await fileToGenerativePart(file);
      const analysis = await analyzeChart(base64, file.type);
      
      setResult(analysis);
      
      await historyService.addAnalysis(file, analysis);
      const updatedHistory = await historyService.getHistory();
      setHistory(updatedHistory);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Falha na análise. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  const handlePasteButton = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const item of clipboardItems) {
        const imageTypes = item.types.filter(type => type.startsWith('image/'));
        for (const type of imageTypes) {
          const blob = await item.getType(type);
          const file = new File([blob], "pasted-image.png", { type });
          handleFileSelect(file);
          return;
        }
      }
      setError("Nenhuma imagem encontrada na área de transferência.");
    } catch (err) {
      setError("Permissão para colar negada ou erro ao ler área de transferência.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 relative">
      
      {/* MODAL PAYWALL (Aparece apenas quando o usuário Free tenta analisar) */}
      {showPaywall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
             <div className="bg-[#0A0A0A] border border-nexus-primary/50 rounded-2xl p-8 max-w-md w-full relative shadow-[0_0_50px_rgba(0,229,153,0.2)]">
                <button 
                    onClick={() => setShowPaywall(false)} 
                    className="absolute top-4 right-4 text-gray-500 hover:text-white"
                >
                    <X size={24} />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-2xl border border-white/10 animate-bounce">
                        <Lock size={40} className="text-nexus-primary" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2">Análise Concluída</h3>
                    <p className="text-nexus-primary font-bold uppercase text-xs tracking-widest mb-4">Sinal de entrada detectado</p>
                    
                    <p className="text-gray-300 mb-8 leading-relaxed">
                        A Inteligência Artificial identificou uma oportunidade neste gráfico. Para revelar o sinal (Compra/Venda) e os alvos, você precisa ativar sua chave de acesso.
                    </p>
                    
                    <div className="flex flex-col gap-3 w-full">
                        <a 
                            href={KIRVANO_LINK} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full bg-nexus-primary hover:bg-nexus-400 text-black font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,229,153,0.3)] hover:scale-105"
                        >
                            Comprar Acesso Agora <ExternalLink size={18} />
                        </a>
                        <Link 
                            to="/checkout"
                            className="text-sm text-gray-400 hover:text-white underline decoration-nexus-primary/50 underline-offset-4 mt-2"
                        >
                            Já tenho uma chave de acesso
                        </Link>
                    </div>
                </div>
             </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-nexus-border pb-4 gap-4">
        <div>
           <h2 className="text-2xl font-bold text-white flex items-center gap-2">
             <span className="text-nexus-primary">NEXUS</span>TRADE
           </h2>
           <p className="text-nexus-muted text-sm mt-1">Terminal de Análise de Price Action IA v3.0</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 animate-shake">
          <AlertTriangle size={20} />
          {error}
        </div>
      )}

      {!result ? (
        <div className="animate-fade-in">
          
          {/* ÁREA DE UPLOAD */}
          <div 
            className={`
              relative group
              min-h-[320px] sm:min-h-[450px] flex flex-col items-center justify-center
              rounded-3xl border-2 border-dashed transition-all duration-300 overflow-hidden
              ${isDragging 
                    ? 'border-nexus-primary bg-nexus-primary/5 scale-[1.01] cursor-pointer' 
                    : 'border-nexus-border bg-[#0A0A0A] hover:border-nexus-primary/50 hover:bg-[#0F0F0F] cursor-pointer'
              }
            `}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => {
                if(!preview) fileInputRef.current?.click();
            }}
          >
            {!preview ? (
              <div className={`text-center p-8 z-10 relative`}>
                 <div className="w-20 h-20 bg-nexus-card rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border border-white/5 group-hover:border-nexus-primary/30 transition-colors">
                    <UploadCloud size={40} className="text-nexus-muted group-hover:text-nexus-primary transition-colors" />
                 </div>
                 <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Enviar Gráfico para Análise</h3>
                 <p className="text-gray-400 max-w-md mx-auto mb-2">
                   Arraste ou selecione o print do gráfico da sua corretora para análise.
                 </p>
                 <p className="text-gray-400 max-w-md mx-auto mb-2">
                   Cole seu print da corretora
                 </p>
                 <p className="text-nexus-primary text-sm font-medium mt-4">
                   Dica: Foque nas últimas 20 velas para maior precisão.
                 </p>
                 
                 {/* Visual de Gráfico Exemplo (CSS/SVG) */}
                 <div className="mt-10 relative w-64 mx-auto pointer-events-none select-none">
                    <div className="absolute inset-0 bg-nexus-primary/20 blur-[40px] rounded-full opacity-20"></div>
                    <div className="bg-[#050505] border border-nexus-border rounded-lg p-2 shadow-2xl relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                        <div className="flex items-center justify-between mb-2 border-b border-white/5 pb-1 px-1">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                                <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                                <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                            </div>
                            <div className="text-[8px] font-mono text-nexus-primary animate-pulse">AI SCANNING</div>
                        </div>
                        <div className="h-24 w-full relative bg-grid-bg opacity-80">
                            <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                                <path d="M0 40 L10 42 L20 30 L30 35 L40 20 L50 25 L60 15 L70 18 L80 5 L90 10 L100 2" 
                                      fill="none" stroke="#00E599" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                                <path d="M0 40 L10 42 L20 30 L30 35 L40 20 L50 25 L60 15 L70 18 L80 5 L90 10 L100 2 V 50 H 0 Z" 
                                      fill="url(#gradient)" opacity="0.2" />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#00E599" />
                                        <stop offset="100%" stopColor="transparent" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute top-0 left-0 w-[2px] h-full bg-nexus-primary shadow-[0_0_10px_#00E599] animate-[shake_3s_ease-in-out_infinite_alternate] opacity-50"></div>
                        </div>
                    </div>
                 </div>

                 <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                 />
              </div>
            ) : (
              <div className="w-full h-full p-4 flex flex-col items-center relative z-10">
                 <img src={preview} alt="Preview" className="max-h-[500px] w-auto rounded-xl shadow-2xl border border-nexus-border object-contain" />
                 <button 
                   onClick={(e) => { e.stopPropagation(); reset(); }}
                   className="absolute top-6 right-6 p-2 bg-black/80 text-white rounded-full hover:bg-red-500 transition-colors border border-white/10"
                 >
                   <Trash2 size={20} />
                 </button>
              </div>
            )}
            
            {/* Click handler for the whole area if no preview */}
            {!preview && <div className="absolute inset-0 z-0" onClick={() => fileInputRef.current?.click()} />}
          </div>

          {/* BOTÕES DE AÇÃO - VISÍVEIS PARA TODOS AGORA */}
          <div className="flex flex-col md:flex-row gap-4 mt-8 justify-center">
                {!preview ? (
                <>
                    <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-8 py-4 bg-nexus-primary hover:bg-nexus-400 text-black font-bold rounded-xl flex items-center justify-center gap-3 transition-all hover:scale-105 shadow-[0_0_20px_rgba(0,229,153,0.3)]"
                    >
                    <FileImage size={20} /> Escolher Arquivo
                    </button>
                    <button 
                    onClick={handlePasteButton}
                    className="px-8 py-4 bg-nexus-card border border-nexus-border hover:border-nexus-primary text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-all hover:bg-white/5"
                    >
                    <Clipboard size={20} /> Colar Imagem
                    </button>
                </>
                ) : (
                <button 
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="w-full md:w-auto px-12 py-4 bg-nexus-primary hover:bg-nexus-400 text-black font-bold rounded-xl flex items-center justify-center gap-3 transition-all hover:scale-105 shadow-[0_0_30px_rgba(0,229,153,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                        Processando Análise...
                        </>
                    ) : (
                        <>
                        <Activity size={20} /> VER ANALISE
                        </>
                    )}
                </button>
                )}
          </div>
        </div>
      ) : (
        <div className="animate-fade-in space-y-6">
          
          <div className="flex flex-col md:flex-row gap-4 items-stretch">
            {/* VEREDITO PRINCIPAL */}
            <div className={`flex-1 p-6 rounded-2xl border flex flex-col justify-center items-center text-center shadow-[0_0_30px_rgba(0,0,0,0.3)] ${
              result.signal === 'BUY' ? 'bg-nexus-primary/10 border-nexus-primary/50 shadow-[0_0_20px_rgba(0,229,153,0.15)]' : 
              result.signal === 'SELL' ? 'bg-nexus-danger/10 border-nexus-danger/50 shadow-[0_0_20px_rgba(255,41,80,0.15)]' : 
              'bg-gray-800/50 border-gray-700'
            }`}>
              <div className="text-xs font-black tracking-[0.2em] uppercase mb-2 text-white/50">Veredito da IA</div>
              <div className={`text-4xl md:text-5xl font-black uppercase flex items-center gap-3 ${
                result.signal === 'BUY' ? 'text-nexus-primary neon-text-green' : 
                result.signal === 'SELL' ? 'text-nexus-danger neon-text-red' : 
                'text-gray-400'
              }`}>
                {result.signal === 'BUY' && <TrendingUp size={48} />}
                {result.signal === 'SELL' && <TrendingDown size={48} />}
                {result.signal === 'NEUTRAL' && <Minus size={48} />}
                {result.signal === 'BUY' ? 'COMPRA' : result.signal === 'SELL' ? 'VENDA' : 'NEUTRO'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="glass-panel p-4 rounded-xl border-l-2 border-blue-500">
                <div className="text-[10px] text-nexus-muted uppercase font-bold mb-1 tracking-wider">Padrão Identificado</div>
                <div className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity size={18} className="text-blue-500" />
                  {result.pattern}
                </div>
             </div>

             <div className="glass-panel p-4 rounded-xl border-l-2 border-purple-500">
                <div className="text-[10px] text-nexus-muted uppercase font-bold mb-1 tracking-wider">Tendência Macro</div>
                <div className="text-lg font-bold text-white flex items-center gap-2">
                  <Crosshair size={18} className="text-purple-500" />
                  {result.trend}
                </div>
             </div>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-nexus-border">
             <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="text-nexus-primary" size={20} />
                Análise Institucional
             </h3>
             <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {result.reasoning}
             </p>

             <div className="grid md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-white/5">
                <div>
                   <h4 className="text-xs font-bold text-green-400 uppercase tracking-wider mb-3">Suportes (Compradores)</h4>
                   <div className="flex flex-wrap gap-2">
                      {result.supportLevels.map((level, i) => (
                        <span key={i} className="px-3 py-1 bg-green-500/10 text-green-400 rounded text-sm font-mono border border-green-500/20">{level}</span>
                      ))}
                   </div>
                </div>
                <div>
                   <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-3">Resistências (Vendedores)</h4>
                   <div className="flex flex-wrap gap-2">
                      {result.resistanceLevels.map((level, i) => (
                        <span key={i} className="px-3 py-1 bg-red-500/10 text-red-400 rounded text-sm font-mono border border-red-500/20">{level}</span>
                      ))}
                   </div>
                </div>
             </div>
          </div>

          <div className="flex gap-4">
             <button 
               onClick={reset}
               className="flex-1 py-4 bg-nexus-card border border-nexus-border hover:bg-white/5 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
             >
                <RefreshCw size={20} /> Nova Análise
             </button>
          </div>

        </div>
      )}

      {/* BANNER DE AFILIAÇÃO CORRETORA */}
      <div className="mt-12 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="relative z-10 text-center md:text-left">
           <div className="flex items-center justify-center md:justify-start gap-2 mb-2 text-blue-400 font-bold uppercase text-xs tracking-wider">
              <Zap size={14} /> Parceiro Oficial
           </div>
           <h3 className="text-xl font-bold text-white mb-2">Ainda não é cadastrado em uma corretora, crie sua conta por aqui</h3>
           <p className="text-gray-300 text-sm max-w-lg">
             Para operar com nossas análises, você precisa de uma plataforma confiável. Crie sua conta gratuita agora e ganhe bônus exclusivos.
           </p>
        </div>
        <a 
          href={BROKER_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 whitespace-nowrap px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 flex items-center gap-2"
        >
          Criar Conta Grátis <ExternalLink size={18} />
        </a>
      </div>

      {/* HISTÓRICO DE ANÁLISES */}
      {history.length > 0 && !result && isPro && (
        <div className="mt-20">
           <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <CheckCircle className="text-nexus-muted" /> Histórico Recente
           </h3>
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {history.map((item) => (
                <div key={item.id} className="glass-panel rounded-xl overflow-hidden group hover:border-nexus-primary/30 transition-all">
                   <div className="h-32 bg-black relative">
                      <img src={item.imageUrl} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" alt="Histórico" />
                      <div className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        item.result.signal === 'BUY' ? 'bg-green-500 text-black' : 
                        item.result.signal === 'SELL' ? 'bg-red-500 text-white' : 
                        'bg-gray-500 text-white'
                      }`}>
                         {item.result.signal}
                      </div>
                   </div>
                   <div className="p-3">
                      <div className="text-xs text-white font-bold truncate">{item.result.pattern}</div>
                      <div className="text-[10px] text-nexus-muted">{new Date().toLocaleDateString()}</div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

    </div>
  );
};
