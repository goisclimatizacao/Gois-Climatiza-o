import React, { useState, useEffect } from 'react';
import { CollectionIcon, CalendarIcon, ChartBarIcon, WandIcon, DocumentDuplicateIcon, ClockIcon, CheckBadgeIcon } from '../components/icons';
import { goisLogoBase64 } from '../components/logo';
import { getProactiveSuggestion } from '../services/geminiService';
import { contentPillars } from '../constants';
import type { CompanySettings } from '../types';

interface HomePageProps {
  setActiveView: (view: string) => void;
  userName: string;
  onCreatePostFromSuggestion: (suggestion: string) => void;
  companySettings: CompanySettings;
}

const quickStats = [
    { label: 'Posts Criados (Mês)', value: '23', icon: <DocumentDuplicateIcon className="w-6 h-6 text-blue-500"/> },
    { label: 'Posts Agendados', value: '8', icon: <ClockIcon className="w-6 h-6 text-purple-500"/> },
    { label: 'Conexões Ativas', value: '2', icon: <CheckBadgeIcon className="w-6 h-6 text-green-500"/> },
];

const quickActions = [
  {
    id: 'generator',
    title: 'Gerador de Conteúdo',
    description: 'Crie posts completos com IA.',
    icon: <WandIcon className="h-7 w-7 text-white" />,
    color: 'bg-[#002060]' // Brand primary color
  },
  {
    id: 'library',
    title: 'Biblioteca de Conteúdo',
    description: 'Use fotos, rascunhos e mais.',
    icon: <CollectionIcon className="h-7 w-7 text-white" />,
    color: 'bg-sky-500' // Accent blue from logo
  },
  {
    id: 'scheduler',
    title: 'Calendário de Posts',
    description: 'Agende suas publicações.',
    icon: <CalendarIcon className="h-7 w-7 text-white" />,
    color: 'bg-purple-500'
  },
  {
    id: 'paid-traffic',
    title: 'Tráfego Pago',
    description: 'Impulsione seus resultados.',
    icon: <ChartBarIcon className="h-7 w-7 text-white" />,
    color: 'bg-amber-500' // Accent yellow from logo
  }
];

interface AiSuggestionCardProps {
  onCreatePost: (suggestion: string) => void;
  companySettings: CompanySettings;
}

const AiSuggestionCard: React.FC<AiSuggestionCardProps> = ({ onCreatePost, companySettings }) => {
    const [suggestion, setSuggestion] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSuggestion = async () => {
            try {
                // In a real app, we'd pass actual recent post data. Here we simulate it.
                const recentPillars = contentPillars.slice(0, 2).map(p => p.name);
                const result = await getProactiveSuggestion(recentPillars, companySettings);
                setSuggestion(result);
            } catch (error) {
                console.error("Failed to fetch AI suggestion:", error);
                setSuggestion("Fale sobre a importância do PMOC para empresas em Presidente Prudente e como isso garante um ambiente de trabalho mais saudável.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchSuggestion();
    }, [companySettings]);

    const handleCreatePost = () => {
        if (suggestion) {
            onCreatePost(suggestion);
        }
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                <WandIcon className="w-6 h-6 mr-3 text-green-500" />
                Sugestão da IA
            </h2>
            {isLoading ? (
                <div className="h-24 flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">Analisando e buscando uma boa ideia...</p>
                </div>
            ) : (
                <>
                    <p className="text-gray-600 dark:text-gray-300 italic">"{suggestion}"</p>
                    <button
                        onClick={handleCreatePost}
                        className="mt-4 w-full md:w-auto inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#002060] border border-transparent rounded-md shadow-sm hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <WandIcon className="w-4 h-4 mr-2" />
                        Criar este Post
                    </button>
                </>
            )}
        </div>
    );
}


export const HomePage: React.FC<HomePageProps> = ({ setActiveView, userName, onCreatePostFromSuggestion, companySettings }) => {
  return (
    <div className="animate-fade-in space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Bem-vindo(a) de volta, {userName}!</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Este é o seu painel de controle. Pronto para criar conteúdo incrível hoje?
        </p>
      </div>
      
      <AiSuggestionCard onCreatePost={onCreatePostFromSuggestion} companySettings={companySettings} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
             <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Visão Geral e Ações</h2>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                {quickStats.map(stat => (
                    <div key={stat.label} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex items-center space-x-4">
                        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full">
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quickActions.map((action) => (
                  <div
                    key={action.id}
                    onClick={() => setActiveView(action.id)}
                    className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex items-start space-x-4"
                  >
                    <div className={`flex-shrink-0 w-14 h-14 rounded-lg flex items-center justify-center ${action.color} shadow-lg`}>
                      {action.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 group-hover:text-[#002060] transition-colors">
                        {action.title}
                      </h3>
                      <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">{action.description}</p>
                    </div>
                  </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};