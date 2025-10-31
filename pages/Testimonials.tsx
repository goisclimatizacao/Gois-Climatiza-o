import React, { useState, useEffect } from 'react';
import { StarIcon, WandIcon, ChatAlt2Icon } from '../components/icons';
import { analyzeTestimonial } from '../services/geminiService';
import type { CompanySettings } from '../types';

interface Testimonial {
  id: number;
  name: string;
  rating: number;
  text: string;
  source: 'Google' | 'Instagram' | 'Facebook';
}

const mockTestimonials: Testimonial[] = [
    { id: 1, name: 'João C.', rating: 5, text: 'Serviço impecável! Foram rápidos, profissionais e resolveram meu problema com o ar condicionado do escritório. Recomendo demais!', source: 'Google' },
    { id: 2, name: 'Maria S.', rating: 5, text: 'Atendimento excelente desde o primeiro contato. A instalação do split na minha sala foi perfeita e o ambiente ficou muito mais agradável. A equipe é muito caprichosa.', source: 'Instagram' },
    { id: 3, name: 'Carlos P.', rating: 5, text: 'Fizeram toda a manutenção preventiva do sistema de climatização da minha empresa. Agora o ar está mais puro e a conta de energia diminuiu. Ótimo custo-benefício.', source: 'Google' },
    { id: 4, name: 'Ana L.', rating: 4, text: 'Técnicos muito educados e o serviço foi bem feito. Apenas demorou um pouco mais que o esperado, mas o resultado final compensou.', source: 'Facebook' },
];

interface TestimonialCardProps {
    testimonial: Testimonial;
    onCreatePost: (idea: string) => void;
    companySettings: CompanySettings;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial, onCreatePost, companySettings }) => {
    const [tags, setTags] = useState<string[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(true);

    useEffect(() => {
        const analyze = async () => {
            try {
                setIsAnalyzing(true);
                const resultTags = await analyzeTestimonial(testimonial.text, companySettings);
                setTags(resultTags);
            } catch (error) {
                console.error("Failed to analyze testimonial:", error);
            } finally {
                setIsAnalyzing(false);
            }
        };
        analyze();
    }, [testimonial.text, companySettings]);

    const handleCreatePost = () => {
        const idea = `Criar um post de agradecimento e prova social com base no seguinte depoimento de cliente: "${testimonial.text}" - ${testimonial.name}. O foco deve ser em como a GOÍS ajudou a resolver o problema e gerou satisfação, reforçando a confiança na marca.`;
        onCreatePost(idea);
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg p-5 flex flex-col justify-between shadow-sm transition-shadow hover:shadow-md">
            <div>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-gray-200">{testimonial.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Via {testimonial.source}</p>
                </div>
                <div className="flex items-center flex-shrink-0 ml-2">
                  {[...Array(testimonial.rating)].map((_, i) => <StarIcon key={`f-${i}`} className="w-4 h-4 text-yellow-400" />)}
                  {[...Array(5 - testimonial.rating)].map((_, i) => <StarIcon key={`e-${i}`} className="w-4 h-4 text-gray-300 dark:text-gray-500" />)}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">"{testimonial.text}"</p>
              
              <div className="mt-4 h-10">
                {isAnalyzing ? (
                    <p className="text-xs text-gray-400">Analisando pontos-chave...</p>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                            <span key={tag} className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">{tag}</span>
                        ))}
                    </div>
                )}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 text-right">
              <button onClick={handleCreatePost} className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                <WandIcon className="w-4 h-4 mr-2" />
                Criar Post com Depoimento
              </button>
            </div>
        </div>
    );
};

export const Testimonials: React.FC<{ 
    onCreatePost: (testimonialText: string) => void;
    companySettings: CompanySettings;
}> = ({ onCreatePost, companySettings }) => {
  return (
    <div className="animate-fade-in bg-white p-6 md:p-8 rounded-lg shadow-md h-full dark:bg-gray-800">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6 flex items-center">
        <ChatAlt2Icon className="w-8 h-8 text-green-600 mr-3"/>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Depoimentos de Clientes</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Transforme feedbacks positivos em posts que geram confiança e autoridade.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockTestimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} onCreatePost={onCreatePost} companySettings={companySettings} />
        ))}
      </div>
    </div>
  );
};