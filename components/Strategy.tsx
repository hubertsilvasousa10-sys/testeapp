
import React from 'react';

const STRATEGY_TEMPLATES = [
  {
    title: "Blitz de 7 Dias: Reels Curados",
    roi: "4.2x",
    steps: ["Script viral 3s", "Stock footage premium", "Post às 12h, 18h e 21h", "Loop perfeito", "CTA fixado"]
  },
  {
    title: "Estratégia Faceless YouTube",
    roi: "3.8x",
    steps: ["Storytelling 8min+", "Thumbnail CTR 8%+", "SEO otimizado", "Interação 1h inicial", "Cortes p/ Shorts"]
  }
];

const Strategy: React.FC = () => {
  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-300">
      <div className="text-center md:text-left">
        <h1 className="text-2xl font-bold">Planos de Ataque</h1>
        <p className="text-gray-500 text-sm">Estratégias validadas para crescimento exponencial.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {STRATEGY_TEMPLATES.map((strat, idx) => (
          <div key={idx} className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold leading-tight max-w-[70%]">{strat.title}</h2>
              <div className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-[10px] font-bold uppercase">ROI {strat.roi}</div>
            </div>
            
            <div className="space-y-4 mb-8">
              {strat.steps.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <span className="text-xs font-mono text-cyan-500 font-bold">{i+1}.</span>
                  <p className="text-xs text-gray-400 font-medium">{step}</p>
                </div>
              ))}
            </div>

            <button className="mt-auto py-3 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition">Ver Detalhes do Plano</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Strategy;
