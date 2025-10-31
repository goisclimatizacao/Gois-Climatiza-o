import React from 'react';
import { ChartBarIcon } from '../components/icons';

export const PaidTraffic: React.FC = () => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-md h-full flex items-center justify-center">
            <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                    <ChartBarIcon className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Gestão de Tráfego Pago</h1>
                <p className="text-gray-600 max-w-md mx-auto">
                   Impulsione seus melhores posts. Esta área será dedicada à criação e ao gerenciamento de campanhas de anúncios para alcançar um público maior e mais qualificado.
                </p>
                 <span className="mt-4 inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                    Em Breve
                </span>
            </div>
        </div>
    );
};