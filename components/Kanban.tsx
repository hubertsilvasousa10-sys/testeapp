
import React from 'react';
import { Account } from '../types';

interface KanbanProps {
  selectedAccount?: Account;
}

const Kanban: React.FC<KanbanProps> = ({ selectedAccount }) => {
  const columns = [
    { id: 'Idea', label: 'Ideias', dot: 'bg-gray-500' },
    { id: 'Production', label: 'Produção', dot: 'bg-yellow-500' },
    { id: 'Editing', label: 'Edição', dot: 'bg-purple-500' },
    { id: 'Ready', label: 'Postagem', dot: 'bg-cyan-500' },
  ];

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Produção de Conteúdo</h1>
          <p className="text-xs text-gray-500">Pipeline de vídeos faceless.</p>
        </div>
        <button className="bg-cyan-500 text-black px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest active:scale-95">Novo Projeto</button>
      </header>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        {columns.map((col) => (
          <div key={col.id} className="min-w-[280px] md:flex-1 flex flex-col space-y-3">
            <div className="flex items-center space-x-2 px-2">
              <span className={`w-1.5 h-1.5 rounded-full ${col.dot}`}></span>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">{col.label}</h3>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 min-h-[400px] flex flex-col gap-3">
              <div className="py-12 text-center border border-dashed border-white/5 rounded-xl">
                 <p className="text-[8px] font-mono text-gray-700 uppercase tracking-widest">Nenhuma tarefa ativa</p>
              </div>
              <button className="w-full py-2.5 border-2 border-dashed border-white/5 rounded-xl text-[9px] text-gray-600 font-bold hover:bg-white/5 transition">+ ADICIONAR ITEM</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Kanban;
