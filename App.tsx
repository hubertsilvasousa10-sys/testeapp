import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.tsx';
import Dashboard from './components/Dashboard.tsx';
import Accounts from './components/Accounts.tsx';
import Finance from './components/Finance.tsx';
import Strategy from './components/Strategy.tsx';
import Kanban from './components/Kanban.tsx';
import { Account, FinanceRecord } from './types.ts';
import { MOCK_ACCOUNTS } from './constants.tsx';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  
  // Estado persistente com tratamento de erro
  const [accounts, setAccounts] = useState<Account[]>(() => {
    try {
      const saved = localStorage.getItem('darkstream_accounts');
      return saved ? JSON.parse(saved) : MOCK_ACCOUNTS;
    } catch (e) {
      console.warn("Acesso ao localStorage negado ou corrompido.");
      return MOCK_ACCOUNTS;
    }
  });
  
  const [financeRecords, setFinanceRecords] = useState<FinanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem('darkstream_finance');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('darkstream_accounts', JSON.stringify(accounts));
    } catch (e) {}
  }, [accounts]);

  useEffect(() => {
    try {
      localStorage.setItem('darkstream_finance', JSON.stringify(financeRecords));
    } catch (e) {}
  }, [financeRecords]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const selectedAccount = accounts.find(acc => acc.id === selectedAccountId);

  const handleSelectAccount = (id: string) => {
    setSelectedAccountId(id);
    setActiveTab('dashboard');
  };

  const handleAddAccount = (acc: Account) => {
    setAccounts(prev => [acc, ...prev]);
  };

  const handleUpdateAccount = (updatedAcc: Account) => {
    setAccounts(prev => prev.map(acc => acc.id === updatedAcc.id ? updatedAcc : acc));
  };

  const handleAddFinanceRecord = (record: FinanceRecord) => {
    setFinanceRecords(prev => [record, ...prev]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
        <div className="text-[10px] font-mono text-cyan-500 animate-pulse tracking-widest uppercase">Initializing Command Center</div>
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
        return <Strategy selectedAccount={selectedAccount} />;
      case 'kanban': 
        return <Kanban selectedAccount={selectedAccount} />;
      default: 
        return <Dashboard accounts={accounts} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-gray-200 w-full overflow-x-hidden selection:bg-cyan-500/30">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-4 md:p-8 ml-0 lg:ml-64 pt-20 lg:pt-8 pb-24 lg:pb-8">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;