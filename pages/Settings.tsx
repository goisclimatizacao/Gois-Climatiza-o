import React, { useState, useEffect } from 'react';
import { CogIcon, SaveIcon } from '../components/icons';
import type { CompanySettings } from '../types';

interface SettingsProps {
    settings: CompanySettings;
    onUpdateSettings: (newSettings: CompanySettings) => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, onUpdateSettings }) => {
    const [formState, setFormState] = useState<CompanySettings>(settings);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        setFormState(settings);
    }, [settings]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateSettings(formState);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    const handleClearData = () => {
        if (window.confirm("ATENÇÃO: Isso apagará TODOS os dados da aplicação (rascunhos, posts, agendamentos, etc.) do seu navegador. Deseja continuar?")) {
            localStorage.clear();
            alert("Dados limpos com sucesso! A aplicação será recarregada.");
            window.location.reload();
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-md h-full animate-fade-in">
             <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6 flex items-center">
                <CogIcon className="h-8 w-8 text-blue-600 mr-3"/>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Configurações da Empresa e IA</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                       Personalize as informações que a IA usa para gerar conteúdo.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome da Empresa</label>
                        <input type="text" name="companyName" id="companyName" value={formState.companyName} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600"/>
                    </div>
                     <div>
                        <label htmlFor="slogan" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Slogan</label>
                        <input type="text" name="slogan" id="slogan" value={formState.slogan} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600"/>
                    </div>
                </div>
                
                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Localização</label>
                    <input type="text" name="location" id="location" value={formState.location} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600"/>
                </div>
                
                <div>
                    <label htmlFor="services" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Serviços Principais (separados por vírgula)</label>
                    <textarea name="services" id="services" rows={4} value={formState.services} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600"></textarea>
                </div>
                
                 <div>
                    <label htmlFor="voiceTone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tom de Voz da Marca</label>
                    <input type="text" name="voiceTone" id="voiceTone" value={formState.voiceTone} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600"/>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="cta" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Exemplo de Chamada para Ação (CTA)</label>
                        <input type="text" name="cta" id="cta" value={formState.cta} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600"/>
                    </div>
                     <div>
                        <label htmlFor="hashtags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hashtags Padrão</label>
                        <input type="text" name="hashtags" id="hashtags" value={formState.hashtags} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600"/>
                    </div>
                </div>
                
                <div className="flex justify-end pt-4">
                     <button type="submit" className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#002060] hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <SaveIcon className="w-5 h-5 mr-2"/>
                        {isSaved ? 'Salvo!' : 'Salvar Alterações'}
                    </button>
                </div>
            </form>

            <div className="mt-12 pt-6 border-t border-red-300 dark:border-red-500/30">
                 <h2 className="text-lg font-semibold text-red-700 dark:text-red-400">Zona de Perigo</h2>
                <div className="mt-4 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-gray-800 dark:text-gray-200">Limpar Dados da Aplicação</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Esta ação é irreversível e removerá todos os seus dados locais.</p>
                    </div>
                     <button onClick={handleClearData} className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700">
                        Limpar Dados
                    </button>
                </div>
            </div>

        </div>
    );
};
