
import React, { useState, useMemo } from 'react';
import { Account, FinanceRecord } from '../types';

interface FinanceProps {
  accounts: Account[];
  selectedAccount?: Account;
  records: FinanceRecord[];
  onAddRecord: (record: FinanceRecord) => void;
}

const Finance: React.FC<FinanceProps> = ({ accounts, selectedAccount, records, onAddRecord }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRecord, setNewRecord] = useState({
    type: 'Revenue' as 'Revenue' | 'Expense',
    amount: '',
    category: 'Monetização',
    accountId: '',
    description: ''
  });

  const filteredRecords = useMemo(() => {
    if (selectedAccount) {
      return records.filter(r => r.accountId === selectedAccount.id);
    }
    return records;
  }, [records, selectedAccount]);

  const stats = useMemo(() => {
    const data = filteredRecords.reduce((acc, curr) => {
      if (curr.type === 'Revenue') acc.revenue += curr.amount;
      else acc.expense += curr.amount;
      return acc;
    }, { revenue: 0, expense: 0 });

    return {
      ...data,
      profit: data.revenue - data.expense,
      roi: data.expense > 0 ? (data.revenue / data.expense).toFixed(1) : '0.0'
    };
  }, [filteredRecords]);

  const displayTotalRevenue = stats.revenue || (selectedAccount ? selectedAccount.revenue : accounts.reduce((a, b) => a + b.revenue, 0));

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecord.amount) return;

    const record: FinanceRecord = {
      id: Date.now().toString(),
      type: newRecord.type,
      amount: parseFloat(newRecord.amount),
      category: newRecord.category,
      date: new Date().toLocaleDateString('pt-BR'),
      accountId: newRecord.accountId || selectedAccount?.id,
      description: newRecord.description
    };

    onAddRecord(record);
    setIsModalOpen(false);
    setNewRecord({ type: 'Revenue', amount: '', category: 'Monetização', accountId: '', description: '' });
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Gestão Financeira</h1>
          <p className="text-gray-500 text-sm">
            {selectedAccount ? `Balanço de ${selectedAccount.name}` : "Fluxo de caixa global."}
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 text-black px-5 py-3 rounded-xl font-bold shadow-lg shadow-green-500/20 hover:bg-green-400 transition text-xs uppercase tracking-widest"
        >
          Novo Lançamento
        </button>
      </header>

      {isModalOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-[2rem] p-6 md:p-8 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <h2 className="text-xl font-bold mb-6">Transação Financeira</h2>
            <form onSubmit={handleAddRecord} className="space-y-4">
              <div className="flex bg-white/5 p-1 rounded-xl">
                <button 
                  type="button" 
                  onClick={() => setNewRecord({...newRecord, type: 'Revenue'})}
                  className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition ${newRecord.type === 'Revenue' ? 'bg-green-500 text-black' : 'text-gray-500'}`}
                >RECEITA</button>
                <button 
                  type="button" 
                  onClick={() => setNewRecord({...newRecord, type: 'Expense'})}
                  className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition ${newRecord.type === 'Expense' ? 'bg-red-500 text-black' : 'text-gray-500'}`}
                >DESPESA</button>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Valor (R$)</label>
                <input required type="number" step="0.01" value={newRecord.amount} onChange={e => setNewRecord({...newRecord, amount: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-mono text-white text-lg outline-none focus:border-cyan-500" placeholder="0,00" />
              </div>

              {!selectedAccount && (
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Canal Associado</label>
                  <select 
                    value={newRecord.accountId} 
                    onChange={e => setNewRecord({...newRecord, accountId: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none"
                  >
                    <option value="">Nenhum / Global</option>
                    {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                  </select>
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Categoria</label>
                <input type="text" value={newRecord.category} onChange={e => setNewRecord({...newRecord, category: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none" placeholder="Ex: Adsense, Ferramentas" />
              </div>

              <button type="submit" className={`w-full py-4 rounded-xl font-bold transition shadow-lg mt-4 ${newRecord.type === 'Revenue' ? 'bg-green-500 text-black' : 'bg-red-500 text-black'}`}>
                REGISTRAR {newRecord.type === 'Revenue' ? 'ENTRADA' : 'SAÍDA'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111] border border-white/5 p-6 rounded-[1.5rem] md:rounded-[2rem]">
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Lucro Líquido</p>
          <h3 className={`text-2xl md:text-3xl font-mono font-bold mt-1 ${stats.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            R$ {stats.profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
        </div>
        <div className="bg-[#111] border border-white/5 p-6 rounded-[1.5rem] md:rounded-[2rem]">
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Receita Bruta</p>
          <h3 className="text-2xl md:text-3xl font-mono font-bold text-white mt-1">
            R$ {displayTotalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
        </div>
        <div className="bg-[#111] border border-white/5 p-6 rounded-[1.5rem] md:rounded-[2rem]">
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Eficiência ROI</p>
          <h3 className="text-2xl md:text-3xl font-mono font-bold text-cyan-400 mt-1">{stats.roi}x</h3>
        </div>
      </div>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] overflow-hidden">
        <div className="p-5 border-b border-white/5 bg-white/[0.01]">
           <h3 className="text-xs font-bold uppercase tracking-widest">Transações Recentes</h3>
        </div>
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[9px] text-gray-500 uppercase tracking-widest border-b border-white/5">
                <th className="px-5 py-3">Data</th>
                <th className="px-5 py-3">Descrição</th>
                <th className="px-5 py-3 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-12 text-center text-gray-600 font-mono text-[10px] uppercase">Sem lançamentos</td>
                </tr>
              ) : (
                filteredRecords.map(r => (
                  <tr key={r.id} className="hover:bg-white/[0.01] transition">
                    <td className="px-5 py-4 font-mono text-[10px] text-gray-400">{r.date.split('/')[0] + '/' + r.date.split('/')[1]}</td>
                    <td className="px-5 py-4">
                      <p className="text-xs font-bold text-white leading-tight">{r.category}</p>
                      <p className="text-[9px] text-gray-500">{r.type === 'Revenue' ? 'Entrada' : 'Saída'}</p>
                    </td>
                    <td className={`px-5 py-4 text-right font-mono font-bold text-xs ${r.type === 'Revenue' ? 'text-green-500' : 'text-red-500'}`}>
                      {r.type === 'Revenue' ? '+' : '-'} {r.amount >= 1000 ? (r.amount / 1000).toFixed(1) + 'K' : r.amount.toFixed(0)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Finance;
