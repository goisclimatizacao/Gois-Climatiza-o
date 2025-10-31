import React, { useState, useEffect, useCallback } from 'react';
import { IdeaForm } from '../components/IdeaForm';
import { ContentDisplay } from '../components/ContentDisplay';
import { generatePostContent, generateImage, proofreadText, generateWrittenImageContent, generateCaptionForImage, generateCarouselContent } from '../services/geminiService';
import { urlToBase64 } from '../utils/imageUtils';
import type { GeneratedContent, AspectRatio, LibraryImage, ConnectionId, Draft, PublishedPost, GeneratedPost } from '../types';

interface ContentGeneratorProps {
  imageFromLibrary: LibraryImage | null;
  clearImageFromLibrary: () => void;
  ideaFromTestimonial: string | null;
  clearIdeaFromTestimonial: () => void;
  contentToLoad: GeneratedContent | null;
  clearContentToLoad: () => void;
  connections: Record<ConnectionId, boolean>;
  onSchedulePost: (content: GeneratedContent, scheduledDate: string, platforms: ConnectionId[]) => void;
  onPublishPost: (content: GeneratedContent, platforms: ConnectionId[]) => void;
  onSaveDraft: (draft: Draft) => void;
}

export const ContentGenerator: React.FC<ContentGeneratorProps> = React.memo(({ 
  imageFromLibrary, 
  clearImageFromLibrary,
  ideaFromTestimonial,
  clearIdeaFromTestimonial,
  contentToLoad,
  clearContentToLoad,
  connections,
  onSchedulePost,
  onPublishPost,
  onSaveDraft
}) => {
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRevisingImage, setIsRevisingImage] = useState(false);
  const [isProofreading, setIsProofreading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialIdea, setInitialIdea] = useState<string | null>(null);

  useEffect(() => {
    if (contentToLoad) {
      setContent(contentToLoad);
      clearContentToLoad();
    }
  }, [contentToLoad, clearContentToLoad]);

  const handleApiError = (error: unknown, action: string) => {
    console.error(`Error during '${action}':`, error);
    let friendlyMessage = `Falha ao ${action}: Ocorreu um erro desconhecido.`;

    if (error instanceof Error && error.message) {
      if (error.message.includes('RESOURCE_EXHAUSTED')) {
        friendlyMessage = "Você excedeu sua cota de uso da API do Gemini. Verifique seu plano e detalhes de faturamento no Google AI Studio.";
      } else {
        friendlyMessage = `Falha ao ${action}: ${error.message}`;
      }
    }
    setError(friendlyMessage);
  };

  const handleGenerateCaptionForLibraryImage = useCallback(async (image: LibraryImage) => {
    setIsLoading(true);
    setError(null);
    setContent(null);
    try {
      const base64Image = await urlToBase64(image.url);
      const { caption } = await generateCaptionForImage(base64Image, 'image/jpeg');
      
      setContent({
        id: `content_${new Date().getTime()}`,
        post: {
          type: 'image',
          content: {
            caption,
            imagePrompt: image.alt,
          }
        },
        imageUrls: [image.url],
        selectedImageUrl: image.url,
        aspectRatio: '1:1',
      });

    } catch (e) {
      handleApiError(e, 'gerar legenda');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (imageFromLibrary) {
      handleGenerateCaptionForLibraryImage(imageFromLibrary);
      clearImageFromLibrary();
    }
  }, [imageFromLibrary, clearImageFromLibrary, handleGenerateCaptionForLibraryImage]);

  useEffect(() => {
    if (ideaFromTestimonial) {
        setInitialIdea(ideaFromTestimonial);
        clearIdeaFromTestimonial();
    }
  }, [ideaFromTestimonial, clearIdeaFromTestimonial]);


  const handleGenerate = useCallback(async (idea: string, aspectRatio: AspectRatio, generatorFn: (idea: string) => Promise<GeneratedPost>) => {
    setIsLoading(true);
    setError(null);
    setContent(null);

    try {
      const postData = await generatorFn(idea);
      const imagePrompt = postData.type === 'image' ? postData.content.imagePrompt : postData.content.coverImagePrompt;
      
      const images = await generateImage(imagePrompt, aspectRatio);
      const imageUrls = images.map(img => `data:${img.mimeType};base64,${img.base64}`);
      
      setContent({ 
        id: `content_${new Date().getTime()}`,
        post: postData, 
        imageUrls, 
        selectedImageUrl: imageUrls[0], 
        aspectRatio 
      });
    } catch (e) {
      handleApiError(e, 'gerar conteúdo');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGenerateImagePost = useCallback((idea: string, aspectRatio: AspectRatio) => {
    handleGenerate(idea, aspectRatio, generatePostContent);
  }, [handleGenerate]);

  const handleGenerateWrittenPost = useCallback((idea: string, aspectRatio: AspectRatio) => {
    handleGenerate(idea, aspectRatio, generateWrittenImageContent);
  }, [handleGenerate]);
  
  const handleGenerateCarouselPost = useCallback((idea: string, aspectRatio: AspectRatio) => {
    handleGenerate(idea, aspectRatio, generateCarouselContent);
  }, [handleGenerate]);

  const handleReviseImage = useCallback(async (newPrompt?: string) => {
    if (!content) return;
    
    const promptToUse = newPrompt || (content.post.type === 'image' ? content.post.content.imagePrompt : content.post.content.coverImagePrompt);

    setIsRevisingImage(true);
    setError(null);
    try {
        const images = await generateImage(promptToUse, content.aspectRatio);
        const imageUrls = images.map(img => `data:${img.mimeType};base64,${img.base64}`);
        
        setContent(prev => prev ? ({ 
          ...prev, 
          imageUrls,
          selectedImageUrl: imageUrls[0],
          post: {
            ...prev.post,
            content: {
              ...prev.post.content,
              imagePrompt: prev.post.type === 'image' ? promptToUse : prev.post.content.imagePrompt,
              coverImagePrompt: prev.post.type === 'carousel' ? promptToUse : prev.post.content.coverImagePrompt,
            }
          } as GeneratedPost
        }) : null);
    } catch (e) {
        handleApiError(e, 'revisar imagem');
    } finally {
        setIsRevisingImage(false);
    }
  }, [content]);

  const handleProofread = useCallback(async (textToProofread: string) => {
    if (!content) return;
    
    setIsProofreading(true);
    setError(null);

    try {
      const proofreadCaption = await proofreadText(textToProofread);
      
      setContent(prevContent => {
        if (!prevContent) return null;
        return { 
          ...prevContent,
          post: {
              ...prevContent.post,
              content: {
                  ...prevContent.post.content,
                  caption: proofreadCaption
              }
          } as GeneratedPost
        };
      });
    } catch (e) {
      handleApiError(e, 'revisar texto');
    } finally {
      setIsProofreading(false);
    }
  }, [content]);

  const handleSelectImage = useCallback((imageUrl: string) => {
    setContent(prevContent => {
      if (!prevContent) return null;
      return { ...prevContent, selectedImageUrl: imageUrl };
    });
  }, []);

  const handleContentUpdate = useCallback((newContent: GeneratedContent) => {
    setContent(newContent);
  }, []);


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md h-fit dark:bg-gray-800">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Gerar Novo Post</h2>
        <IdeaForm 
          onGenerateImagePost={handleGenerateImagePost}
          onGenerateWrittenPost={handleGenerateWrittenPost}
          onGenerateCarouselPost={handleGenerateCarouselPost}
          isLoading={isLoading}
          initialIdea={initialIdea}
        />
      </div>
      <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md min-h-[600px] dark:bg-gray-800">
        {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative mb-4 shadow-lg" role="alert">
                <strong className="font-bold">Ocorreu um erro! </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )}
        <ContentDisplay 
            content={content}
            onContentUpdate={handleContentUpdate}
            isLoading={isLoading}
            onProofread={handleProofread}
            isProofreading={isProofreading}
            onReviseImage={handleReviseImage}
            isRevisingImage={isRevisingImage}
            onSelectImage={handleSelectImage}
            connections={connections}
            onSchedulePost={onSchedulePost}
            onPublishPost={onPublishPost}
            onSaveDraft={onSaveDraft}
        />
      </div>
    </div>
  );
});
