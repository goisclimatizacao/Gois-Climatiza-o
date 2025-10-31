import React from 'react';
import { InstagramIcon, FacebookIcon, GoogleIcon, UsersIcon, HeartIcon, ChatBubbleIcon, StarIcon, SignalIcon } from '../components/icons';

const MetricCard: React.FC<{ icon: React.ReactNode; label: string; value: string; color: string }> = ({ icon, label, value, color }) => (
    <div className="bg-white p-4 rounded-lg shadow flex items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const InstagramPanel: React.FC = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center pb-4 border-b border-gray-200 mb-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 mr-4">
                <InstagramIcon className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Instagram</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <MetricCard icon={<UsersIcon className="w-5 h-5 text-white"/>} label="Seguidores" value="1.234" color="bg-pink-500" />
            <MetricCard icon={<HeartIcon className="w-5 h-5 text-white"/>} label="Média de Likes" value="152" color="bg-red-500" />
            <MetricCard icon={<ChatBubbleIcon className="w-5 h-5 text-white"/>} label="Taxa de Engaj." value="3.4%" color="bg-blue-500" />
        </div>
        <h3 className="font-semibold text-gray-700 mb-2">Últimos Posts (Exemplo)</h3>
        <div className="grid grid-cols-3 gap-2">
            <div className="aspect-square bg-gray-200 rounded animate-pulse"></div>
            <div className="aspect-square bg-gray-200 rounded animate-pulse"></div>
            <div className="aspect-square bg-gray-200 rounded animate-pulse"></div>
        </div>
    </div>
);

const FacebookPanel: React.FC = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center pb-4 border-b border-gray-200 mb-4">
             <FacebookIcon className="h-10 w-10 text-blue-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-800">Facebook</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
            <MetricCard icon={<UsersIcon className="w-5 h-5 text-white"/>} label="Curtidas na Página" value="2.456" color="bg-blue-600" />
            <MetricCard icon={<SignalIcon className="w-5 h-5 text-white -rotate-90"/>} label="Alcance Médio" value="876" color="bg-indigo-500" />
        </div>
        <h3 className="font-semibold text-gray-700 mb-2">Últimos Posts (Exemplo)</h3>
        <div className="space-y-3">
             <div className="flex items-start space-x-3 bg-gray-50 p-2 rounded">
                <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0 animate-pulse"></div>
                <p className="text-sm text-gray-600">Nada se compara ao conforto de um ambiente climatizado no verão! ☀️ Agende sua manutenção preventiva...</p>
            </div>
             <div className="flex items-start space-x-3 bg-gray-50 p-2 rounded">
                <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0 animate-pulse"></div>
                <p className="text-sm text-gray-600">Nossa equipe a postos para garantir o seu bem-estar. Qualidade e confiança que você pode sentir.</p>
            </div>
        </div>
    </div>
);


const GooglePanel: React.FC = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center pb-4 border-b border-gray-200 mb-4">
            <GoogleIcon className="h-9 w-9 mr-3" />
            <h2 className="text-xl font-bold text-gray-800">Google Business</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
             <MetricCard 
                icon={<StarIcon className="w-5 h-5 text-white"/>} 
                label="Nota Média" 
                value="4.9" 
                color="bg-yellow-500" 
            />
            <MetricCard 
                icon={<ChatBubbleIcon className="w-5 h-5 text-white"/>} 
                label="Avaliações" 
                value="88" 
                color="bg-green-500" 
            />
        </div>
        <h3 className="font-semibold text-gray-700 mb-2">Últimas Avaliações (Exemplo)</h3>
        <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded">
                <div className="flex items-center mb-1">
                    {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-4 h-4 text-yellow-400" />)}
                </div>
                <p className="text-sm text-gray-600">"Serviço impecável! Foram rápidos, profissionais e resolveram meu problema. Recomendo demais!"</p>
                <p className="text-xs text-gray-400 text-right mt-1">- João C.</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
                <div className="flex items-center mb-1">
                     {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-4 h-4 text-yellow-400" />)}
                </div>
                <p className="text-sm text-gray-600">"Atendimento excelente desde o primeiro contato. A instalação foi perfeita."</p>
                <p className="text-xs text-gray-400 text-right mt-1">- Maria S.</p>
            </div>
        </div>
    </div>
);


export const RealtimeDashboard: React.FC = () => {
    return (
        <div className="animate-fade-in">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md mb-8">
                <div className="flex items-center">
                    <SignalIcon className="w-8 h-8 text-green-600 mr-3"/>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Painel em Tempo Real</h1>
                        <p className="mt-1 text-gray-600">
                            Acompanhe os dados das suas principais plataformas.
                        </p>
                    </div>
                </div>
                 <div className="mt-4 bg-blue-50 border-l-4 border-blue-400 text-blue-700 p-3 rounded-md text-sm">
                    <strong>Nota:</strong> Esta é uma visualização demonstrativa com dados fictícios. A integração com dados reais está em desenvolvimento.
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                <InstagramPanel />
                <FacebookPanel />
                <GooglePanel />
            </div>
        </div>
    );
};
