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
  const [accounts, setAccounts] = useState<Account[]>(MOCK_ACCOUNTS);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [financeRecords, setFinanceRecords] = useState<FinanceRecord[]>([]);

  useEffect(() => {
    // Reduzi o tempo de loading para uma transição quase instantânea
    const timer = setTimeout(() => setLoading(false), 300);
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
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
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
    <div className="flex min-h-screen bg-[#050505] text-gray-200 w-full overflow-x-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-4 md:p-8 ml-0 lg:ml-64 pt-16 lg:pt-8">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;