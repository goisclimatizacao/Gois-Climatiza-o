import React, { useState } from 'react';
import { ChartBarIcon, XIcon, PaperAirplaneIcon } from '../components/icons';
import type { PaidCampaign, PublishedPost, GeneratedContent } from '../types';

interface NewCampaignModalProps {
    isOpen: boolean;
    onClose: () => void;
    publishedPosts: PublishedPost[];
    onCreateCampaign: (campaign: Omit<PaidCampaign, 'id' | 'mockMetrics' | 'status'>) => void;
}

const NewCampaignModal: React.FC<NewCampaignModalProps> = ({ isOpen, onClose, publishedPosts, onCreateCampaign }) => {
    const [selectedPost, setSelectedPost] = useState<PublishedPost | null>(null);
    const [budget, setBudget] = useState<number>(50);
    const [durationDays, setDurationDays] = useState<number>(7);
    const [targetAudience, setTargetAudience] = useState('Homens e mulheres, 25-55 anos, em Presidente Prudente e região, interessados em bem-estar, família e negócios.');
    const [step, setStep] = useState(1);

    if (!isOpen) return null;

    const handleCreate = () => {
        if (selectedPost) {
            onCreateCampaign({
                postId: selectedPost.id,
                postContent: selectedPost.content,
                budget,
                durationDays,
                startDate: new Date().toISOString(),
                targetAudience,
            });
            onClose();
            // Reset for next time
            setStep(1);
            setSelectedPost(null);
        }
    };
    
    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl transform transition-all" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Criar Nova Campanha ({`Passo ${step} de 2`})</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><XIcon className="w-5 h-5"/></button>
                </div>
                
                {step === 1 && (
                    <div className="p-6">
                        <h4 className="font-semibold mb-4">Selecione um post publicado para impulsionar:</h4>
                        <div className="max-h-96 overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-4 pr-2">
                            {publishedPosts.length > 0 ? publishedPosts.map(post => (
                                <div 
                                    key={post.id} 
                                    onClick={() => setSelectedPost(post)} 
                                    className={`cursor-pointer rounded-lg overflow-hidden border-4 ${selectedPost?.id === post.id ? 'border-green-500' : 'border-transparent hover:border-green-300'}`}
                                >
                                    <img src={post.content.selectedImageUrl} alt="post" className="w-full h-full object-cover aspect-square"/>
                                </div>
                            )) : <p className="text-gray-500 col-span-full">Nenhum post publicado para impulsionar.</p>}
                        </div>
                    </div>
                )}

                {step === 2 && selectedPost && (
                    <div className="p-6 space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2">Post Selecionado:</h4>
                            <div className="flex items-start space-x-3 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                <img src={selectedPost.content.selectedImageUrl} className="w-16 h-16 rounded-md object-cover"/>
                                <p className="text-sm text-gray-600 dark:text-gray-300 italic line-clamp-3">"{selectedPost.content.post.content.caption}"</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Orçamento (R$)</label>
                                <input type="number" id="budget" value={budget} onChange={e => setBudget(Number(e.target.value))} className="mt-1 w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600"/>
                            </div>
                             <div>
                                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Duração (dias)</label>
                                <input type="number" id="duration" value={durationDays} onChange={e => setDurationDays(Number(e.target.value))} className="mt-1 w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600"/>
                            </div>
                        </div>
                         <div>
                            <label htmlFor="audience" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Público-Alvo</label>
                            <textarea id="audience" rows={3} value={targetAudience} onChange={e => setTargetAudience(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600"></textarea>
                        </div>
                    </div>
                )}
                
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 flex justify-between items-center rounded-b-lg">
                    {step === 2 ? (
                        <button onClick={() => setStep(1)} className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300">Voltar</button>
                    ) : <div></div>}
                    {step === 1 ? (
                        <button onClick={() => setStep(2)} disabled={!selectedPost} className="px-4 py-2 bg-[#002060] text-white text-sm font-medium rounded-md hover:bg-blue-900 disabled:bg-gray-400">Avançar</button>
                    ) : (
                        <button onClick={handleCreate} className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700">
                           <PaperAirplaneIcon className="w-5 h-5 mr-2"/> Lançar Campanha
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

interface PaidTrafficProps {
    paidCampaigns: PaidCampaign[];
    publishedPosts: PublishedPost[];
    onCreateCampaign: (campaign: Omit<PaidCampaign, 'id' | 'mockMetrics' | 'status'>) => void;
}

export const PaidTraffic: React.FC<PaidTrafficProps> = ({ paidCampaigns, publishedPosts, onCreateCampaign }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-md h-full animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                <div className="flex items-center">
                    <ChartBarIcon className="h-8 w-8 text-amber-500 mr-3" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Gestão de Tráfego Pago</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                           Crie e monitore suas campanhas de impulsionamento.
                        </p>
                    </div>
                </div>
                 <button onClick={() => setIsModalOpen(true)} className="mt-4 md:mt-0 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-sm hover:bg-green-700">
                    Criar Nova Campanha
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Post</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Orçamento</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Alcance (Mock)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Cliques (Mock)</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {paidCampaigns.length > 0 ? paidCampaigns.map((campaign) => (
                            <tr key={campaign.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-md object-cover" src={campaign.postContent.selectedImageUrl} alt="" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 max-w-xs">{campaign.postContent.post.content.caption}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {campaign.status === 'active' ? 'Ativa' : 'Concluída'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">R$ {campaign.budget.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{campaign.mockMetrics.reach.toLocaleString('pt-BR')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{campaign.mockMetrics.clicks.toLocaleString('pt-BR')}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="text-center py-10 text-gray-500">Nenhuma campanha criada ainda.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <NewCampaignModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                publishedPosts={publishedPosts}
                onCreateCampaign={onCreateCampaign}
            />
        </div>
    );
};
