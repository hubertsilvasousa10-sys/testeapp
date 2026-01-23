import React, { useState, useEffect, useMemo } from 'react';
import { Account } from '../types';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

interface DashboardProps {
  accounts: Account[];
  selectedAccount?: Account;
  clearSelection?: () => void;
  onUpdateAccount?: (acc: Account) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ accounts, selectedAccount, clearSelection, onUpdateAccount }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  
  const [editMetrics, setEditMetrics] = useState({
    followers: 0,
    totalViews: 0,
    revenue: 0
  });

  useEffect(() => {
    if (selectedAccount) {
      setEditMetrics({
        followers: selectedAccount.followers,
        totalViews: selectedAccount.totalViews,
        revenue: selectedAccount.revenue
      });
    }
  }, [selectedAccount]);

  const globalMetrics = useMemo(() => {
    return accounts.reduce((acc, curr) => ({
      followers: acc.followers + (curr.followers || 0),
      views: acc.views + (curr.totalViews || 0),
      revenue: acc.revenue + (curr.revenue || 0)
    }), { followers: 0, views: 0, revenue: 0 });
  }, [accounts]);

  // Dados simulados para o gráfico baseados nas métricas atuais
  const chartData = useMemo(() => {
    const total = selectedAccount ? selectedAccount.totalViews : globalMetrics.views;
    return [
      { name: 'Seg', val: total * 0.1 },
      { name: 'Ter', val: total * 0.15 },
      { name: 'Qua', val: total * 0.12 },
      { name: 'Qui', val: total * 0.25 },
      { name: 'Sex', val: total * 0.18 },
      { name: 'Sáb', val: total * 0.35 },
      { name: 'Dom', val: total * 0.42 },
    ];
  }, [selectedAccount, globalMetrics]);

  const topByRevenue = useMemo(() => 
    [...accounts].sort((a, b) => (b.revenue || 0) - (a.revenue || 0)).slice(0, 5), 
  [accounts]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAccount && onUpdateAccount) {
      onUpdateAccount({
        ...selectedAccount,
        followers: Number(editMetrics.followers),
        totalViews: Number(editMetrics.totalViews),
        revenue: Number(editMetrics.revenue)
      });
      setIsUpdateModalOpen(false);
      showNotification(`Dados de ${selectedAccount.name} atualizados.`);
    }
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showNotification("Sincronizado com API local.");
    }, 1200);
  };

  const displayViews = selectedAccount ? selectedAccount.totalViews : globalMetrics.views;
  const displayRevenue = selectedAccount ? selectedAccount.revenue : globalMetrics.revenue;
  const displayFollowers = selectedAccount ? selectedAccount.followers : globalMetrics.followers;

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700">
      {notification && (
        <div className="fixed top-20 right-4 lg:top-4 z-[110] bg-cyan-500 text-black px-5 py-2 rounded-xl font-bold shadow-2xl animate-in slide-in-from-right-4 text-xs">
          {notification}
        </div>
      )}

      {isUpdateModalOpen && selectedAccount && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-[2rem] p-6 md:p-8 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setIsUpdateModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <h2 className="text-xl md:text-2xl font-bold mb-6">Métricas de {selectedAccount.name}</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Seguidores</label>
                  <input type="number" value={editMetrics.followers} onChange={e => setEditMetrics({...editMetrics, followers: parseInt(e.target.value) || 0})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-mono text-white focus:border-cyan-500 outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Visualizações</label>
                  <input type="number" value={editMetrics.totalViews} onChange={e => setEditMetrics({...editMetrics, totalViews: parseInt(e.target.value) || 0})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-mono text-white focus:border-cyan-500 outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-green-500 uppercase tracking-widest block mb-1">Faturamento (R$)</label>
                  <input type="number" step="0.01" value={editMetrics.revenue} onChange={e => setEditMetrics({...editMetrics, revenue: parseFloat(e.target.value) || 0})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-mono text-green-500 focus:border-green-500 outline-none" />
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-cyan-500 text-black rounded-xl font-bold hover:bg-cyan-400 transition">SALVAR ALTERAÇÕES</button>
            </form>
          </div>
        </div>
      )}

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              {selectedAccount ? selectedAccount.name : "Operação Global"}
            </h1>
            {selectedAccount && (
              <button onClick={clearSelection} className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-400 hover:text-white uppercase font-bold tracking-tighter">Limpar</button>
            )}
          </div>
          <p className="text-gray-400 text-sm mt-1">
            {selectedAccount ? "Gerenciamento de performance individual." : "Visão consolidada do seu império dark."}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {selectedAccount && (
            <button onClick={() => setIsUpdateModalOpen(true)} className="flex-1 md:flex-none px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[11px] font-bold hover:bg-white/10 transition flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              Editar Métricas
            </button>
          )}
          <button onClick={handleSync} disabled={isSyncing} className="flex-1 md:flex-none px-4 py-2.5 bg-cyan-500 text-black rounded-xl text-[11px] font-bold hover:bg-cyan-400 transition flex items-center justify-center gap-2 glow-cyan">
            {isSyncing ? "ATUALIZANDO..." : "SINCRONIZAR"}
          </button>
        </div>
      </header>

      {/* Grid de Stats Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-[#111] border border-white/5 p-6 rounded-[2rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
             <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-500"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Visualizações Totais</p>
          <h3 className="text-3xl font-mono font-bold mt-2 tracking-tighter text-white">
            {displayViews >= 1000000 ? (displayViews / 1000000).toFixed(1) + 'M' : displayViews.toLocaleString()}
          </h3>
          <div className="mt-4 flex items-center gap-2">
             <span className="text-[10px] font-bold text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-full">+12% vs ontem</span>
          </div>
        </div>

        <div className="bg-[#111] border border-green-500/10 p-6 rounded-[2rem] relative overflow-hidden group">
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Receita Acumulada</p>
          <h3 className="text-3xl font-mono font-bold mt-2 tracking-tighter text-green-500">
            R$ {displayRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-[10px] text-gray-500 mt-2 font-mono uppercase">
            RPM MÉDIO: R$ {(displayViews > 0 ? (displayRevenue / (displayViews / 1000)) : 0).toFixed(2)}
          </p>
        </div>

        <div className="bg-[#111] border border-white/5 p-6 rounded-[2rem] relative overflow-hidden">
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Engajamento Base</p>
          <h3 className="text-3xl font-mono font-bold mt-2 tracking-tighter text-white">
            {displayFollowers >= 1000 ? (displayFollowers / 1000).toFixed(1) + 'K' : displayFollowers}
          </h3>
          <div className="mt-4 flex items-center gap-2">
             <div className="flex -space-x-1">
                {[1,2,3].map(i => <div key={i} className="w-4 h-4 rounded-full border border-black bg-gray-800"></div>)}
             </div>
             <span className="text-[9px] font-bold text-gray-500 uppercase">Seguidores Ativos</span>
          </div>
        </div>
      </div>

      {/* Gráfico de Tendência */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-6 md:p-8">
        <h3 className="text-sm font-bold mb-6 flex items-center gap-2 text-gray-400 uppercase tracking-widest">
           Tendência de Alcance (Últimos 7 dias)
        </h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f0f0f', border: '1px solid #333', borderRadius: '12px' }}
                itemStyle={{ color: '#06b6d4', fontSize: '12px', fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="val" 
                stroke="#06b6d4" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorVal)" 
              />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 10}} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rankings */}
      {!selectedAccount && accounts.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-6 md:p-8">
            <h3 className="text-base font-bold mb-6 flex items-center gap-2">
              <span className="text-green-500">💰</span> Maiores Geradores de Caixa
            </h3>
            <div className="space-y-3">
              {topByRevenue.map((acc, index) => (
                <div key={acc.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-green-500/30 transition-all cursor-default">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] font-bold text-gray-600">#{index + 1}</span>
                    <div>
                      <p className="text-xs font-bold text-white">{acc.name}</p>
                      <p className="text-[9px] text-gray-500 uppercase">{acc.niche}</p>
                    </div>
                  </div>
                  <p className="font-mono font-bold text-green-500 text-sm">R$ {acc.revenue.toFixed(0)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-6 md:p-8">
            <h3 className="text-base font-bold mb-6 flex items-center gap-2">
              <span className="text-cyan-500">🔥</span> Taxa de Viralização
            </h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topByRevenue}>
                  <Bar dataKey="totalViews" radius={[4, 4, 0, 0]}>
                    {topByRevenue.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#06b6d4' : '#1f2937'} />
                    ))}
                  </Bar>
                  <Tooltip cursor={{fill: 'transparent'}} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-[9px] text-gray-600 uppercase mt-4 font-bold tracking-widest">Comparativo de Views por Canal</p>
          </div>
        </div>
      )}

      {accounts.length === 0 && (
        <div className="bg-[#111] border border-dashed border-white/10 rounded-[2rem] p-16 text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          </div>
          <p className="text-gray-500 font-mono text-xs uppercase tracking-[0.2em] leading-relaxed">Operação limpa. Inicie conectando seu primeiro canal dark.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;