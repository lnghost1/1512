export interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro';
}

export enum AnalysisSignal {
  BUY = 'BUY',
  SELL = 'SELL',
  NEUTRAL = 'NEUTRAL',
  HOLD = 'HOLD'
}

export interface AnalysisResult {
  signal: AnalysisSignal;
  pattern: string;
  trend: string;
  riskReward: string;
  reasoning: string;
  supportLevels: string[];
  resistanceLevels: string[];
  timestamp: string;
  confidence: number; 
}

export interface HistoryItem {
  id: string;
  imageUrl: string;
  result: AnalysisResult;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}