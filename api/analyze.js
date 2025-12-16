import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  const apiKey = String(process.env.GEMINI_API_KEY || "").trim();
  if (!apiKey) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "GEMINI_API_KEY não configurada no servidor." }));
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const base64Image = body?.base64Image;
    const mimeType = body?.mimeType;

    if (!base64Image || !mimeType) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Parâmetros inválidos: base64Image e mimeType são obrigatórios." }));
      return;
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `
    Você é o NexusTrade AI, um analista financeiro sênior especializado em Price Action, Análise Técnica Institucional e Smart Money Concepts.
    
    SEUS OBJETIVOS:
    1. Validar se a imagem é um gráfico financeiro legítimo.
    2. Identificar padrões gráficos de alta probabilidade.
    3. Fornecer um veredito claro (COMPRA/VENDA) baseado em lógica técnica.

    REGRAS DE VALIDAÇÃO (OBRIGATÓRIAS):
    - Se a imagem NÃO for um gráfico financeiro (ex: foto de pessoa, paisagem, objeto, meme), retorne signal="NEUTRAL" e reasoning="ERRO: A imagem não é um gráfico de trading válido.".
    - Você DEVE analisar SOMENTE prints de gráfico da corretora/broker Polarium (plataforma Polarium / trade.polariumbroker.com / interface com texto "Polarium" ou "Polarium (OTC)").
    - Se a imagem for de outra corretora/plataforma (ex: IQ Option, Quotex, Binomo, Olymp Trade, MetaTrader/TradingView, Binance etc) OU se não for possível confirmar que é Polarium, retorne signal="NEUTRAL" e reasoning="ERRO: Este gráfico não é da Polarium. Envie um print do gráfico dentro da plataforma Polarium para eu analisar.".
  `;

    const prompt = `
    Primeiro, confirme visualmente se este print é da corretora Polarium.
    - Se NÃO for Polarium, ou se houver dúvida, retorne imediatamente signal="NEUTRAL" e reasoning começando com "ERRO:" conforme as regras.
    - Você DEVE preencher o campo booleano isPolarium: true somente se for claramente Polarium; caso contrário false.

    Se for Polarium, analise este gráfico e forneça:
    - Sinal (BUY, SELL, NEUTRAL, HOLD)
    - Padrão Técnico (ex: Bandeira, OCO, Martelo, Pivô)
    - Tendência (Alta, Baixa, Lateral)
    - Explicação técnica detalhada (reasoning) em português, citando gatilhos de entrada.
    - Níveis de Suporte e Resistência.

    Responda estritamente em JSON conforme o schema.
  `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          { inlineData: { mimeType: String(mimeType), data: String(base64Image) } },
          { text: prompt },
        ],
      },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isPolarium: { type: Type.BOOLEAN },
            signal: { type: Type.STRING, enum: ["BUY", "SELL", "NEUTRAL", "HOLD"] },
            pattern: { type: Type.STRING },
            trend: { type: Type.STRING },
            riskReward: { type: Type.STRING },
            reasoning: { type: Type.STRING },
            supportLevels: { type: Type.ARRAY, items: { type: Type.STRING } },
            resistanceLevels: { type: Type.ARRAY, items: { type: Type.STRING } },
            confidence: { type: Type.NUMBER },
          },
          required: ["isPolarium", "signal", "pattern", "trend", "reasoning"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      res.statusCode = 502;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Resposta vazia da IA." }));
      return;
    }

    const json = JSON.parse(text);

    if (json?.isPolarium !== true) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          isPolarium: false,
          signal: "NEUTRAL",
          pattern: "N/A",
          trend: "N/A",
          riskReward: "N/A",
          reasoning:
            "ERRO: Gráfico não identificado. Cadastre-se agora na corretora Polarium e continue operando normalmente, link para cadastro abaixo: https://trade.polariumbroker.com/register?aff=753731&aff_model=revenue&afftrack=",
          supportLevels: [],
          resistanceLevels: [],
          confidence: 0,
        })
      );
      return;
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(json));
  } catch (err) {
    const message = err?.message ? String(err.message) : "Erro inesperado";
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: message }));
  }
}
