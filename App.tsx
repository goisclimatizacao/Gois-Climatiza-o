import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { HomePage } from './pages/HomePage';
import { ContentGenerator } from './pages/ContentGenerator';
import { ContentLibrary } from './pages/ContentLibrary';
import { Scheduler } from './pages/Scheduler';
import { PaidTraffic } from './pages/PaidTraffic';
import { Connections } from './pages/Connections';
import { LoginPage } from './pages/LoginPage';
import { RealtimeDashboard } from './pages/RealtimeDashboard';
import { Testimonials } from './pages/Testimonials';
import type { LibraryImage, User, ConnectionId, ScheduledPost, GeneratedContent, Draft, PublishedPost } from './types';

// Mock data for scheduled posts
const getMockScheduledPosts = (): ScheduledPost[] => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const createDate = (day: number, hour: number, minute: number) => 
    new Date(currentYear, currentMonth, day, hour, minute).toISOString();

  const mockContentBase = {
    imageUrls: ['https://storage.googleapis.com/aistudio-marketplace/gallery/5551c51a-f7e9-4a7b-a45e-578d10b42f63.jpeg'],
    selectedImageUrl: 'https://storage.googleapis.com/aistudio-marketplace/gallery/5551c51a-f7e9-4a7b-a45e-578d10b42f63.jpeg',
    aspectRatio: '1:1' as const,
  };

  return [
    {
      id: 'post1',
      scheduledDate: createDate(10, 9, 0),
      platforms: ['instagram', 'facebook'],
      content: {
        ...mockContentBase,
        id: 'content1',
        post: { type: 'image', content: { imagePrompt: 'mock', caption: 'Comece a semana com o pé direito e o ar condicionado na temperatura certa! 쾌적함은 생산성을 높입니다.' } },
      }
    },
    {
      id: 'post2',
      scheduledDate: createDate(15, 18, 30),
      platforms: ['instagram'],
      content: {
        ...mockContentBase,
        id: 'content2',
        imageUrls: ['https://storage.googleapis.com/aistudio-marketplace/gallery/a4cd0788-b235-420a-810a-2b733075c742.jpeg'],
        selectedImageUrl: 'https://storage.googleapis.com/aistudio-marketplace/gallery/a4cd0788-b235-420a-810a-2b733075c742.jpeg',
        post: { type: 'image', content: { imagePrompt: 'mock', caption: 'Final de tarde perfeito é com a brisa suave do seu ar condicionado GOÍS. #ConfortoEmCasa' } },
      }
    },
     {
      id: 'post3',
      scheduledDate: createDate(15, 10, 0),
      platforms: ['facebook'],
      content: {
        ...mockContentBase,
        id: 'content3',
        imageUrls: ['https://storage.googleapis.com/aistudio-marketplace/gallery/36cc96a2-e64e-4f33-87f5-a337a86f91d8.jpeg'],
        selectedImageUrl: 'https://storage.googleapis.com/aistudio-marketplace/gallery/36cc96a2-e64e-4f33-87f5-a337a86f91d8.jpeg',
        aspectRatio: '4:3',
        post: { type: 'image', content: { imagePrompt: 'mock', caption: 'Manutenção em dia é sinônimo de ar puro e economia na conta de luz. Já agendou a sua?' } },
      }
    }
  ];
};


function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState('home');
  const [imageFromLibrary, setImageFromLibrary] = useState<LibraryImage | null>(null);
  const [ideaFromTestimonial, setIdeaFromTestimonial] = useState<string | null>(null);
  const [contentToLoad, setContentToLoad] = useState<GeneratedContent | null>(null);

  const [connections, setConnections] = useState<Record<ConnectionId, boolean>>({
    facebook: true,
    instagram: true,
    google: false,
  });

  // New states for advanced features
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') || 'light');
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(getMockScheduledPosts());
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [publishedPosts, setPublishedPosts] = useState<PublishedPost[]>([]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setActiveView('home');
  };

  const handleLogout = () => { setUser(null); };
  const handleThemeToggle = () => { setTheme(prev => prev === 'light' ? 'dark' : 'light'); };

  const handleSelectImageFromLibrary = (image: LibraryImage) => {
    setImageFromLibrary(image);
    setActiveView('generator');
  };
  
  const clearImageFromLibrary = () => { setImageFromLibrary(null); };

  const handleCreatePostFromTestimonial = (testimonialText: string) => {
    setIdeaFromTestimonial(testimonialText);
    setActiveView('generator');
  };
  
  const clearIdeaFromTestimonial = () => { setIdeaFromTestimonial(null); };
  
  const handleToggleConnection = (id: ConnectionId) => {
    setConnections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSchedulePost = (content: GeneratedContent, scheduledDate: string, platforms: ConnectionId[]) => {
    const newPost: ScheduledPost = {
        id: `post_${new Date().getTime()}`,
        content,
        scheduledDate,
        platforms,
    };
    setScheduledPosts(prev => [...prev, newPost].sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()));
    setActiveView('scheduler');
  };
  
  const handlePublishPost = (content: GeneratedContent, platforms: ConnectionId[]) => {
    const newPost: PublishedPost = {
      id: `pub_${new Date().getTime()}`,
      content,
      publishedDate: new Date().toISOString(),
      platforms,
    };
    setPublishedPosts(prev => [newPost, ...prev]);
    setActiveView('library');
  };

  const handleSaveDraft = (content: GeneratedContent) => {
    setDrafts(prev => {
        const existingIndex = prev.findIndex(d => d.id === content.id);
        if (existingIndex > -1) {
            const newDrafts = [...prev];
            newDrafts[existingIndex] = content;
            return newDrafts;
        }
        return [...prev, content];
    });
    setActiveView('library');
  };

  const handleLoadDraft = (draft: Draft) => {
    setContentToLoad(draft);
    setActiveView('generator');
  };

  const clearContentToLoad = () => {
    setContentToLoad(null);
  };


  const renderView = () => {
    switch (activeView) {
      case 'home':
        return <HomePage setActiveView={setActiveView} userName={user?.name || ''} />;
      case 'generator':
        return <ContentGenerator 
                  imageFromLibrary={imageFromLibrary} 
                  clearImageFromLibrary={clearImageFromLibrary}
                  ideaFromTestimonial={ideaFromTestimonial}
                  clearIdeaFromTestimonial={clearIdeaFromTestimonial}
                  contentToLoad={contentToLoad}
                  clearContentToLoad={clearContentToLoad}
                  connections={connections}
                  onSchedulePost={handleSchedulePost}
                  onPublishPost={handlePublishPost}
                  onSaveDraft={handleSaveDraft}
                />;
      case 'library':
        return <ContentLibrary 
                  onSelectImage={handleSelectImageFromLibrary}
                  drafts={drafts}
                  publishedPosts={publishedPosts}
                  onLoadDraft={handleLoadDraft}
                />;
      case 'testimonials':
        return <Testimonials onCreatePost={handleCreatePostFromTestimonial} />;
      case 'scheduler':
        return <Scheduler scheduledPosts={scheduledPosts} />;
      case 'realtime-dashboard':
        return <RealtimeDashboard />;
      case 'paid-traffic':
        if (user?.role !== 'admin') return <HomePage setActiveView={setActiveView} userName={user?.name || ''} />;
        return <PaidTraffic />;
      case 'connections':
        if (user?.role !== 'admin') return <HomePage setActiveView={setActiveView} userName={user?.name || ''} />;
        return <Connections connections={connections} onToggleConnection={handleToggleConnection} />;
      default:
        return <HomePage setActiveView={setActiveView} userName={user?.name || ''} />;
    }
  };

  if (!user) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-200">
      <Sidebar
        activeView={activeView} 
        setActiveView={setActiveView}
        onLogout={handleLogout}
        userRole={user.role}
        userName={user.name}
        theme={theme}
        onThemeToggle={handleThemeToggle}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-4 md:p-8">
          {renderView()}
        </div>
      </main>
    </div>
  );
}

export default App;
