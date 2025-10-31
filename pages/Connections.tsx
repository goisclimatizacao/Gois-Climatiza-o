import React, { useState } from 'react';
import { FacebookIcon, InstagramIcon, CheckCircleIcon, GoogleIcon } from '../components/icons';

type ConnectionId = 'facebook' | 'instagram' | 'google';

type Connection = {
    id: ConnectionId;
    name: string;
    description: string;
    icon: React.ReactElement;
};

const availableConnections: Connection[] = [
    { id: 'facebook', name: 'Facebook', description: 'Conecte sua página para agendar posts e impulsionar publicações.', icon: <FacebookIcon className="h-8 w-8 text-blue-600" /> },
    { id: 'instagram', name: 'Instagram', description: 'Conecte seu perfil comercial para agendar posts, stories e analisar métricas.', icon: <InstagramIcon className="h-8 w-8 text-pink-600" /> },
    { id: 'google', name: 'Google', description: 'Conecte para postar no seu Perfil da Empresa (Google Business).', icon: <GoogleIcon className="h-8 w-8" /> }
];

interface ConnectionsProps {
  connections: Record<ConnectionId, boolean>;
  onToggleConnection: (id: ConnectionId) => void;
}

export const Connections: React.FC<ConnectionsProps> = ({ connections, onToggleConnection }) => {
    const [connectingId, setConnectingId] = useState<ConnectionId | null>(null);

    const handleToggle = (id: ConnectionId) => {
        if (connections[id]) {
            // Disconnecting is instant
            onToggleConnection(id);
        } else {
            // Simulate connection delay for better UX
            setConnectingId(id);
            setTimeout(() => {
                onToggleConnection(id);
                setConnectingId(null);
            }, 2000);
        }
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md h-full dark:bg-gray-800">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Conectar Redes Sociais</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Gerencie as contas que você deseja integrar com o AI Content Studio.
                </p>
            </div>

            <div className="space-y-4">
                {availableConnections.map((connection) => {
                    const isConnected = connections[connection.id];
                    const isLoading = connectingId === connection.id;
                    return (
                        <div key={connection.id} className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-between transition-all duration-200">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 mr-4">{connection.icon}</div>
                                <div>
                                    <h3 className="font-bold text-gray-800 dark:text-gray-200">{connection.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{connection.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                {isConnected && !isLoading && (
                                    <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-semibold">
                                        <CheckCircleIcon className="w-5 h-5 mr-1.5"/>
                                        Conectado
                                    </div>
                                )}
                                <button
                                    onClick={() => handleToggle(connection.id)}
                                    disabled={isLoading}
                                    className={`w-32 text-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-70 disabled:cursor-wait ${
                                        isConnected
                                            ? 'bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500 dark:bg-red-900/50 dark:text-red-400 dark:hover:bg-red-900'
                                            : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
                                    }`}
                                >
                                    {isLoading ? 'Conectando...' : isConnected ? 'Desconectar' : 'Conectar'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <p>
                    <strong>Segurança em primeiro lugar:</strong> A conexão é feita de forma segura através da autorização oficial de cada plataforma. Nunca pediremos sua senha.
                </p>
            </div>
        </div>
    );
};
