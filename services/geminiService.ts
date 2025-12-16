import { AnalysisResult, AnalysisSignal } from "../types";

export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64 = base64String.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeChart = async (base64Image: string, mimeType: string): Promise<AnalysisResult> => {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ base64Image, mimeType })
    });

    const json = await response.json().catch(() => null);

    if (!response.ok) {
      const message = json?.error ? String(json.error) : `Erro HTTP ${response.status}`;
      throw new Error(message);
    }

    if (!json) throw new Error('Resposta vazia da IA.');

    // Tratamento de erro visual na UI se não for gráfico
    if (json.reasoning && json.reasoning.includes("ERRO:")) {
        throw new Error(json.reasoning);
    }

    return {
        signal: json.signal as AnalysisSignal,
        pattern: json.pattern || "N/A",
        trend: json.trend || "N/A",
        riskReward: "1:2", 
        reasoning: json.reasoning,
        supportLevels: json.supportLevels || [],
        resistanceLevels: json.resistanceLevels || [],
        confidence: json.confidence || 0.9,
        timestamp: new Date().toISOString()
    };
  } catch (error: any) {
      if (error.message && error.message.includes("ERRO:")) {
          throw error;
      }
      console.error("Erro API:", error);
      const msg = error?.message ? String(error.message) : "Não foi possível analisar. Tente novamente em instantes.";
      throw new Error(msg);
  }
};