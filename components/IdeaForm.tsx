import React, { useState, useEffect } from 'react';
import { commemorativeDates, contentPillars } from '../constants';
import { DocumentTextIcon, WandIcon, CollectionIcon } from './icons';
import type { AspectRatio } from '../types';

interface IdeaFormProps {
  onGenerateImagePost: (idea: string, aspectRatio: AspectRatio) => void;
  onGenerateWrittenPost: (idea: string, aspectRatio: AspectRatio) => void;
  onGenerateCarouselPost: (idea: string, aspectRatio: AspectRatio) => void;
  isLoading: boolean;
  initialIdea?: string | null;
}

const formatOptions: { value: AspectRatio; label: string }[] = [
    { value: '1:1', label: 'Quadrado' },
    { value: '4:3', label: 'Paisagem' },
    { value: '9:16', label: 'Stories' },
];

export const IdeaForm: React.FC<IdeaFormProps> = ({ 
    onGenerateImagePost, 
    onGenerateWrittenPost,
    onGenerateCarouselPost,
    isLoading, 
    initialIdea 
}) => {
  const [idea, setIdea] = useState('');
  const [pillar, setPillar] = useState('');
  const [date, setDate] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');

  useEffect(() => {
    if (initialIdea) {
      setIdea(initialIdea);
    }
  }, [initialIdea]);

  const handlePillarChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPillarId = e.target.value;
    const selectedPillar = contentPillars.find(p => p.id === selectedPillarId);
    setPillar(selectedPillarId);
    setDate(''); 
    if (selectedPillar) {
      setIdea(`Gerar um post com base no pilar "${selectedPillar.name}": ${selectedPillar.description}`);
    } else {
        setIdea('');
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDateValue = e.target.value;
    const selectedDate = commemorativeDates.find(d => d.date === selectedDateValue);
    setDate(selectedDateValue);
    setPillar('');
    if (selectedDate) {
      setIdea(`Criar um post para ${selectedDate.name} (${selectedDate.date}). Tema: ${selectedDate.theme}`);
    } else {
        setIdea('');
    }
  };

  const handleSubmit = (generator: (idea: string, aspectRatio: AspectRatio) => void) => (e: React.FormEvent) => {
    e.preventDefault();
    if (idea.trim() && !isLoading) {
      generator(idea, aspectRatio);
    }
  };

  return (
    <form className="space-y-4">
      <div>
        <label htmlFor="pillar" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Comece por um pilar de conteúdo:
        </label>
        <select
          id="pillar"
          value={pillar}
          onChange={handlePillarChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#002060] focus:border-[#002060] sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="">Selecione um pilar...</option>
          {contentPillars.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Ou escolha uma data comemorativa:
        </label>
        <select
          id="date"
          value={date}
          onChange={handleDateChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#002060] focus:border-[#002060] sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="">Selecione uma data...</option>
          {commemorativeDates.map((d) => (
            <option key={d.date} value={d.date}>
              {d.date} - {d.name}
            </option>
          ))}
        </select>
      </div>

      <div className="relative">
         <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <div className="relative flex justify-center">
            <span className="px-2 bg-gray-50 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">OU</span>
        </div>
      </div>

      <div>
        <label htmlFor="idea" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Descreva sua ideia para o post:
        </label>
        <textarea
          id="idea"
          rows={5}
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Ex: Falar sobre a importância de limpar os filtros do ar condicionado para a saúde respiratória."
          className="mt-1 shadow-sm focus:ring-[#002060] focus:border-[#002060] block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div>
        <label htmlFor="format" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Formato da Imagem de Capa
        </label>
        <select
          id="format"
          value={aspectRatio}
          onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#002060] focus:border-[#002060] sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          {formatOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label} ({option.value})</option>
          ))}
        </select>
      </div>
      
      <div className="space-y-3 pt-2">
         <button
            type="button"
            onClick={handleSubmit(onGenerateImagePost)}
            disabled={isLoading || !idea.trim()}
            className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#002060] hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
            <WandIcon className="w-5 h-5 mr-2"/>
            {isLoading ? 'Gerando...' : 'Gerar Imagem Única (IA)'}
        </button>
         <button
            type="button"
            onClick={handleSubmit(onGenerateCarouselPost)}
            disabled={isLoading || !idea.trim()}
            className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
            <CollectionIcon className="w-5 h-5 mr-2"/>
            {isLoading ? 'Gerando...' : 'Gerar Carrossel (IA)'}
        </button>
        <button
            type="button"
            onClick={handleSubmit(onGenerateWrittenPost)}
            disabled={isLoading || !idea.trim()}
            className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#002060] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
        >
            <DocumentTextIcon className="w-5 h-5 mr-2" />
            {isLoading ? 'Gerando...' : 'Gerar Arte Escrita (IA)'}
        </button>
      </div>
    </form>
  );
};
