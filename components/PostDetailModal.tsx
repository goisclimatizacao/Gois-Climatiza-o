import React from 'react';
import type { ScheduledPost, ConnectionId } from '../types';
import { FacebookIcon, InstagramIcon, GoogleIcon, CalendarIcon, XIcon } from './icons';

interface PostDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: ScheduledPost;
}

const platformDetails: Record<ConnectionId, { name: string, icon: React.ReactNode }> = {
    facebook: { name: 'Facebook', icon: <FacebookIcon className="w-4 h-4 text-blue-600" /> },
    instagram: { name: 'Instagram', icon: <InstagramIcon className="w-4 h-4 text-pink-600" /> },
    google: { name: 'Google Business', icon: <GoogleIcon className="w-4 h-4" /> },
};


export const PostDetailModal: React.FC<PostDetailModalProps> = ({ isOpen, onClose, post }) => {
    if (!isOpen) return null;

    const scheduledDate = new Date(post.scheduledDate);
    const formattedDate = scheduledDate.toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric'
    });
    const formattedTime = scheduledDate.toLocaleTimeString('pt-BR', {
        hour: '2-digit', minute: '2-digit'
    });
    
    const aspectRatioClass = `aspect-[${post.content.aspectRatio.replace(':', '/')}]`;


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Detalhes do Post Agendado</h2>
                     <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <XIcon className="h-6 w-6 text-gray-500" />
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Image Column */}
                        <div className="w-full">
                             <img 
                                src={post.content.selectedImageUrl} 
                                alt="Post agendado" 
                                className={`w-full rounded-lg object-cover shadow-md ${aspectRatioClass}`}
                            />
                        </div>

                        {/* Details Column */}
                        <div>
                            <div className="mb-4">
                                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Agendado para:</h3>
                                <div className="flex items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                    <CalendarIcon className="w-6 h-6 text-green-600 mr-3" />
                                    <div>
                                        <p className="font-bold text-gray-800 dark:text-gray-200">{formattedDate}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">às {formattedTime}</p>
                                    </div>
                                </div>
                            </div>
                            
                             <div className="mb-4">
                                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Plataformas:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {post.platforms.map(p => (
                                        <div key={p} className="flex items-center bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {platformDetails[p].icon}
                                            <span className="ml-2">{platformDetails[p].name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Legenda:</h3>
                                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 border border-gray-200 dark:border-gray-700 rounded-lg max-h-60 overflow-y-auto">
                                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{post.content.post.content.caption}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 flex justify-end items-center space-x-3 rounded-b-lg">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500">
                        Fechar
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        Cancelar Agendamento
                    </button>
                </div>
            </div>
        </div>
    );
};
