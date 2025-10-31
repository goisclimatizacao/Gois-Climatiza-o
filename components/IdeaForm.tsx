import React, { useState, useEffect, useRef } from 'react';
import type { AspectRatio } from '../types';
import { sortedCommemorativeDates } from '../constants';

interface IdeaFormProps {
    onGenerateImagePost: (idea: string, aspectRatio: AspectRatio) => void;
    onGenerateWrittenPost: (idea: string, aspectRatio: AspectRatio) => void;
    onGenerateCarouselPost: (idea: string, aspectRatio: AspectRatio) => void;
    isLoading: boolean;
    initialIdea: string | null;
}

type PostType = 'image' | 'written' | 'carousel';

export const IdeaForm: React.FC<IdeaFormProps> = ({ 
    onGenerateImagePost,
    onGenerateWrittenPost,
    onGenerateCarouselPost,
    isLoading,
    initialIdea,
 }) => {
    const [idea, setIdea] = useState('');
    const [postType, setPostType] = useState<PostType>('image');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
    const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (initialIdea) {
            setIdea(initialIdea);
        }
    }, [initialIdea]);
    
    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDateDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const handleDateSelect = (dateName: string) => {
        setIdea(`Fazer um post sobre ${dateName}`);
        setIsDateDropdownOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!idea.trim() || isLoading) return;

        switch(postType) {
            case 'image':
                onGenerateImagePost(idea, aspectRatio);
                break;
            case 'written':
                onGenerateWrittenPost(idea, aspectRatio);
                break;
            case 'carousel':
                onGenerateCarouselPost(idea, aspectRatio);
                break;
        }
    };
    
    const postTypeOptions = [
        { id: 'image', label: 'Imagem + Legenda' },
        { id: 'written', label: 'Texto na Imagem' },
        { id: 'carousel', label: 'Carrossel' },
    ];

    const aspectRatioOptions: { id: AspectRatio, label: string }[] = [
        { id: '1:1', label: 'Quadrado' },
        { id: '9:16', label: 'Story' },
        { id: '4:3', label: 'Paisagem' },
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative" ref={dropdownRef}>
                <div className="flex justify-between items-center mb-1">
                    <label htmlFor="idea" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Qual a sua ideia para o post?
                    </label>
                    <button type="button" onClick={() => setIsDateDropdownOpen(prev => !prev)} className="text-xs text-green-600 hover:text-green-800 font-semibold dark:text-green-400 dark:hover:text-green-300">
                        💡 Usar Data Comemorativa
                    </button>
                </div>
                <textarea
                    id="idea"
                    rows={4}
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#002060] focus:ring-[#002060] sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Ex: Fale sobre a importância da manutenção preventiva no verão..."
                />
                {isDateDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-48 overflow-y-auto">
                        <ul className="py-1">
                            {sortedCommemorativeDates.map(date => (
                                <li 
                                    key={date.name}
                                    onClick={() => handleDateSelect(date.name)}
                                    className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                >
                                    <span className="font-semibold">{date.dayMonth}</span> - {date.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div>
                 <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Formato do Post</label>
                 <div className="mt-2 grid grid-cols-3 gap-2">
                    {postTypeOptions.map(option => (
                        <button type="button" key={option.id} onClick={() => setPostType(option.id as PostType)} className={`px-2 py-2 text-xs font-medium rounded-md text-center transition-colors ${postType === option.id ? 'bg-[#002060] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}>
                            {option.label}
                        </button>
                    ))}
                 </div>
            </div>
            
            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Proporção da Imagem</label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                    {aspectRatioOptions.map(option => (
                        <button type="button" key={option.id} onClick={() => setAspectRatio(option.id)} className={`px-2 py-2 text-xs font-medium rounded-md text-center transition-colors ${aspectRatio === option.id ? 'bg-[#002060] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}>
                            {option.label} ({option.id})
                        </button>
                    ))}
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading || !idea.trim()}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <div className="flex items-center">
                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Gerando...
                    </div>
                ) : (
                    'Gerar Conteúdo'
                )}
            </button>
        </form>
    );
};