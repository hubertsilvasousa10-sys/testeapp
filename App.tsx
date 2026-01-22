import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Accounts from './components/Accounts';
import Finance from './components/Finance';
import Strategy from './components/Strategy';
import Kanban from './components/Kanban';
import { Account, FinanceRecord } from './types';
import { MOCK_ACCOUNTS } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>(MOCK_ACCOUNTS);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [financeRecords, setFinanceRecords] = useState<FinanceRecord[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const selectedAccount = accounts.find(acc => acc.id === selectedAccountId);

  const handleSelectAccount = (id: string) => {
    setSelectedAccountId(id);
    setActiveTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddAccount = (acc: Account) => {
    setAccounts(prev => [acc, ...prev]);
  };

  const handleUpdateAccount = (updatedAcc: Account) => {
    setAccounts(prev => prev.map(acc => acc.id === updatedAcc.id ? updatedAcc : acc));
  };

  const handleAddFinanceRecord = (record: FinanceRecord) => {
    setFinanceRecords(prev => [record, ...prev]);
    
    if (record.type === 'Revenue' && record.accountId) {
      setAccounts(prev => prev.map(acc => {
        if (acc.id === record.accountId) {
          return { ...acc, revenue: acc.revenue + record.amount };
        }
        return acc;
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-center p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
          <p className="text-cyan-500 font-mono animate-pulse uppercase tracking-[0.2em] text-[10px]">Iniciando Protocolo DarkStream...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': 
        return (
          <Dashboard 
            accounts={accounts} 
            selectedAccount={selectedAccount} 
            clearSelection={() => setSelectedAccountId(null)} 
            onUpdateAccount={handleUpdateAccount}
          />
        );
      case 'accounts': 
        return (
          <Accounts 
            accounts={accounts} 
            onAddAccount={handleAddAccount} 
            onSelectAccount={handleSelectAccount}
          />
        );
      case 'finance': 
        return (
          <Finance 
            accounts={accounts}
            selectedAccount={selectedAccount} 
            records={financeRecords}
            onAddRecord={handleAddFinanceRecord}
          />
        );
      case 'strategy': 
        return <Strategy />;
      case 'kanban': 
        return <Kanban selectedAccount={selectedAccount} />;
      default: 
        return <Dashboard accounts={accounts} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-gray-200">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 ml-0 lg:ml-64 pt-20 lg:pt-8 pb-24 lg:pb-8">
        {selectedAccountId && activeTab !== 'accounts' && (
          <div className="mb-6 flex items-center justify-between bg-cyan-500/5 border border-cyan-500/20 p-4 rounded-2xl animate-in slide-in-from-top-2 shadow-[0_0_20px_rgba(34,211,238,0.05)]">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {selectedAccount?.platform.map(p => (
                  <span key={p} className="text-base bg-[#0f0f0f] w-7 h-7 flex items-center justify-center rounded-lg border border-white/10 shadow-lg">
                    {p === 'TikTok' ? '🎵' : p === 'YouTube' ? '📺' : '📸'}
                  </span>
                ))}
              </div>
              <div className="max-w-[120px] md:max-w-none">
                <p className="text-[9px] font-bold text-cyan-500 uppercase tracking-widest leading-none mb-1">Unidade:</p>
                <p className="text-xs md:text-sm font-bold text-white truncate">{selectedAccount?.name}</p>
              </div>
            </div>
            <button 
              onClick={() => setSelectedAccountId(null)}
              className="text-[9px] font-bold hover:text-white transition bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 uppercase tracking-widest"
            >
              Resetar
            </button>
          </div>
        )}
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;