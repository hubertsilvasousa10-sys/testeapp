import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Account } from '../types';

const STRATEGY_TEMPLATES = [
  {
    title: "Blitz de 7 Dias: Reels Curados",
    roi: "4.2x",
    description: "Foco em retenção máxima e loops perfeitos para forçar o algoritmo.",
    steps: ["Script viral 3s", "Stock footage premium", "Post às 12h, 18h e 21h", "Loop perfeito", "CTA fixado"]
  },
  {
    title: "Estratégia Faceless YouTube",
    roi: "3.8x",
    description: "Canais de alta duração com foco em CPM de finanças ou IA.",
    steps: ["Storytelling 8min+", "Thumbnail CTR 8%+", "SEO otimizado", "Interação 1h inicial", "Cortes p/ Shorts"]
  }
];

interface StrategyProps {
  selectedAccount?: Account;
}

const Strategy: React.FC<StrategyProps> = ({ selectedAccount }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const generateScript = async () => {
    if (!selectedAccount) return alert("Selecione um canal no menu 'Início' primeiro.");
    
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Você é um especialista em canais Dark (faceless) para TikTok e YouTube. 
        Gere uma ideia de vídeo viral e o script (roteiro) para o canal "${selectedAccount.name}" que é do nicho de "${selectedAccount.niche}". 
        O roteiro deve ter um gancho (hook) forte nos primeiros 3 segundos.`,
      });
      setAiResponse(response.text || "Erro ao gerar.");
    } catch (err) {
      console.error(err);
      setAiResponse("Lógica de IA indisponível. Verifique sua conexão.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Planos de Ataque</h1>
          <p className="text-gray-500 text-sm">Frameworks validados para escalar seus canais.</p>
        </div>
        <button 
          onClick={generateScript}
          disabled={isGenerating}
          className="bg-purple-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-purple-500 transition-all shadow-lg shadow-purple-600/20 active:scale-95"
        >
          {isGenerating ? (
             <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          ) : '⚡'}
          Gerar Script com IA
        </button>
      </div>

      {aiResponse && (
        <div className="bg-[#0f0f0f] border border-purple-500/20 rounded-[2rem] p-6 md:p-8 animate-in zoom-in-95 duration-300">
           <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest">Roteiro Sugerido pela IA</h3>
              <button onClick={() => setAiResponse(null)} className="text-gray-500 hover:text-white">✕</button>
           </div>
           <div className="text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">
              {aiResponse}
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {STRATEGY_TEMPLATES.map((strat, idx) => (
          <div key={idx} className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-6 md:p-8 flex flex-col group hover:border-cyan-500/20 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-bold leading-tight text-white mb-1">{strat.title}</h2>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">{strat.description}</p>
              </div>
              <div className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase">ROI {strat.roi}</div>
            </div>
            
            <div className="space-y-3 mb-8 flex-1">
              {strat.steps.map((step, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-mono text-cyan-500 font-bold">{i+1}</span>
                  <p className="text-xs text-gray-400 font-medium">{step}</p>
                </div>
              ))}
            </div>

            <button className="mt-auto py-3 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all">
              Aplicar este Plano
            </button>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-cyan-500/5 to-purple-600/5 border border-white/5 p-8 rounded-[2rem] text-center">
          <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-widest">Masterclass Dark</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto mb-6">Aprenda a criar thumbnails que forçam o clique e roteiros que seguram 70% da audiência.</p>
          <button className="text-[10px] font-bold text-cyan-500 border-b border-cyan-500 pb-1 hover:text-cyan-400">VER MATERIAIS DE APOIO</button>
      </div>
    </div>
  );
};

export default Strategy;