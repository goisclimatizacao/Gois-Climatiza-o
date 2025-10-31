import React, { useState, useEffect } from 'react';
import type { GeneratedContent, AspectRatio, ConnectionId, CarouselSlide, GeneratedPost } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { ClipboardIcon, CheckIcon, WandIcon, RefreshIcon, PaperAirplaneIcon, SaveIcon, PencilIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';
import { goisLogoBase64 } from './logo';
import { PublishModal } from './PublishModal';

interface ContentDisplayProps {
  content: GeneratedContent | null;
  isLoading: boolean;
  onContentUpdate: (content: GeneratedContent) => void;
  onProofread: (text: string) => void;
  isProofreading: boolean;
  onReviseImage: (prompt?: string) => void;
  isRevisingImage: boolean;
  onSelectImage: (imageUrl: string) => void;
  connections: Record<ConnectionId, boolean>;
  onSchedulePost: (content: GeneratedContent, scheduledDate: string, platforms: ConnectionId[]) => void;
  onPublishPost: (content: GeneratedContent, platforms: ConnectionId[]) => void;
  onSaveDraft: (content: GeneratedContent) => void;
}

const Placeholder: React.FC = () => (
    <div className="text-center text-gray-500 dark:text-gray-400 h-full flex flex-col justify-center">
        <div className="bg-gray-200 dark:bg-gray-700/50 w-full max-w-md mx-auto aspect-square rounded-lg flex items-center justify-center mb-4">
            <svg className="w-16 h-16 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Seu conteúdo aparecerá aqui</h3>
        <p className="text-sm">Insira uma ideia, escolha o formato e clique em "Gerar" para começar.</p>
    </div>
);

const getAspectRatioClass = (ratio: AspectRatio) => {
    switch (ratio) {
        case '9:16': return 'aspect-[9/16]';
        case '4:3': return 'aspect-[4/3]';
        case '1:1': default: return 'aspect-square';
    }
};

const CaptionEditor: React.FC<{
    content: GeneratedContent;
    onContentUpdate: (content: GeneratedContent) => void;
    onProofread: (text: string) => void;
    isProofreading: boolean;
}> = ({ content, onContentUpdate, onProofread, isProofreading }) => {
    const caption = content.post.content.caption;
    const [isEditing, setIsEditing] = useState(false);
    const [editableCaption, setEditableCaption] = useState(caption);
    const [captionCopied, setCaptionCopied] = useState(false);

    useEffect(() => { setEditableCaption(caption) }, [caption]);
    useEffect(() => {
        if (captionCopied) {
            const timer = setTimeout(() => setCaptionCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [captionCopied]);

    const handleSave = () => {
        // FIX: Use a type guard to correctly update the discriminated union.
        let newPost: GeneratedPost;
        if (content.post.type === 'image') {
          newPost = {
            ...content.post,
            content: { ...content.post.content, caption: editableCaption },
          };
        } else {
          newPost = {
            ...content.post,
            content: { ...content.post.content, caption: editableCaption },
          };
        }
        onContentUpdate({
          ...content,
          post: newPost,
        });
        setIsEditing(false);
      };
    
    const handleCopy = () => {
        navigator.clipboard.writeText(caption);
        setCaptionCopied(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Legenda do Post</h3>
                <div className="flex items-center space-x-2">
                    {isEditing ? (
                        <button onClick={handleSave} className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md">
                            <CheckIcon className="w-4 h-4 mr-1.5" /> Salvar
                        </button>
                    ) : (
                         <button onClick={() => setIsEditing(true)} className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                             <PencilIcon className="w-4 h-4 mr-1.5" /> Editar
                        </button>
                    )}
                    <button onClick={() => onProofread(editableCaption)} disabled={isProofreading} className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                        {isProofreading ? '...' : <WandIcon className="w-4 h-4 mr-1.5" />} Revisar
                    </button>
                    <button onClick={handleCopy} className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                        {captionCopied ? <CheckIcon className="w-4 h-4 mr-1.5 text-green-600" /> : <ClipboardIcon className="w-4 h-4 mr-1.5" />}
                        {captionCopied ? 'Copiado!' : 'Copiar'}
                    </button>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-700/50 p-4 border border-gray-200 dark:border-gray-700 rounded-lg min-h-[200px]">
                {isEditing ? (
                    <textarea value={editableCaption} onChange={(e) => setEditableCaption(e.target.value)} className="w-full h-full bg-transparent focus:outline-none resize-none text-gray-700 dark:text-gray-300" rows={8}/>
                ) : (
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{caption}</p>
                )}
            </div>
        </div>
    );
};

// FIX: Removed `onProofread` from Omit<> as it's required by CaptionEditor which receives these props.
const ImagePostDisplay: React.FC<Omit<ContentDisplayProps, 'isLoading'>> = (props) => {
    const { content, onContentUpdate, onReviseImage, isRevisingImage, onSelectImage } = props;
    const [promptCopied, setPromptCopied] = useState(false);
    const imagePrompt = content?.post.type === 'image' ? content.post.content.imagePrompt : '';
    const [editablePrompt, setEditablePrompt] = useState(imagePrompt);

    useEffect(() => { setEditablePrompt(imagePrompt) }, [imagePrompt]);
    useEffect(() => {
        if (promptCopied) {
            const timer = setTimeout(() => setPromptCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [promptCopied]);

    const handleCopyPrompt = () => {
        if (content) {
            navigator.clipboard.writeText(editablePrompt);
            setPromptCopied(true);
        }
    };
    
    if (!content || content.post.type !== 'image') return null;
    const aspectRatioClass = getAspectRatioClass(content.aspectRatio);

    return (
        <div className="animate-fade-in">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Imagens Geradas</h3>
                    <div className={`relative w-full max-w-md mx-auto bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md ${aspectRatioClass}`}>
                        <img src={content.selectedImageUrl} alt={editablePrompt} className="w-full h-full object-cover" />
                        <img src={goisLogoBase64} alt="GOÍS Logo" className="absolute bottom-3 right-3 w-1/4 max-w-[120px] h-auto"/>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-4 max-w-md mx-auto w-full">
                        {content.imageUrls.map((url, index) => (
                            <div key={index} className={`aspect-square rounded-md overflow-hidden cursor-pointer ring-offset-2 dark:ring-offset-gray-800 ${content.selectedImageUrl === url ? 'ring-2 ring-[#002060]' : 'hover:opacity-80'}`} onClick={() => onSelectImage(url)}>
                                <img src={url} alt={`Opção ${index + 1}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
                
                <CaptionEditor {...props} />

                <div className="md:col-span-2 mt-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Prompt da Imagem</h3>
                        <div className="flex items-center space-x-2">
                            <button onClick={handleCopyPrompt} className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-md dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-600">
                                {promptCopied ? <CheckIcon className="w-4 h-4 mr-1.5 text-green-600" /> : <ClipboardIcon className="w-4 h-4 mr-1.5" />}
                                {promptCopied ? 'Copiado!' : 'Copiar'}
                            </button>
                             <button onClick={() => onReviseImage(editablePrompt)} disabled={isRevisingImage} className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-md disabled:opacity-50">
                                {isRevisingImage ? '...' : <RefreshIcon className="w-4 h-4 mr-1.5" />}
                                {isRevisingImage ? 'Gerando...' : 'Gerar Novas'}
                            </button>
                        </div>
                    </div>
                    <textarea value={editablePrompt} onChange={(e) => setEditablePrompt(e.target.value)} rows={3} className="w-full text-xs font-mono bg-gray-100 dark:bg-gray-900/50 p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-[#002060] focus:border-[#002060] text-gray-600 dark:text-gray-400"/>
                </div>
            </div>
        </div>
    );
};

// FIX: Removed `onProofread` from Omit<> as it's required by CaptionEditor which receives these props.
const CarouselPostDisplay: React.FC<Omit<ContentDisplayProps, 'isLoading'>> = (props) => {
    const { content } = props;
    const [currentSlide, setCurrentSlide] = useState(0);

    if (!content || content.post.type !== 'carousel') return null;

    const slides = content.post.content.slides;
    const aspectRatioClass = getAspectRatioClass(content.aspectRatio);

    const nextSlide = () => setCurrentSlide(prev => (prev + 1) % (slides.length + 1));
    const prevSlide = () => setCurrentSlide(prev => (prev - 1 + (slides.length + 1)) % (slides.length + 1));

    return (
        <div className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Carousel Viewer */}
                <div className="flex flex-col">
                     <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Pré-visualização do Carrossel</h3>
                     <div className={`relative w-full max-w-md mx-auto bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md ${aspectRatioClass}`}>
                        {/* Cover Image */}
                        <div className={`absolute inset-0 transition-opacity duration-300 ${currentSlide === 0 ? 'opacity-100' : 'opacity-0'}`}>
                           <img src={content.selectedImageUrl} alt="Capa do carrossel" className="w-full h-full object-cover" />
                           <img src={goisLogoBase64} alt="GOÍS Logo" className="absolute bottom-3 right-3 w-1/4 max-w-[120px] h-auto"/>
                        </div>
                        {/* Text Slides */}
                        {slides.map((slide, index) => (
                            <div key={index} className={`absolute inset-0 transition-opacity duration-300 flex flex-col justify-center items-center text-center p-8 bg-[#002060] text-white ${currentSlide === index + 1 ? 'opacity-100' : 'opacity-0'}`}>
                                <h4 className="text-xl md:text-2xl font-bold font-montserrat mb-2">{slide.title}</h4>
                                <p className="text-md md:text-lg font-lato">{slide.body}</p>
                            </div>
                        ))}

                        {/* Navigation */}
                        <button onClick={prevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors"><ChevronLeftIcon className="w-5 h-5"/></button>
                        <button onClick={nextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors"><ChevronRightIcon className="w-5 h-5"/></button>
                        
                        {/* Dots */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
                           {[...Array(slides.length + 1)].map((_, i) => (
                             <div key={i} className={`w-2 h-2 rounded-full ${currentSlide === i ? 'bg-white' : 'bg-white/50'}`}></div>
                           ))}
                        </div>
                    </div>
                </div>

                <CaptionEditor {...props} />
            </div>
        </div>
    );
}

export const ContentDisplay: React.FC<ContentDisplayProps> = (props) => {
  const { content, isLoading, onSaveDraft, onPublishPost, onSchedulePost, connections, isProofreading, isRevisingImage } = props;
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  if (isLoading) return <LoadingSpinner />;
  if (!content) return <Placeholder />;

  const handleSave = () => {
    onSaveDraft(content);
    alert('Rascunho salvo com sucesso!');
  }

  const DisplayComponent = content.post.type === 'carousel' ? CarouselPostDisplay : ImagePostDisplay;

  return (
    <>
      <DisplayComponent {...props} />
      
      <div className="md:col-span-2 mt-8 text-center flex flex-col md:flex-row justify-center items-center gap-4">
          <button 
              onClick={handleSave}
              className="w-full md:w-auto inline-flex justify-center items-center py-3 px-8 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
          >
              <SaveIcon className="w-5 h-5 mr-3"/>
              Salvar Rascunho
          </button>
          <button 
              onClick={() => setIsPublishModalOpen(true)}
              className="w-full md:w-auto inline-flex justify-center items-center py-3 px-8 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#002060] hover:bg-blue-900 disabled:bg-gray-400"
              disabled={isProofreading || isRevisingImage}
          >
              <PaperAirplaneIcon className="w-5 h-5 mr-3"/>
              Publicar / Agendar
          </button>
      </div>

      <PublishModal 
          isOpen={isPublishModalOpen}
          onClose={() => setIsPublishModalOpen(false)}
          content={content}
          connections={connections}
          onSchedulePost={onSchedulePost}
          onPublishPost={onPublishPost}
      />
    </>
  );
};
