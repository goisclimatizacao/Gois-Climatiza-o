import React from 'react';
import type { PostTemplate } from '../types';
import { postTemplates } from '../constants/templates';
import { DocumentDuplicateIcon, WandIcon } from '../components/icons';

interface TemplateLibraryProps {
    onUseTemplate: (template: PostTemplate) => void;
}

const TemplateCard: React.FC<{ template: PostTemplate, onUse: () => void }> = ({ template, onUse }) => {
    return (
        <div className="group relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <div className="aspect-video w-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                <img src={template.previewImageUrl} alt={template.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
            </div>
            <div className="p-4 flex-grow flex flex-col">
                <span className="text-xs font-semibold uppercase text-green-600 dark:text-green-400">{template.category}</span>
                <h3 className="font-bold text-gray-800 dark:text-gray-200 mt-1">{template.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 flex-grow">{template.description}</p>
                <button 
                    onClick={onUse}
                    className="mt-4 w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#002060] hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <WandIcon className="w-4 h-4 mr-2"/>
                    Usar este Template
                </button>
            </div>
        </div>
    );
};

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ onUseTemplate }) => {
    return (
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md h-full dark:bg-gray-800 animate-fade-in">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                <div className="flex items-center">
                    <DocumentDuplicateIcon className="h-8 w-8 text-sky-500 mr-3"/>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Biblioteca de Templates</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Comece a criar a partir de modelos pré-definidos para agilizar seu trabalho.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {postTemplates.map((template) => (
                    <TemplateCard 
                        key={template.id} 
                        template={template}
                        onUse={() => onUseTemplate(template)}
                    />
                ))}
            </div>
        </div>
    );
};
