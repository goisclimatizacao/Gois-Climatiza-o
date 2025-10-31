import React from 'react';
import { MenuIcon } from './icons';

interface HeaderProps {
    activeView: string;
    onMenuClick: () => void;
}

const viewTitles: Record<string, string> = {
    home: 'Início',
    generator: 'Gerador de Conteúdo',
    library: 'Biblioteca',
    templates: 'Templates',
    testimonials: 'Depoimentos',
    scheduler: 'Agendamento',
    'realtime-dashboard': 'Painel Real-time',
    'paid-traffic': 'Tráfego Pago',
    connections: 'Conexões',
    team: 'Equipe',
    settings: 'Configurações',
};

export const Header: React.FC<HeaderProps> = ({ activeView, onMenuClick }) => {
    const title = viewTitles[activeView] || 'Painel GOIS';
    return (
        <header className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between p-4 h-20">
                <div className="flex items-center">
                    <button 
                        onClick={onMenuClick}
                        className="lg:hidden p-2 -ml-2 mr-2 text-gray-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        aria-label="Abrir menu"
                    >
                        <MenuIcon className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{title}</h1>
                </div>
                {/* Placeholder for future header items like notifications or user menu */}
            </div>
        </header>
    );
};