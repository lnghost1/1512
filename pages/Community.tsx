import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Users, ShieldCheck, Globe } from 'lucide-react';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import communityHeroImage from '../Gemini_Generated_Image_73tgiw73tgiw73tg.png';

export const Community: React.FC = () => {
  const testimonials = useMemo(
    () =>
      ([
        { id: 1, name: 'Felipe', photoUrl: '/provas/prova-01.jpg' },
        { id: 2, name: 'Leandro', photoUrl: '/provas/prova-02.jpg' },
        { id: 3, name: 'Oliveira', photoUrl: '/provas/prova-03.jpg' },
        { id: 4, name: 'Leandro', photoUrl: '/provas/prova-04.jpg' },
      ]),
    []
  );

  const [visibleIds, setVisibleIds] = useState<number[]>(() => testimonials.slice(0, 4).map(t => t.id));
  const lastSetRef = useRef<string>(visibleIds.slice().sort((a, b) => a - b).join(','));

  useEffect(() => {
    const pickNext = () => {
      if (testimonials.length <= 4) return;

      const shuffled = [...testimonials]
        .map((t) => ({ t, r: Math.random() }))
        .sort((a, b) => a.r - b.r)
        .map(({ t }) => t);

      for (let attempt = 0; attempt < 10; attempt++) {
        const next = shuffled.slice(attempt, attempt + 4).map(t => t.id);
        const key = next.slice().sort((a, b) => a - b).join(',');
        if (key && key !== lastSetRef.current) {
          lastSetRef.current = key;
          setVisibleIds(next);
          return;
        }
      }
    };

    const interval = setInterval(pickNext, 7000);
    return () => clearInterval(interval);
  }, [testimonials]);

  const visibleTestimonials = useMemo(() => {
    const map = new Map(testimonials.map(t => [t.id, t]));
    return visibleIds.map(id => map.get(id)).filter(Boolean) as typeof testimonials;
  }, [testimonials, visibleIds]);

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-8 border-b border-nexus-border pb-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="text-nexus-primary" />
          Comunidade Oficial
        </h2>
        <p className="text-nexus-muted text-sm mt-1">Junte-se a uma comunidade de traders que lucram todos os dias.</p>
      </div>

      <div className="grid lg:grid-cols-1 gap-8 mb-12">
        <div className="glass-panel p-8 rounded-2xl border border-green-500/20 relative overflow-hidden group">
          <img
            src={communityHeroImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none select-none"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-green-500/20 transition-colors"></div>
          <div className="relative z-10">
            <div className="w-14 h-14 bg-[#25D366]/20 rounded-xl flex items-center justify-center text-[#25D366] mb-6">
              <WhatsAppIcon size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Comunidade VIP no WhatsApp</h3>
            <p className="text-nexus-muted mb-1 leading-relaxed">Entre para nossa comunidade VIP</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <ShieldCheck size={16} className="text-nexus-primary" /> Sem spam, apenas conteúdo.
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <Globe size={16} className="text-nexus-primary" /> Networking com traders do mundo todo.
              </li>
            </ul>
            <div className="flex flex-col gap-3">
              <a 
                 href="https://chat.whatsapp.com/DLZIlVw0jkr0g52rn2FoWH?mode=hqrt3" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="w-full bg-[#25D366] hover:bg-[#20BD5C] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-900/20"
               >
                 <WhatsAppIcon size={20} />
                 Entrar no Grupo
               </a>
              <a
                href="https://wa.me/5511982416073"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-transparent hover:bg-white/5 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all border border-green-500/30"
              >
                <WhatsAppIcon size={20} className="text-[#25D366]" />
                Contato atendimento personalizado
              </a>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-6">O que estão falando da nossa ia</h3>
      <div className="grid md:grid-cols-2 gap-6">
        {visibleTestimonials.map((item) => (
          <div
            key={item.id}
            className="glass-panel rounded-xl border border-nexus-border/50 hover:border-nexus-primary/30 transition-colors overflow-hidden"
          >
            <div className="relative">
              <img
                src={item.photoUrl}
                alt={`Prova social - ${item.name}`}
                className="w-full h-[520px] md:h-[560px] object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-x-0 top-0 p-4 bg-gradient-to-b from-black/70 via-black/20 to-transparent">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-nexus-primary"></span>
                  <span className="text-sm font-bold text-white">
                    {String(item.name).split(' ')[0]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};