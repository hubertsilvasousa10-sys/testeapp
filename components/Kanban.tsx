import React, { useState, useEffect } from 'react';
import { Account, KanbanTask } from '../types';

interface KanbanProps {
  selectedAccount?: Account;
}

const Kanban: React.FC<KanbanProps> = ({ selectedAccount }) => {
  const [tasks, setTasks] = useState<KanbanTask[]>(() => {
    const saved = localStorage.getItem('darkstream_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    localStorage.setItem('darkstream_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const columns = [
    { id: 'Idea', label: 'Ideias', dot: 'bg-gray-500' },
    { id: 'Production', label: 'Gravando', dot: 'bg-yellow-500' },
    { id: 'Editing', label: 'Editando', dot: 'bg-purple-500' },
    { id: 'Ready', label: 'Pronto', dot: 'bg-cyan-500' },
  ];

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    const task: KanbanTask = {
      id: Date.now().toString(),
      title: newTaskTitle,
      status: 'Idea',
      priority: 'Medium',
      dueDate: new Date().toLocaleDateString(),
      platform: 'TikTok'
    };
    setTasks([...tasks, task]);
    setNewTaskTitle('');
    setIsModalOpen(false);
  };

  const moveTask = (taskId: string, newStatus: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus as any } : t));
  };

  const filteredTasks = selectedAccount 
    ? tasks.filter(t => t.title.toLowerCase().includes(selectedAccount.name.toLowerCase()) || tasks.length > 0) 
    : tasks;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Pipeline de Conteúdo</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Status da produção faceless.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-cyan-500 text-black px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest active:scale-95 glow-cyan"
        >
          + Novo Projeto
        </button>
      </header>

      {isModalOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
           <div className="bg-[#0f0f0f] border border-white/10 p-8 rounded-[2rem] w-full max-w-sm">
              <h3 className="text-xl font-bold mb-6">Adicionar Conteúdo</h3>
              <form onSubmit={handleAddTask} className="space-y-4">
                 <input 
                  autoFocus
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm text-white outline-none focus:border-cyan-500"
                  placeholder="Título do Vídeo..."
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                 />
                 <button className="w-full py-4 bg-cyan-500 text-black font-bold rounded-xl uppercase text-xs tracking-widest">Criar Task</button>
                 <button type="button" onClick={() => setIsModalOpen(false)} className="w-full text-gray-500 text-[10px] font-bold uppercase mt-2">Cancelar</button>
              </form>
           </div>
        </div>
      )}

      <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide flex-1">
        {columns.map((col) => (
          <div key={col.id} className="min-w-[300px] flex-1 flex flex-col space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${col.dot} shadow-[0_0_8px] shadow-current`}></span>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">{col.label}</h3>
              </div>
              <span className="text-[10px] font-mono text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">
                {tasks.filter(t => t.status === col.id).length}
              </span>
            </div>

            <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-3 min-h-[500px] flex flex-col gap-3">
              {tasks.filter(t => t.status === col.id).map(task => (
                <div key={task.id} className="bg-[#111] border border-white/5 p-4 rounded-2xl group hover:border-cyan-500/30 transition-all cursor-move shadow-sm">
                  <p className="text-xs font-bold text-white mb-3">{task.title}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-[9px] text-gray-500 font-mono uppercase">ID-{task.id.slice(-4)}</span>
                    <div className="flex gap-1">
                       {columns.filter(c => c.id !== col.id).map(c => (
                         <button 
                           key={c.id}
                           onClick={() => moveTask(task.id, c.id)}
                           className="text-[8px] bg-white/5 hover:bg-cyan-500/20 px-1.5 py-0.5 rounded text-gray-600 hover:text-cyan-400 transition"
                         >
                           → {c.label.slice(0, 3)}
                         </button>
                       ))}
                    </div>
                  </div>
                </div>
              ))}
              
              {tasks.filter(t => t.status === col.id).length === 0 && (
                <div className="py-20 text-center flex flex-col items-center justify-center border border-dashed border-white/5 rounded-2xl">
                   <p className="text-[9px] font-mono text-gray-700 uppercase tracking-widest">Vazio</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Kanban;