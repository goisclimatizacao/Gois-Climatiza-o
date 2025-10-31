import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { ContentGenerator } from './pages/ContentGenerator';
import { ContentLibrary } from './pages/ContentLibrary';
import { Scheduler } from './pages/Scheduler';
import { PaidTraffic } from './pages/PaidTraffic';
import { Connections } from './pages/Connections';
import { LoginPage } from './pages/LoginPage';
import { RealtimeDashboard } from './pages/RealtimeDashboard';
import { Testimonials } from './pages/Testimonials';
import { Team } from './pages/Team';
import { Settings } from './pages/Settings';
import { TemplateLibrary } from './pages/TemplateLibrary';
import type { LibraryImage, User, ConnectionId, ScheduledPost, GeneratedContent, Draft, PublishedPost, TeamMember, CompanySettings, PaidCampaign, PostTemplate } from './types';

// Mock data for scheduled posts - used as a fallback if localStorage is empty
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

const defaultCompanySettings: CompanySettings = {
  companyName: 'GOÍS Climatização',
  slogan: 'Especialista em Ar Condicionado',
  location: 'Presidente Prudente, São Paulo (SP)',
  services: 'PMOC (Plano de Manutenção, Operação e Controle), Manutenção Preventiva e Corretiva, Instalação de Sistemas (SPLIT, K7, PISO TETO, etc.), Projetos de Climatização.',
  voiceTone: 'Leve, emocional, humano e indireto, focado em conforto, bem-estar e saúde.',
  cta: 'Fale com nosso especialista pelo (18) 98103-2773',
  hashtags: '#GoisClimatizacao #ArCondicionado #PresidentePrudente #QualidadeDoAr #Conforto #BemEstar'
};

const defaultTeamMembers: TeamMember[] = [
    { id: 'user_admin', email: 'admin@gois.com', role: 'admin', name: 'Admin GOÍS' },
    { id: 'user_mkt', email: 'marketing@gois.com', role: 'marketing', name: 'Equipe Marketing' }
];

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Content flow states
  const [imageFromLibrary, setImageFromLibrary] = useState<LibraryImage | null>(null);
  const [ideaFromTestimonial, setIdeaFromTestimonial] = useState<string | null>(null);
  const [ideaFromHome, setIdeaFromHome] = useState<string | null>(null);
  const [contentToLoad, setContentToLoad] = useState<GeneratedContent | null>(null);
  const [templateToUse, setTemplateToUse] = useState<PostTemplate | null>(null);

  const [connections, setConnections] = useState<Record<ConnectionId, boolean>>({
    facebook: true,
    instagram: true,
    google: false,
  });

  // App data states with localStorage persistence
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') || 'light');
  
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(() => {
    try {
      const saved = localStorage.getItem('scheduledPosts');
      return saved ? JSON.parse(saved) : getMockScheduledPosts();
    } catch {
      return getMockScheduledPosts();
    }
  });

  const [drafts, setDrafts] = useState<Draft[]>(() => {
    try {
      const saved = localStorage.getItem('drafts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [publishedPosts, setPublishedPosts] = useState<PublishedPost[]>(() => {
    try {
      const saved = localStorage.getItem('publishedPosts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [companySettings, setCompanySettings] = useState<CompanySettings>(() => {
    try {
        const saved = localStorage.getItem('companySettings');
        return saved ? JSON.parse(saved) : defaultCompanySettings;
    } catch {
        return defaultCompanySettings;
    }
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    try {
        const saved = localStorage.getItem('teamMembers');
        return saved ? JSON.parse(saved) : defaultTeamMembers;
    } catch {
        return defaultTeamMembers;
    }
  });

  const [paidCampaigns, setPaidCampaigns] = useState<PaidCampaign[]>(() => {
     try {
        const saved = localStorage.getItem('paidCampaigns');
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
  });
  
  // Effect to sync state with localStorage
  useEffect(() => { localStorage.setItem('scheduledPosts', JSON.stringify(scheduledPosts)); }, [scheduledPosts]);
  useEffect(() => { localStorage.setItem('drafts', JSON.stringify(drafts)); }, [drafts]);
  useEffect(() => { localStorage.setItem('publishedPosts', JSON.stringify(publishedPosts)); }, [publishedPosts]);
  useEffect(() => { localStorage.setItem('companySettings', JSON.stringify(companySettings)); }, [companySettings]);
  useEffect(() => { localStorage.setItem('teamMembers', JSON.stringify(teamMembers)); }, [teamMembers]);
  useEffect(() => { localStorage.setItem('paidCampaigns', JSON.stringify(paidCampaigns)); }, [paidCampaigns]);


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

  const handleCreatePostFromHome = (suggestion: string) => {
    setIdeaFromHome(suggestion);
    setActiveView('generator');
  };
  const clearIdeaFromHome = () => { setIdeaFromHome(null); };
  
  const handleToggleConnection = (id: ConnectionId) => {
    setConnections(prev => ({ ...prev, [id]: !prev[id] }));
  };
  
  const handleUseTemplate = (template: PostTemplate) => {
    setTemplateToUse(template);
    setActiveView('generator');
  };
  const clearTemplateToUse = () => { setTemplateToUse(null); };

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
  
  const handleSetActiveView = (view: string) => {
    setActiveView(view);
    setIsSidebarOpen(false); // Close sidebar on navigation
  };

  // New handler functions for functional pages
  const handleUpdateSettings = (newSettings: CompanySettings) => {
    setCompanySettings(newSettings);
  };

  const handleAddTeamMember = (memberData: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = {
        ...memberData,
        id: `user_${new Date().getTime()}`,
    };
    setTeamMembers(prev => [...prev, newMember]);
  };

  const handleRemoveTeamMember = (memberId: string) => {
    // Prevent deleting the last admin
    const admins = teamMembers.filter(m => m.role === 'admin');
    const memberToRemove = teamMembers.find(m => m.id === memberId);
    if (memberToRemove?.role === 'admin' && admins.length <= 1) {
        alert("Não é possível remover o último administrador.");
        return;
    }
    setTeamMembers(prev => prev.filter(member => member.id !== memberId));
  };

  const handleCreateCampaign = (campaignData: Omit<PaidCampaign, 'id' | 'mockMetrics' | 'status'>) => {
    const newCampaign: PaidCampaign = {
        ...campaignData,
        id: `camp_${new Date().getTime()}`,
        status: 'active',
        mockMetrics: {
            reach: Math.floor(Math.random() * (campaignData.budget * 150 - campaignData.budget * 50 + 1) + campaignData.budget * 50),
            clicks: Math.floor(Math.random() * (campaignData.budget * 5 - campaignData.budget * 1 + 1) + campaignData.budget * 1),
        }
    };
    setPaidCampaigns(prev => [newCampaign, ...prev]);
  };


  const renderView = () => {
    switch (activeView) {
      case 'home':
        return <HomePage setActiveView={handleSetActiveView} userName={user?.name || ''} onCreatePostFromSuggestion={handleCreatePostFromHome} companySettings={companySettings} />;
      case 'generator':
        return <ContentGenerator 
                  imageFromLibrary={imageFromLibrary} 
                  clearImageFromLibrary={clearImageFromLibrary}
                  ideaFromTestimonial={ideaFromTestimonial}
                  clearIdeaFromTestimonial={clearIdeaFromTestimonial}
                  ideaFromHome={ideaFromHome}
                  clearIdeaFromHome={clearIdeaFromHome}
                  templateToUse={templateToUse}
                  clearTemplateToUse={clearTemplateToUse}
                  contentToLoad={contentToLoad}
                  clearContentToLoad={clearContentToLoad}
                  connections={connections}
                  onSchedulePost={handleSchedulePost}
                  onPublishPost={handlePublishPost}
                  onSaveDraft={handleSaveDraft}
                  companySettings={companySettings}
                />;
      case 'templates':
        return <TemplateLibrary onUseTemplate={handleUseTemplate} />;
      case 'library':
        return <ContentLibrary 
                  onSelectImage={handleSelectImageFromLibrary}
                  drafts={drafts}
                  publishedPosts={publishedPosts}
                  onLoadDraft={handleLoadDraft}
                />;
      case 'testimonials':
        return <Testimonials onCreatePost={handleCreatePostFromTestimonial} companySettings={companySettings} />;
      case 'scheduler':
        return <Scheduler scheduledPosts={scheduledPosts} />;
      case 'realtime-dashboard':
        return <RealtimeDashboard />;
      case 'team':
        return <Team teamMembers={teamMembers} onAddMember={handleAddTeamMember} onRemoveMember={handleRemoveTeamMember} />;
      case 'settings':
        return <Settings settings={companySettings} onUpdateSettings={handleUpdateSettings} />;
      case 'paid-traffic':
        if (user?.role !== 'admin') return <HomePage setActiveView={handleSetActiveView} userName={user?.name || ''} onCreatePostFromSuggestion={handleCreatePostFromHome} companySettings={companySettings} />;
        return <PaidTraffic paidCampaigns={paidCampaigns} publishedPosts={publishedPosts} onCreateCampaign={handleCreateCampaign} />;
      case 'connections':
        if (user?.role !== 'admin') return <HomePage setActiveView={handleSetActiveView} userName={user?.name || ''} onCreatePostFromSuggestion={handleCreatePostFromHome} companySettings={companySettings}/>;
        return <Connections connections={connections} onToggleConnection={handleToggleConnection} />;
      default:
        return <HomePage setActiveView={handleSetActiveView} userName={user?.name || ''} onCreatePostFromSuggestion={handleCreatePostFromHome} companySettings={companySettings} />;
    }
  };

  if (!user) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-200">
      <Sidebar
        activeView={activeView} 
        setActiveView={handleSetActiveView}
        onLogout={handleLogout}
        userRole={user.role}
        userName={user.name}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          activeView={activeView}
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 md:p-8">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;