
import React, { useState } from 'react';

const MOCK_VIDEOS = [
  { id: '1', title: 'Mentalidade Estóica', views: 450000, likes: 23000, ctr: 4.5, retention: 68, classification: 'Viral' },
  { id: '2', title: 'A IA está mudando tudo', views: 12000, likes: 800, ctr: 2.1, retention: 35, classification: 'Médio' },
  { id: '3', title: 'Por que você é pobre', views: 2500, likes: 120, ctr: 1.2, retention: 20, classification: 'Flop' },
];

const Videos: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);

  // Lógica local matemática sem IA
  const handlePredict = () => {
    setAnalyzing(true);
    setTimeout(() => {
      // Simulação de cálculo baseado em métricas típicas de canais dark
      const ctr = 6.2;
      const retention = 72;
      const prob = Math.min(100, Math.round((ctr * 5) + (retention * 0.8)));
      
      setPrediction({
        probability: prob,
        explanation: "Baseado no histórico de retenção e CTR, este vídeo tem alto potencial de recomendação pelo algoritmo.",
        tips: [
          "Melhore o contraste da miniatura para subir o CTR em 2%",
          "Otimize o hook nos primeiros 3 segundos",
          "Adicione legendas dinâmicas para aumentar a retenção"
        ]
      });
      setAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Repositório de Conteúdo</h1>
        <div className="flex space-x-3">
           <button className="bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-xl text-sm font-medium transition">
            Importar CSV
          </button>
          <button className="bg-cyan-500 text-black px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-cyan-500/20">
            Registrar Novo Vídeo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                  <th className="px-6 py-4">Título do Vídeo</th>
                  <th className="px-6 py-4 text-center">Visualizações</th>
                  <th className="px-6 py-4 text-center">CTR</th>
                  <th className="px-6 py-4 text-center">Retenção</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {MOCK_VIDEOS.map((v) => (
                  <tr key={v.id} className="hover:bg-white/[0.02] transition">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold">{v.title}</p>
                      <p className="text-xs text-gray-500 font-mono">ID: V-{v.id}291</p>
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-sm">{(v.views / 1000).toFixed(1)}K</td>
                    <td className="px-6 py-4 text-center font-mono text-sm text-cyan-400">{v.ctr}%</td>
                    <td className="px-6 py-4 text-center font-mono text-sm text-purple-400">{v.retention}%</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                        v.classification === 'Viral' ? 'bg-green-500/20 text-green-500' :
                        v.classification === 'Médio' ? 'bg-blue-500/20 text-blue-500' : 'bg-red-500/20 text-red-500'
                      }`}>
                        {v.classification.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs font-bold text-gray-400 hover:text-white transition">Detalhes</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/10 rounded-3xl p-6 relative overflow-hidden">
            <h3 className="text-lg font-bold mb-2 flex items-center space-x-2">
              <span className="text-cyan-500">📊</span>
              <span>Calculadora de Viralização</span>
            </h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              Insira as métricas estimadas para prever a performance baseada em benchmarks do nicho.
            </p>

            <div className="space-y-4 mb-8">
              <div className="bg-black/40 border border-white/5 p-4 rounded-2xl">
                <label className="text-[10px] text-gray-500 font-bold uppercase block mb-2">Métricas de Simulação</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-gray-400">CTR (Click-Through)</span>
                    <p className="text-lg font-mono font-bold">6.2%</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">Retenção Média</span>
                    <p className="text-lg font-mono font-bold">72%</p>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={handlePredict}
              disabled={analyzing}
              className="w-full py-3 bg-cyan-500 text-black font-bold rounded-2xl hover:bg-cyan-400 transition disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {analyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                  <span>ANALISANDO...</span>
                </>
              ) : (
                <>
                  <span>CALCULAR PROBABILIDADE</span>
                </>
              )}
            </button>

            {prediction && (
              <div className="mt-8 pt-8 border-t border-white/10 animate-in slide-in-from-top-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold uppercase tracking-wider text-gray-400">Probabilidade de Viral</span>
                  <span className="text-3xl font-mono font-bold text-cyan-400">{prediction.probability}%</span>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 mb-4">
                   <p className="text-xs italic text-gray-300">"{prediction.explanation}"</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Melhorias Recomendadas:</p>
                  {prediction.tips.map((tip: string, i: number) => (
                    <div key={i} className="flex items-start space-x-2 text-xs">
                      <span className="text-green-500">✓</span>
                      <span className="text-gray-400">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Videos;
