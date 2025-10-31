import React, { useState, useEffect } from 'react';
import type { GeneratedContent, ConnectionId } from '../types';
import { FacebookIcon, InstagramIcon, GoogleIcon, PaperAirplaneIcon, CalendarIcon, CheckIcon } from './icons';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: GeneratedContent;
  connections: Record<ConnectionId, boolean>;
  onSchedulePost: (content: GeneratedContent, scheduledDate: string, platforms: ConnectionId[]) => void;
  onPublishPost: (content: GeneratedContent, platforms: ConnectionId[]) => void;
}

const platformDetails: Record<ConnectionId, { name: string, icon: React.ReactNode }> = {
    facebook: { name: 'Facebook', icon: <FacebookIcon className="w-5 h-5" /> },
    instagram: { name: 'Instagram', icon: <InstagramIcon className="w-5 h-5" /> },
    google: { name: 'Google Business', icon: <GoogleIcon className="w-5 h-5" /> },
};

const generateCalendarLink = (content: GeneratedContent, scheduledDateTime: string): string => {
    const startDate = new Date(scheduledDateTime);
    const endDate = new Date(startDate.getTime() + 30 * 60000); // Add 30 minutes for the event duration

    const toGoogleISO = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const eventTitle = `Post: ${content.post.content.caption.substring(0, 50)}...`;
    const eventDetails = `Publicar post para GOÍS Climatização.\n\nLegenda: ${content.post.content.caption}`;
    
    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: eventTitle,
        dates: `${toGoogleISO(startDate)}/${toGoogleISO(endDate)}`,
        details: eventDetails,
        location: 'Redes Sociais - GOÍS Climatização',
    });

    return `https://www.google.com/calendar/render?${params.toString()}`;
}


export const PublishModal: React.FC<PublishModalProps> = ({ isOpen, onClose, content, connections, onSchedulePost, onPublishPost }) => {
    const [selectedPlatforms, setSelectedPlatforms] = useState<ConnectionId[]>([]);
    const [publishMode, setPublishMode] = useState<'now' | 'schedule'>('now');
    const [scheduleDate, setScheduleDate] = useState('');
    const [scheduleTime, setScheduleTime] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [calendarLink, setCalendarLink] = useState('');

    useEffect(() => {
        if (!isOpen) return;

        // Reset state on open
        setShowSuccess(false);
        setCalendarLink('');
        setPublishMode('now');

        const connectedPlatforms = Object.keys(connections).filter(key => connections[key as ConnectionId]) as ConnectionId[];
        setSelectedPlatforms(connectedPlatforms);

        const now = new Date();
        now.setHours(now.getHours() + 1);
        const defaultDate = now.toISOString().split('T')[0];
        const defaultTime = now.toTimeString().substring(0, 5);
        setScheduleDate(defaultDate);
        setScheduleTime(defaultTime);

    }, [isOpen, connections]);

    const handlePlatformToggle = (platformId: ConnectionId) => {
        setSelectedPlatforms(prev => 
            prev.includes(platformId) ? prev.filter(id => id !== platformId) : [...prev, platformId]
        );
    };

    const handleSuccess = (link?: string) => {
        if (link) {
            setCalendarLink(link);
        }
        setShowSuccess(true);
        setTimeout(() => {
            onClose();
        }, 5000); // Keep modal open longer if there's a calendar link
    }
    
    const handlePublishNow = () => {
        if (selectedPlatforms.length === 0) { alert("Selecione pelo menos uma plataforma."); return; }
        onPublishPost(content, selectedPlatforms);
        handleSuccess();
    };

    const handleSchedule = () => {
        if (selectedPlatforms.length === 0) { alert("Selecione pelo menos uma plataforma."); return; }
        if (!scheduleDate || !scheduleTime) { alert("Selecione data e hora para agendar."); return; }
        const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();
        onSchedulePost(content, scheduledDateTime, selectedPlatforms);
        const link = generateCalendarLink(content, scheduledDateTime);
        handleSuccess(link);
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl transform transition-all" onClick={(e) => e.stopPropagation()}>
                {showSuccess ? (
                    <div className="p-12 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                           <CheckIcon className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                           {publishMode === 'schedule' ? 'Post Agendado com Sucesso!' : 'Post Publicado com Sucesso!'}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                           {publishMode === 'schedule' ? 'Você pode visualizar no calendário.' : 'Sua publicação foi registrada no histórico.'}
                        </p>
                        {calendarLink && (
                            <a 
                                href={calendarLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="mt-6 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
                            >
                                <CalendarIcon className="w-4 h-4 mr-2" />
                                Adicionar ao Google Agenda
                            </a>
                        )}
                    </div>
                ) : (
                <>
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Publicar ou Agendar Post</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Pré-visualização</h3>
                                <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                                    <img src={content.selectedImageUrl} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-3 flex flex-col justify-end">
                                        <p className="text-white text-xs line-clamp-3">{content.post.content.caption}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">1. Selecione as plataformas</h3>
                                <div className="space-y-2">
                                    {Object.entries(platformDetails).map(([id, platform]) => (
                                        connections[id as ConnectionId] && (
                                            <button 
                                                key={id} 
                                                onClick={() => handlePlatformToggle(id as ConnectionId)}
                                                className={`w-full flex items-center p-3 rounded-lg border-2 transition-colors ${selectedPlatforms.includes(id as ConnectionId) ? 'border-[#002060] bg-blue-50 dark:bg-blue-900/30' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                            >
                                                <div className={`mr-3 ${selectedPlatforms.includes(id as ConnectionId) ? 'text-blue-800 dark:text-blue-400' : 'text-gray-500'}`}>{platform.icon}</div>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">{platform.name}</span>
                                                {selectedPlatforms.includes(id as ConnectionId) && <CheckIcon className="w-5 h-5 ml-auto text-green-600"/>}
                                            </button>
                                        )
                                    ))}
                                </div>
                                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mt-6 mb-2">2. Escolha quando postar</h3>
                                <div className="flex rounded-md shadow-sm">
                                    <button onClick={() => setPublishMode('now')} className={`relative inline-flex items-center px-4 py-2 rounded-l-md border text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-[#002060] focus:border-[#002060] ${publishMode === 'now' ? 'bg-[#002060] text-white border-[#002060]' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50'}`}>
                                        Publicar Agora
                                    </button>
                                    <button onClick={() => setPublishMode('schedule')} className={`-ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-[#002060] focus:border-[#002060] ${publishMode === 'schedule' ? 'bg-[#002060] text-white border-[#002060]' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50'}`}>
                                        Agendar
                                    </button>
                                </div>
                                {publishMode === 'schedule' && (
                                    <div className="mt-4 space-y-2 animate-fade-in-fast">
                                        <div className="grid grid-cols-2 gap-2">
                                            <input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} className="block w-full text-sm border-gray-300 focus:ring-[#002060] focus:border-[#002060] rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                            <input type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} className="block w-full text-sm border-gray-300 focus:ring-[#002060] focus:border-[#002060] rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 flex justify-end items-center space-x-3 rounded-b-lg">
                         <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500">
                            Cancelar
                        </button>
                        {publishMode === 'now' ? (
                             <button onClick={handlePublishNow} className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#002060] border border-transparent rounded-md shadow-sm hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                <PaperAirplaneIcon className="w-4 h-4 mr-2" />
                                Publicar Agora
                            </button>
                        ) : (
                             <button onClick={handleSchedule} className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#002060] border border-transparent rounded-md shadow-sm hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                <CalendarIcon className="w-4 h-4 mr-2" />
                                Agendar Post
                            </button>
                        )}
                    </div>
                </>
                )}
            </div>
        </div>
    );
};
