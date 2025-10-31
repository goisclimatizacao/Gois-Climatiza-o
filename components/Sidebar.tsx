import React from 'react';
import { SunIcon, MoonIcon, HomeIcon, CollectionIcon, CalendarIcon, ChartBarIcon, LinkIcon, LogoutIcon, WandIcon, SignalIcon, ChatAlt2Icon } from './icons';
import type { UserRole } from '../types';
import { goisLogoBase64 } from './logo';


interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  onLogout: () => void;
  userRole: UserRole;
  userName: string;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

const allNavItems = [
  { id: 'home', label: 'Início', icon: <HomeIcon className="w-5 h-5" />, roles: ['admin', 'marketing'] },
  { id: 'generator', label: 'Gerador', icon: <WandIcon className="w-5 h-5" />, roles: ['admin', 'marketing'] },
  { id: 'library', label: 'Biblioteca', icon: <CollectionIcon className="w-5 h-5" />, roles: ['admin', 'marketing'] },
  { id: 'testimonials', label: 'Depoimentos', icon: <ChatAlt2Icon className="w-5 h-5" />, roles: ['admin', 'marketing'] },
  { id: 'scheduler', label: 'Agendamento', icon: <CalendarIcon className="w-5 h-5" />, roles: ['admin', 'marketing'] },
  { id: 'realtime-dashboard', label: 'Painel Real-time', icon: <SignalIcon className="w-5 h-5" />, roles: ['admin', 'marketing'] },
  { id: 'paid-traffic', label: 'Tráfego Pago', icon: <ChartBarIcon className="w-5 h-5" />, roles: ['admin'] },
  { id: 'connections', label: 'Conexões', icon: <LinkIcon className="w-5 h-5" />, roles: ['admin'] },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, onLogout, userRole, userName, theme, onThemeToggle }) => {
  
  const navItems = allNavItems.filter(item => item.roles.includes(userRole));
  
  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="h-20 flex items-center justify-center px-4 border-b border-gray-200 dark:border-gray-700 bg-[#002060]">
        <div className="flex items-center space-x-3">
          <img src={goisLogoBase64} alt="GOÍS Logo" className="h-12 w-auto"/>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <a
            key={item.id}
            href="#"
            onClick={(e) => { e.preventDefault(); setActiveView(item.id); }}
            className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 group ${
              activeView === item.id
                ? 'bg-[#002060] text-white font-semibold shadow'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <span className={`mr-3 ${activeView === item.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <button 
                onClick={onThemeToggle}
                className="p-2 text-sm font-medium text-gray-500 hover:text-yellow-500 hover:bg-yellow-50 rounded-full transition-colors duration-200 dark:text-gray-400 dark:hover:text-yellow-400 dark:hover:bg-gray-700"
                title={`Mudar para modo ${theme === 'light' ? 'escuro' : 'claro'}`}
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
             </button>
            <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{userName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{userRole}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="p-2 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200 dark:text-gray-400 dark:hover:text-red-500 dark:hover:bg-gray-700"
            title="Sair"
            aria-label="Sair"
          >
            <LogoutIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
