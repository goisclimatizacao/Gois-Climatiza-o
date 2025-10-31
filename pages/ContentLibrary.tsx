import React, { useState, useEffect } from 'react';
import { PhotoIcon, ClockIcon, PencilIcon, CheckBadgeIcon } from '../components/icons';
import { getLibraryImages } from '../services/imageLibraryService';
import type { LibraryImage, Draft, PublishedPost, ConnectionId } from '../types';
import { FacebookIcon, InstagramIcon, GoogleIcon } from '../components/icons';

interface ContentLibraryProps {
    onSelectImage: (image: LibraryImage) => void;
    drafts: Draft[];
    publishedPosts: PublishedPost[];
    onLoadDraft: (draft: Draft) => void;
}

type Tab = 'library' | 'drafts' | 'published';

const PlatformIcon: React.FC<{platform: ConnectionId}> = ({platform}) => {
    switch(platform) {
        case 'facebook': return <FacebookIcon className="w-4 h-4 text-blue-600" title="Facebook" />;
        case 'instagram': return <InstagramIcon className="w-4 h-4 text-pink-600" title="Instagram" />;
        case 'google': return <GoogleIcon className="w-4 h-4" title="Google" />;
        default: return null;
    }
}

const ImageGallery: React.FC<{ onSelectImage: (image: LibraryImage) => void }> = ({ onSelectImage }) => {
    const [images, setImages] = useState<LibraryImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);

     useEffect(() => {
        const fetchImages = async () => {
            try {
                setIsLoading(true);
                setImages(await getLibraryImages());
            } finally {
                setIsLoading(false);
            }
        };
        fetchImages();
    }, []);

    if (isLoading) return <p>Carregando imagens...</p>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image) => (
                <div key={image.id} className="group relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
                     <div className="aspect-square w-full bg-gray-100 dark:bg-gray-700">
                        <img src={image.url} alt={image.alt} className="w-full h-full object-cover"/>
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center p-4">
                       <button onClick={() => onSelectImage(image)} className="opacity-0 group-hover:opacity-100 transform group-hover:scale-100 scale-90 transition-all duration-300 flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md">
                            <PhotoIcon className="w-5 h-5 mr-2" />
                            Usar e Criar Legenda
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

const DraftsList: React.FC<{ drafts: Draft[], onLoadDraft: (draft: Draft) => void }> = ({ drafts, onLoadDraft }) => {
    if (drafts.length === 0) return <p className="text-gray-500">Nenhum rascunho salvo.</p>;
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {drafts.map((draft) => (
                <div key={draft.id} className="group relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
                    <div className="aspect-square w-full bg-gray-100 dark:bg-gray-700">
                        <img src={draft.selectedImageUrl} alt="Rascunho" className="w-full h-full object-cover"/>
                        <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded-full">RASCUNHO</div>
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex flex-col items-center justify-center p-4 text-center">
                        <p className="text-white text-sm line-clamp-3 opacity-0 group-hover:opacity-100 transition-opacity mb-3">"{draft.post.content.caption}"</p>
                        <button onClick={() => onLoadDraft(draft)} className="opacity-0 group-hover:opacity-100 transform group-hover:scale-100 scale-90 transition-all duration-300 flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md">
                            <PencilIcon className="w-5 h-5 mr-2" />
                            Editar Rascunho
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

const PublishedList: React.FC<{ posts: PublishedPost[] }> = ({ posts }) => {
    if (posts.length === 0) return <p className="text-gray-500">Nenhum post publicado ainda.</p>;
    return (
        <div className="space-y-4">
            {posts.map((post) => {
                const publishedDate = new Date(post.publishedDate);
                return (
                    <div key={post.id} className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-start space-x-4">
                        <img src={post.content.selectedImageUrl} alt="Publicado" className="w-24 h-24 object-cover rounded-md flex-shrink-0" />
                        <div className="flex-grow">
                            <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3 italic">"{post.content.post.content.caption}"</p>
                            <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
                                <div className="flex items-center">
                                    <CheckBadgeIcon className="w-4 h-4 mr-1.5 text-green-500" />
                                    <span>Publicado em {publishedDate.toLocaleDateString('pt-BR')} às {publishedDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit'})}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span>Em:</span>
                                    {post.platforms.map(p => <PlatformIcon key={p} platform={p} />)}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}

export const ContentLibrary: React.FC<ContentLibraryProps> = (props) => {
    const [activeTab, setActiveTab] = useState<Tab>('library');
    const tabs: {id: Tab, label: string}[] = [
        { id: 'library', label: 'Imagens da Empresa' },
        { id: 'drafts', label: `Rascunhos (${props.drafts.length})` },
        { id: 'published', label: `Histórico (${props.publishedPosts.length})` },
    ];
    
    return (
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md h-full dark:bg-gray-800">
             <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Biblioteca de Conteúdo</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Gerencie seus ativos: imagens, rascunhos e posts já publicados.
                </p>
            </div>

            <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'}`}>
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="animate-fade-in-fast">
                {activeTab === 'library' && <ImageGallery onSelectImage={props.onSelectImage} />}
                {activeTab === 'drafts' && <DraftsList drafts={props.drafts} onLoadDraft={props.onLoadDraft} />}
                {activeTab === 'published' && <PublishedList posts={props.publishedPosts} />}
            </div>
        </div>
    );
};
