
import React from 'react';
import { Icons } from '../constants';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Início', icon: <Icons.Dashboard /> },
    { id: 'accounts', label: 'Canais', icon: <Icons.Accounts /> },
    { id: 'finance', label: 'Grana', icon: <Icons.Finance /> },
    { id: 'strategy', label: 'Planos', icon: <Icons.Library /> },
    { id: 'kanban', label: 'Fila', icon: <Icons.Strategy /> },
  ];

  return (
    <>
      {/* Desktop: Sidebar Lateral */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-[#0a0a0a] border-r border-white/5 hidden lg:flex flex-col z-50">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-10">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg glow-cyan shadow-cyan-500/20 shadow-lg"></div>
            <h1 className="text-xl font-bold tracking-tighter text-white">
              DARKSTREAM
            </h1>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
                }`}
              >
                <span>{item.icon}</span>
                <span className="font-semibold text-sm">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile: Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-white/5 lg:hidden flex justify-around items-center px-2 py-3 z-[100]">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center space-y-1 flex-1 transition-all ${
              activeTab === item.id ? 'text-cyan-400' : 'text-gray-500'
            }`}
          >
            <div className={`${activeTab === item.id ? 'p-1 bg-cyan-500/10 rounded-lg shadow-[0_0_10px_rgba(34,211,238,0.2)]' : ''}`}>
              {item.icon}
            </div>
            <span className="text-[9px] font-bold uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Mobile: Header Superior Fixo */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 z-50">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-md"></div>
          <span className="font-bold text-xs tracking-widest text-white uppercase">DarkStream Master</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-cyan-500">OPS</div>
      </div>
    </>
  );
};

export default Sidebar;
