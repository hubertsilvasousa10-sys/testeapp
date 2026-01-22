
import React, { useState } from 'react';
import { Platform, Account } from '../types';

interface AccountsProps {
  accounts: Account[];
  onAddAccount: (acc: Account) => void;
  onSelectAccount: (id: string) => void;
}

const Accounts: React.FC<AccountsProps> = ({ accounts, onAddAccount, onSelectAccount }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: '',
    platforms: [] as Platform[],
    niche: '',
  });

  const togglePlatform = (p: Platform) => {
    setNewAccount(prev => ({
      ...prev,
      platforms: prev.platforms.includes(p)
        ? prev.platforms.filter(x => x !== p)
        : [...prev.platforms, p]
    }));
  };

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccount.name || !newAccount.niche || newAccount.platforms.length === 0) return;

    const account: Account = {
      id: Date.now().toString(),
      name: newAccount.name,
      platform: newAccount.platforms,
      niche: newAccount.niche,
      status: 'Testing',
      creationDate: new Date().toLocaleDateString('pt-BR'),
      followers: 0,
      totalViews: 0,
      revenue: 0,
    };
    onAddAccount(account);
    setIsModalOpen(false);
    setNewAccount({ name: '', platforms: [], niche: '' });
  };

  const platformInfo: { id: Platform; icon: string; label: string }[] = [
    { id: 'TikTok', icon: '🎵', label: 'TikTok' },
    { id: 'Instagram', icon: '📸', label: 'Instagram' },
    { id: 'YouTube', icon: '📺', label: 'YouTube' },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Portfólio de Canais</h1>
          <p className="text-gray-500 text-sm">Gerencie suas unidades de lucro independentes.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-cyan-500 text-black font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-cyan-500/20 active:scale-95 text-sm uppercase tracking-widest"
        >
          + Conectar Canal
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-[2rem] p-6 md:p-8 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <h2 className="text-xl font-bold mb-6">Novo Canal de Lucro</h2>
            
            <form onSubmit={handleAddAccount} className="space-y-6">
              <div className="grid grid-cols-3 gap-3">
                {platformInfo.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePlatform(p.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                      newAccount.platforms.includes(p.id) 
                      ? 'border-cyan-500 bg-cyan-500/10 text-white' 
                      : 'border-white/5 bg-white/5 text-gray-500'
                    }`}
                  >
                    <span className="text-xl mb-1">{p.icon}</span>
                    <span className="text-[9px] font-bold uppercase">{p.label}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <input required type="text" value={newAccount.name} onChange={e => setNewAccount({...newAccount, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-cyan-500 outline-none" placeholder="Nome do Canal (ex: @invest_dark)" />
                <input required type="text" value={newAccount.niche} onChange={e => setNewAccount({...newAccount, niche: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-cyan-500 outline-none" placeholder="Nicho (ex: Curiosidades)" />
              </div>

              <button type="submit" className="w-full py-4 bg-cyan-500 text-black rounded-xl font-bold uppercase text-xs tracking-[0.2em]">Ativar Unidade</button>
            </form>
          </div>
        </div>
      )}

      {accounts.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-white/10 rounded-[2rem] bg-white/[0.01]">
          <p className="text-gray-500 font-mono text-[10px] uppercase tracking-widest">Aguardando seu primeiro comando de ativação...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {accounts.map((account) => (
            <div key={account.id} className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-5 hover:border-cyan-500/30 transition-all group flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="flex -space-x-2">
                  {account.platform.map(p => (
                    <span key={p} className="w-8 h-8 bg-[#111] rounded-lg border border-white/10 flex items-center justify-center text-sm shadow-lg">
                      {p === 'TikTok' ? '🎵' : p === 'YouTube' ? '📺' : '📸'}
                    </span>
                  ))}
                </div>
                <span className="text-[9px] font-bold text-gray-500 bg-white/5 px-2 py-0.5 rounded uppercase">{account.niche}</span>
              </div>
              
              <h3 className="text-lg font-bold mb-4">{account.name}</h3>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <p className="text-[8px] text-gray-500 font-bold uppercase mb-1">Followers</p>
                  <p className="text-sm font-mono font-bold">{account.followers >= 1000 ? (account.followers / 1000).toFixed(1) + 'K' : account.followers}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <p className="text-[8px] text-gray-500 font-bold uppercase mb-1">Receita</p>
                  <p className="text-sm font-mono font-bold text-green-500">R$ {account.revenue.toFixed(0)}</p>
                </div>
              </div>

              <button 
                onClick={() => onSelectAccount(account.id)}
                className="mt-auto w-full py-2.5 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition"
              >
                Gerenciar Operação &rarr;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Accounts;
