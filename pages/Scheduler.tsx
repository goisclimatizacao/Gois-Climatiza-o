import React, { useState } from 'react';
import type { ScheduledPost } from '../types';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, FacebookIcon, InstagramIcon, GoogleIcon } from '../components/icons';
import { PostDetailModal } from '../components/PostDetailModal';

const daysOfWeek = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const fullDaysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];


const PlatformIcon: React.FC<{platform: string}> = ({platform}) => {
    switch(platform) {
        case 'facebook': return <FacebookIcon className="w-3 h-3 text-blue-600" />;
        case 'instagram': return <InstagramIcon className="w-3 h-3 text-pink-600" />;
        case 'google': return <GoogleIcon className="w-3 h-3" />;
        default: return null;
    }
}

export const Scheduler: React.FC<{ scheduledPosts: ScheduledPost[] }> = ({ scheduledPosts }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    const endDate = new Date(endOfMonth);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const dates = [];
    let day = new Date(startDate);
    while (day <= endDate) {
        dates.push(new Date(day));
        day.setDate(day.getDate() + 1);
    }

    const postsByDate: { [key: string]: ScheduledPost[] } = {};
    scheduledPosts.forEach(post => {
        const postDate = new Date(post.scheduledDate).toDateString();
        if (!postsByDate[postDate]) {
            postsByDate[postDate] = [];
        }
        postsByDate[postDate].push(post);
    });

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    return (
        <div className="bg-white p-4 md:p-8 rounded-lg shadow-md h-full dark:bg-gray-800 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                <div className="flex items-center">
                     <CalendarIcon className="h-8 w-8 text-green-600 mr-3"/>
                     <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Agendamento de Posts</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Visualize e gerencie seu calendário de conteúdo.
                        </p>
                    </div>
                </div>
                <div className="flex items-center justify-between md:justify-center mt-4 md:mt-0">
                    <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <ChevronLeftIcon className="w-6 h-6 text-gray-500" />
                    </button>
                    <h2 className="text-lg font-semibold w-40 text-center capitalize">
                        {currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <ChevronRightIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 md:gap-2">
                {daysOfWeek.map((day, index) => (
                    <div key={day+index} className="text-center font-semibold text-xs md:text-sm text-gray-500 py-2">
                        <span className="hidden md:inline">{fullDaysOfWeek[index]}</span>
                        <span className="md:hidden">{day}</span>
                    </div>
                ))}
                {dates.map(date => {
                    const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                    const isToday = date.toDateString() === new Date().toDateString();
                    const posts = postsByDate[date.toDateString()] || [];

                    return (
                        <div 
                            key={date.toString()} 
                            className={`border border-gray-200 dark:border-gray-700 rounded-lg min-h-[100px] md:min-h-[120px] p-1 md:p-2 flex flex-col ${isCurrentMonth ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50'}`}
                        >
                            <time dateTime={date.toISOString().split('T')[0]} className={`text-xs font-semibold flex items-center justify-center w-6 h-6 rounded-full ${isToday ? 'bg-green-600 text-white' : isCurrentMonth ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400'}`}>
                                {date.getDate()}
                            </time>
                            <div className="mt-1 space-y-1 overflow-y-auto">
                                {posts.map(post => (
                                    <div 
                                        key={post.id} 
                                        onClick={() => setSelectedPost(post)}
                                        className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800/50 p-1 rounded-md cursor-pointer hover:shadow-md hover:border-green-400 transition-all duration-200"
                                    >
                                        <div className="flex items-center space-x-1 md:space-x-2">
                                            <img src={post.content.selectedImageUrl} alt="Post image" className="w-6 h-6 md:w-8 md:h-8 rounded object-cover flex-shrink-0" />
                                            <div className="flex-1 overflow-hidden">
                                                <p className="hidden md:block text-xs text-gray-700 dark:text-gray-300 font-medium line-clamp-2">{post.content.post.content.caption}</p>
                                                <div className="flex items-center space-x-1.5 mt-1">
                                                    {post.platforms.map(p => <PlatformIcon key={p} platform={p} />)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {selectedPost && (
                <PostDetailModal
                    isOpen={!!selectedPost}
                    onClose={() => setSelectedPost(null)}
                    post={selectedPost}
                />
            )}
        </div>
    );
};
