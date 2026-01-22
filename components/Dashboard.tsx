
import React, { useState, useEffect, useMemo } from 'react';
import { Account } from '../types';

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
      followers: acc.followers + curr.followers,
      views: acc.views + curr.totalViews,
      revenue: acc.revenue + curr.revenue
    }), { followers: 0, views: 0, revenue: 0 });
  }, [accounts]);

  const topByRevenue = useMemo(() => 
    [...accounts].sort((a, b) => b.revenue - a.revenue).slice(0, 3), 
  [accounts]);

  const topByViews = useMemo(() => 
    [...accounts].sort((a, b) => b.totalViews - a.totalViews).slice(0, 3), 
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
      showNotification("Sincronizado.");
    }, 1200);
  };

  const displayViews = selectedAccount ? selectedAccount.totalViews : globalMetrics.views;
  const displayRevenue = selectedAccount ? selectedAccount.revenue : globalMetrics.revenue;
  const displayFollowers = selectedAccount ? selectedAccount.followers : globalMetrics.followers;

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {selectedAccount ? selectedAccount.name : "Operação Global"}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {selectedAccount ? "Métricas individuais" : "Visão consolidada do portfólio."}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {selectedAccount && (
            <button onClick={() => setIsUpdateModalOpen(true)} className="flex-1 md:flex-none px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-[11px] font-bold hover:bg-white/10 transition flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              Editar
            </button>
          )}
          <button onClick={handleSync} disabled={isSyncing} className="flex-1 md:flex-none px-3 py-2 bg-cyan-500 text-black rounded-xl text-[11px] font-bold hover:bg-cyan-400 transition flex items-center justify-center gap-2">
            {isSyncing ? "..." : "Sincronizar"}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-[#111] border border-white/5 p-6 md:p-8 rounded-[2rem] relative overflow-hidden">
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Visualizações</p>
          <h3 className="text-3xl md:text-4xl font-mono font-bold mt-2 tracking-tighter">
            {displayViews >= 1000000 ? (displayViews / 1000000).toFixed(1) + 'M' : displayViews.toLocaleString()}
          </h3>
          <div className="mt-4 flex items-center space-x-2">
            <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500" style={{ width: '65%' }}></div>
            </div>
            <span className="text-[10px] text-cyan-500 font-bold">ALCANCE</span>
          </div>
        </div>

        <div className="bg-[#111] border border-white/5 p-6 md:p-8 rounded-[2rem] relative overflow-hidden border-green-500/10">
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Receita Total</p>
          <h3 className="text-3xl md:text-4xl font-mono font-bold mt-2 tracking-tighter text-green-500">
            R$ {displayRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-[10px] text-gray-500 mt-2 font-mono">
            RPM: R$ {(displayViews > 0 ? (displayRevenue / (displayViews / 1000)) : 0).toFixed(2)}
          </p>
        </div>

        <div className="bg-[#111] border border-white/5 p-6 md:p-8 rounded-[2rem] relative overflow-hidden">
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Seguidores</p>
          <h3 className="text-3xl md:text-4xl font-mono font-bold mt-2 tracking-tighter">
            {displayFollowers >= 1000 ? (displayFollowers / 1000).toFixed(1) + 'K' : displayFollowers}
          </h3>
          <div className="mt-4">
             <span className="text-[10px] font-bold text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded-full animate-pulse">CRESCENDO</span>
          </div>
        </div>
      </div>

      {!selectedAccount && accounts.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-6 md:p-8">
            <h3 className="text-base font-bold mb-6 flex items-center gap-2">
              <span className="text-green-500">🏆</span> Ranking Financeiro
            </h3>
            <div className="space-y-3">
              {topByRevenue.map((acc, index) => (
                <div key={acc.id} className="flex items-center justify-between p-3.5 bg-white/5 rounded-xl border border-white/5 hover:border-green-500/30 transition">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-gray-600">#{index + 1}</span>
                    <div>
                      <p className="text-xs font-bold">{acc.name}</p>
                      <div className="flex gap-1 mt-1">
                        {acc.platform.map(p => <span key={p} className="text-[8px] bg-white/10 px-1 rounded uppercase font-bold text-gray-500">{p}</span>)}
                      </div>
                    </div>
                  </div>
                  <p className="font-mono font-bold text-green-500 text-xs">R$ {acc.revenue.toFixed(0)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-6 md:p-8">
            <h3 className="text-base font-bold mb-6 flex items-center gap-2">
              <span className="text-cyan-500">🔥</span> Ranking Viral
            </h3>
            <div className="space-y-3">
              {topByViews.map((acc, index) => (
                <div key={acc.id} className="flex items-center justify-between p-3.5 bg-white/5 rounded-xl border border-white/5 hover:border-cyan-500/30 transition">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-gray-600">#{index + 1}</span>
                    <div>
                      <p className="text-xs font-bold truncate max-w-[100px]">{acc.name}</p>
                      <p className="text-[9px] text-gray-500 uppercase tracking-widest">{acc.niche}</p>
                    </div>
                  </div>
                  <p className="font-mono font-bold text-white text-xs whitespace-nowrap">{(acc.totalViews / 1000).toFixed(1)}K views</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {accounts.length === 0 && (
        <div className="bg-[#111] border border-dashed border-white/10 rounded-[2rem] p-12 md:p-20 text-center">
          <p className="text-gray-500 font-mono text-xs uppercase tracking-[0.2em] leading-relaxed">Conecte canais para habilitar a inteligência de dados.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
