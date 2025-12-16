import React, { useEffect, useMemo, useState } from 'react';
import { Trophy, TrendingUp, Medal } from 'lucide-react';

const mulberry32 = (a: number) => {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const randInt = (rng: () => number, min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;
const randFloat = (rng: () => number, min: number, max: number) => rng() * (max - min) + min;

const formatBRL = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

type LeaderboardRow = {
  id: string;
  name: string;
  trades: number;
  winRate: string;
  rawProfit: number;
  profit: string;
  country: string;
};

const computeWinsLosses = (trades: number, winRateNum: number) => {
  const t = clamp(Math.round(trades), 0, 999);
  const wr = clamp(Math.round(winRateNum), 0, 100);
  const wins = clamp(Math.round((t * wr) / 100), 0, t);
  const losses = clamp(t - wins, 0, t);
  return { wins, losses };
};

const buildDailySeed = (d: Date) => d.getDate() + d.getMonth() * 31 + d.getFullYear() * 365;

const generateParticipantPerformance = (rng: () => number, options?: { badDayBias?: number }) => {
  const badDayBias = clamp(options?.badDayBias ?? 0, 0, 1);
  const isBadDay = rng() < (0.12 + badDayBias * 0.35);

  const trades = randInt(rng, 15, 50);

  const baseWinRate = isBadDay ? randFloat(rng, 60, 69.5) : randFloat(rng, 70, 95);
  const tradeFactor = (trades - 15) / (50 - 15);
  const correlated = baseWinRate - (tradeFactor * randFloat(rng, 8, 16));
  const winRateNum = clamp(Math.round(correlated + randFloat(rng, -1.5, 1.5)), 60, 95);

  const expected = ((winRateNum - 60) / 35) * 0.9 + 0.35;
  const volume = trades / 50;
  const noise = randFloat(rng, -0.08, 0.08);
  const profitScalar = clamp(expected * (0.65 + volume * 0.35) + noise, 0.25, 1);

  // Lucro: normalmente entre ~R$ 600 e R$ 5.000, com picos raros (ex.: dias muito fora da curva)
  const isSpike = rng() < 0.01; // ~1% dos casos
  const profitMin = isSpike ? 5200 : 600;
  const profitMax = isSpike ? 8000 : 5000;
  const rawProfit = Math.round(randFloat(rng, profitMin, profitMax) * profitScalar);

  return {
    trades,
    winRateNum,
    rawProfit: clamp(rawProfit, 600, 8000)
  };
};

const generateDailyLeaderboard = () => {
  const today = new Date();
  const seed = buildDailySeed(today);
  const rng = mulberry32(seed);

  const ySeed = buildDailySeed(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1));
  const yRng = mulberry32(ySeed);

  const namesPool = [
    'Carlos Trader', 'Ana Crypto', 'Marcos Fx', 'Julia Invest',
    'Pedro Stocks', 'Sarah Win', 'Lucas B.', 'John Doe',
    'Maria H.', 'Roberto Gold', 'Felipe Day', 'Jessica Scalp',
    'Bruno Coin', 'Fernanda FIIs', 'Ricardo Alvo', 'Paulo Setup',
    'Renata Macro', 'Thiago Price', 'Camila Swing', 'Gustavo Scalper',
    'Bianca Forex', 'Rafael Cripto', 'Juliana Day', 'Victor Alpha',
    'Bruna Tape', 'Daniel Fluxo'
  ];

  const shuffle = <T,>(arr: T[], r: () => number) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const participants = shuffle(namesPool, rng).slice(0, 9);
  const fixedName = 'Andre Scheeren';
  if (!participants.includes(fixedName)) participants.push(fixedName);

  const yParticipants = shuffle(namesPool, yRng).slice(0, 9);
  if (!yParticipants.includes(fixedName)) yParticipants.push(fixedName);
  const yesterday = yParticipants.map((name) => {
    const perf = generateParticipantPerformance(yRng);
    return { name, rawProfit: perf.rawProfit };
  }).sort((a, b) => b.rawProfit - a.rawProfit);
  const yesterdayTop = yesterday[0]?.name;

  const rows: LeaderboardRow[] = participants.map((name) => {
    const badDayBias = name === yesterdayTop ? 0.9 : 0;
    const perf = generateParticipantPerformance(rng, { badDayBias });

    const rawProfit = perf.rawProfit;

    return {
      id: name,
      name,
      trades: perf.trades,
      winRate: `${perf.winRateNum}%`,
      rawProfit,
      profit: formatBRL(rawProfit),
      country: 'BR',
    };
  });

  const sorted = rows.sort((a, b) => b.rawProfit - a.rawProfit);

  const andreIndex = sorted.findIndex((r) => r.name === fixedName);
  if (andreIndex >= 0) {
    const targetBand = rng() < 0.33 ? 'top' : rng() < 0.66 ? 'mid' : 'low';
    const desiredIndex =
      targetBand === 'top' ? randInt(rng, 0, Math.min(2, sorted.length - 1)) :
      targetBand === 'mid' ? randInt(rng, 3, Math.min(6, sorted.length - 1)) :
      randInt(rng, 6, Math.min(sorted.length - 1, 9));

    const safeDesired = clamp(desiredIndex, 0, sorted.length - 1);
    if (safeDesired !== andreIndex) {
      const [andre] = sorted.splice(andreIndex, 1);
      const anchor = sorted[safeDesired] || sorted[sorted.length - 1];
      const base = anchor ? anchor.rawProfit : andre.rawProfit;
      const jitter = randFloat(rng, -650, 650);
      const adjusted = clamp(base + jitter, 600, 8000);
      const newRawProfit = Math.round(adjusted);
      const moved: LeaderboardRow = {
        ...andre,
        rawProfit: newRawProfit,
        profit: formatBRL(newRawProfit)
      };
      sorted.splice(safeDesired, 0, moved);
      sorted.sort((a, b) => b.rawProfit - a.rawProfit);
    }
  }

  return sorted;
};

const getTodayKey = () => {
  const today = new Date();
  return String(buildDailySeed(today));
};

const getTenMinuteKey = () => String(Math.floor(Date.now() / (10 * 60 * 1000)));

export const Ranking: React.FC = () => {
  const leaderboard = useMemo(() => generateDailyLeaderboard(), []);
  const dayKey = useMemo(() => getTodayKey(), []);
  const tenMinuteKey = useMemo(() => getTenMinuteKey(), []);
  const storageKey = useMemo(() => `nexus_ranking_overrides_${dayKey}` as const, [dayKey]);

  const [nameOverrides, setNameOverrides] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') setNameOverrides(parsed);
    } catch (e) {}
  }, [storageKey]);

  const displayName = (row: { id: string; name: string }) => {
    const v = nameOverrides[row.id];
    return v ? String(v) : row.name;
  };

  const beginEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingValue(currentName);
  };

  const commitEdit = () => {
    if (!editingId) return;
    const trimmed = String(editingValue || '').trim();

    const next = { ...nameOverrides };
    if (!trimmed) {
      delete next[editingId];
    } else {
      next[editingId] = trimmed;
    }

    setNameOverrides(next);
    setEditingId(null);
    setEditingValue('');

    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch (e) {}
  };

  const top3 = leaderboard.slice(0, 3);
  const hasTop3 = top3.length >= 3;
  const restOfList = leaderboard.slice(3);

  const communityActiveNow = useMemo(() => {
    const seed = Number(dayKey) + Number(tenMinuteKey);
    const rng = mulberry32(seed);
    return randInt(rng, 80, 99);
  }, [dayKey, tenMinuteKey]);

  const communityRow = useMemo(() => {
    const seed = Number(dayKey) + 9999;
    const rng = mulberry32(seed);
    const trades = randInt(rng, 18, 35);
    const winRateNum = randInt(rng, 82, 95);

    // Community: também segue a faixa, mas pode ter picos raros
    const isSpike = rng() < 0.015;
    const min = isSpike ? 5200 : 600;
    const max = isSpike ? 8000 : 5000;
    const profitValue = Math.round(randFloat(rng, min, max));
    return {
      id: 'community_user',
      name: 'Trades da Comunidade',
      trades,
      winRate: `${winRateNum}%`,
      rawProfit: profitValue,
      profit: formatBRL(profitValue),
      country: 'BR',
    };
  }, [dayKey]);

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-8 border-b border-nexus-border pb-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Trophy className="text-yellow-500" />
          Top 10 da nossa comunidade
        </h2>
        <p className="text-nexus-muted text-sm mt-1">
            Os melhores analistas de hoje ({new Date().toLocaleDateString()}). A tabela atualiza a cada 24h.
        </p>
      </div>

      {/* TOP 3 CARDS */}
      {hasTop3 && (
      <div className="grid md:grid-cols-3 gap-6 mb-8 items-end">
        {/* 2º Lugar */}
        <div className="order-2 md:order-1 glass-panel p-6 rounded-xl border-t-4 border-gray-400 relative overflow-hidden transform hover:-translate-y-1 transition-transform">
          <div className="absolute top-2 right-2 text-gray-400/20"><Medal size={60} /></div>
           <div className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
             2º Lugar
           </div>
           <div className="text-sm text-gray-300">
              {displayName(top3[1])}
           </div>
           <div className="mt-4 text-xl text-nexus-primary font-mono">{top3[1].profit}</div>
        </div>

        {/* 1º Lugar */}
        <div className="order-1 md:order-2 glass-panel p-8 rounded-xl border-t-4 border-yellow-500 relative overflow-hidden transform scale-105 shadow-[0_0_30px_rgba(255,215,0,0.1)]">
          <div className="absolute top-2 right-2 text-yellow-500/20"><Medal size={80} /></div>
          <div className="text-3xl font-bold text-white mb-1 flex items-center gap-2">
            1º Lugar
          </div>
          <div className="text-base text-gray-200">
            {displayName(top3[0])}
          </div>
          <div className="mt-4 text-3xl text-nexus-primary font-mono font-bold neon-text-green">{top3[0].profit}</div>
        </div>

        {/* 3º Lugar */}
        <div className="order-3 glass-panel p-6 rounded-xl border-t-4 border-orange-700 relative overflow-hidden transform hover:-translate-y-1 transition-transform">
          <div className="absolute top-2 right-2 text-orange-700/20"><Medal size={60} /></div>
           <div className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
             3º Lugar
           </div>
           <div className="text-sm text-gray-300">
            {displayName(top3[2])}
           </div>
           <div className="mt-4 text-xl text-nexus-primary font-mono">{top3[2].profit}</div>
        </div>
      </div>
      )}

      {/* LISTA (MOBILE) */}
      <div className="md:hidden space-y-3">
        {leaderboard.map((trader, index) => {
          const wr = parseInt(trader.winRate);
          const { wins, losses } = computeWinsLosses(trader.trades, isNaN(wr) ? 0 : wr);
          const badgeClass =
            index === 0
              ? 'bg-yellow-500/20 text-yellow-500'
              : index === 1
                ? 'bg-gray-400/20 text-gray-300'
                : index === 2
                  ? 'bg-orange-700/20 text-orange-500'
                  : 'bg-white/5 text-nexus-muted';

          return (
            <div key={trader.id} className="glass-panel rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${badgeClass}`}>
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      {editingId === trader.id ? (
                        <input
                          autoFocus
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          onBlur={commitEdit}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') commitEdit();
                            if (e.key === 'Escape') {
                              setEditingId(null);
                              setEditingValue('');
                            }
                          }}
                          className="bg-transparent border border-nexus-border rounded-lg px-3 py-2 text-white w-full focus:outline-none focus:border-nexus-primary"
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => beginEdit(trader.id, displayName(trader))}
                          className="font-semibold text-white hover:text-nexus-primary transition-colors text-left truncate block max-w-[210px]"
                          title="Clique para editar o nome"
                        >
                          {displayName(trader)}
                        </button>
                      )}
                      <div className="text-xs text-nexus-muted mt-0.5">{trader.trades} trades</div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-nexus-primary">{trader.profit}</div>
                      <div className="mt-1 flex items-center justify-end gap-2">
                        <span className={wr > 80 ? 'text-nexus-primary font-mono' : 'text-gray-300 font-mono'}>
                          {trader.winRate}
                        </span>
                        {wr > 80 && <TrendingUp size={14} className="text-nexus-primary" />}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-1">
                        {wins} acertos • {losses} erros
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div className="glass-panel rounded-xl p-4 border border-nexus-border bg-nexus-800/40">
          {(() => {
            return (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm text-nexus-muted bg-white/5 shrink-0">-</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      {editingId === communityRow.id ? (
                        <input
                          autoFocus
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          onBlur={commitEdit}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') commitEdit();
                            if (e.key === 'Escape') {
                              setEditingId(null);
                              setEditingValue('');
                            }
                          }}
                          className="bg-transparent border border-nexus-border rounded-lg px-3 py-2 text-white w-full focus:outline-none focus:border-nexus-primary"
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => beginEdit(communityRow.id, displayName(communityRow))}
                          className="font-semibold text-gray-200 hover:text-nexus-primary transition-colors text-left truncate block max-w-[210px]"
                          title="Clique para editar o nome"
                        >
                          {displayName(communityRow)}
                        </button>
                      )}
                      <div className="text-xs text-nexus-muted mt-0.5">{communityRow.trades} trades</div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-bold text-nexus-primary text-sm">+ de {communityActiveNow} pessoas operando agora</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* TABELA (DESKTOP) */}
      <div className="hidden md:block glass-panel rounded-xl overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="min-w-[760px] w-full text-left border-collapse">
            <thead className="bg-nexus-800 text-white text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 font-medium">Posição</th>
                <th className="p-4 font-medium">Trader</th>
                <th className="p-4 font-medium">Trades</th>
                <th className="p-4 font-medium text-right">Win Rate</th>
                <th className="p-4 font-medium text-right">Lucro (Hoje)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nexus-700">
              {leaderboard.map((trader, index) => (
                <tr key={trader.id} className="hover:bg-nexus-700/30 transition-colors">
                  <td className="p-4">
                    <div
                      className={`
                        w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm
                        ${index === 0 ? 'bg-yellow-500/20 text-yellow-500' : index === 1 ? 'bg-gray-400/20 text-gray-300' : index === 2 ? 'bg-orange-700/20 text-orange-500' : 'text-nexus-muted'}
                      `}
                    >
                      {index + 1}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {editingId === trader.id ? (
                        <input
                          autoFocus
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          onBlur={commitEdit}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') commitEdit();
                            if (e.key === 'Escape') {
                              setEditingId(null);
                              setEditingValue('');
                            }
                          }}
                          className="bg-transparent border border-nexus-border rounded-lg px-3 py-2 text-white w-full max-w-[280px] focus:outline-none focus:border-nexus-primary"
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => beginEdit(trader.id, displayName(trader))}
                          className="font-medium text-white hover:text-nexus-primary transition-colors text-left"
                          title="Clique para editar o nome"
                        >
                          {displayName(trader)}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-gray-400">{trader.trades}</td>
                  <td className="p-4 text-right font-mono">
                    <div className="flex items-center justify-end gap-2">
                      <span className={parseInt(trader.winRate) > 80 ? 'text-nexus-primary' : 'text-gray-300'}>{trader.winRate}</span>
                      {parseInt(trader.winRate) > 80 && <TrendingUp size={14} className="text-nexus-primary" />}
                    </div>
                    <div className="text-[11px] text-gray-500 mt-1">
                      {(() => {
                        const wr = parseInt(trader.winRate);
                        const { wins, losses } = computeWinsLosses(trader.trades, isNaN(wr) ? 0 : wr);
                        return `${wins} acertos • ${losses} erros`;
                      })()}
                    </div>
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-nexus-primary">{trader.profit}</td>
                </tr>
              ))}

              <tr className="border-t-4 border-nexus-card bg-nexus-800/50 hover:bg-nexus-700/20 transition-colors">
                <td className="p-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm text-nexus-muted bg-white/5">-</div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {editingId === communityRow.id ? (
                      <input
                        autoFocus
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onBlur={commitEdit}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commitEdit();
                          if (e.key === 'Escape') {
                            setEditingId(null);
                            setEditingValue('');
                          }
                        }}
                        className="bg-transparent border border-nexus-border rounded-lg px-3 py-2 text-white w-full max-w-[280px] focus:outline-none focus:border-nexus-primary"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => beginEdit(communityRow.id, displayName(communityRow))}
                        className="font-medium text-gray-300 hover:text-nexus-primary transition-colors text-left"
                        title="Clique para editar o nome"
                      >
                        {displayName(communityRow)}
                      </button>
                    )}
                  </div>
                </td>
                <td className="p-4 text-gray-400">{communityRow.trades}</td>
                <td className="p-4 text-right font-mono">
                  <span className="text-gray-500">-</span>
                </td>
                <td className="p-4 text-right font-bold text-nexus-primary">+ de {communityActiveNow} pessoas operando agora</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};