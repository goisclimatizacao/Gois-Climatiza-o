import React, { useState } from 'react';
import { UsersIcon, TrashIcon, XIcon } from '../components/icons';
import type { TeamMember, UserRole } from '../types';

interface AddMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddMember: (member: Omit<TeamMember, 'id'>) => void;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose, onAddMember }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<UserRole>('marketing');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(name && email) {
            onAddMember({ name, email, role });
            onClose();
            setName('');
            setEmail('');
            setRole('marketing');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Adicionar Novo Membro</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><XIcon className="w-5 h-5"/></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome Completo</label>
                            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"/>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"/>
                        </div>
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Função</label>
                            <select id="role" value={role} onChange={e => setRole(e.target.value as UserRole)} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600">
                                <option value="marketing">Marketing</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 text-right rounded-b-lg">
                        <button type="submit" className="px-4 py-2 bg-[#002060] text-white text-sm font-medium rounded-md hover:bg-blue-900">Adicionar Membro</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

interface TeamProps {
    teamMembers: TeamMember[];
    onAddMember: (member: Omit<TeamMember, 'id'>) => void;
    onRemoveMember: (memberId: string) => void;
}

export const Team: React.FC<TeamProps> = ({ teamMembers, onAddMember, onRemoveMember }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRemove = (member: TeamMember) => {
        if(window.confirm(`Tem certeza que deseja remover ${member.name} da equipe?`)) {
            onRemoveMember(member.id);
        }
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-md h-full animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                <div className="flex items-center">
                    <UsersIcon className="h-8 w-8 text-purple-600 mr-3"/>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Gestão de Equipe</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                           Adicione, remova e gerencie os membros da sua equipe.
                        </p>
                    </div>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="mt-4 md:mt-0 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-sm hover:bg-green-700">
                    Adicionar Membro
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nome</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Função</th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Ações</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {teamMembers.map((member) => (
                            <tr key={member.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{member.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{member.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${member.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'}`}>
                                        {member.role === 'admin' ? 'Admin' : 'Marketing'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleRemove(member)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50">
                                        <TrashIcon className="w-5 h-5"/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AddMemberModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                onAddMember={onAddMember}
            />
        </div>
    );
};
