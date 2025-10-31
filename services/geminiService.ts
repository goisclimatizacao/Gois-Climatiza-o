import { GoogleGenAI, Type } from "@google/genai";
import { generateSystemInstruction } from '../prompt-engineering/systemContext';
import type { CompanySettings, AspectRatio, GeneratedPost, CarouselSlide } from '../types';

// FIX: Initialize the Gemini API client.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

// --- Helper function for JSON parsing ---
const parseJsonFromMarkdown = <T>(text: string): T => {
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonMatch) {
        // Fallback for when the model doesn't use markdown or returns raw JSON
        try {
            return JSON.parse(text);
        } catch (e) {
             throw new Error("Invalid JSON response from model.");
        }
    }
    try {
      return JSON.parse(jsonMatch[1]);
    } catch(e) {
      throw new Error("Failed to parse JSON from markdown block.");
    }
}

// --- Image Generation ---
export const generateImage = async (prompt: string, aspectRatio: AspectRatio): Promise<{ base64: string, mimeType: string }[]> => {
    try {
        // FIX: Use ai.models.generateImages API for image generation.
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt,
            config: {
                numberOfImages: 4,
                outputMimeType: 'image/jpeg',
                aspectRatio,
            },
        });
        
        return response.generatedImages.map(img => ({
            base64: img.image.imageBytes,
            mimeType: 'image/jpeg'
        }));

    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Failed to generate image with Gemini API.");
    }
};

// --- Text Generation & Manipulation ---

export const generatePostContent = async (idea: string, settings: CompanySettings): Promise<GeneratedPost> => {
    const systemInstruction = generateSystemInstruction(settings);
    // FIX: Use gemini-2.5-pro for complex text tasks.
    const model = "gemini-2.5-pro";

    try {
        // FIX: Use ai.models.generateContent with JSON schema for structured output.
        const response = await ai.models.generateContent({
            model,
            contents: `Baseado na ideia "${idea}", crie um post para a ${settings.companyName}. Gere um prompt de imagem realista e uma legenda para o post, seguindo todas as diretrizes de tom de voz, estilo visual e regras de conteúdo.`,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        imagePrompt: {
                            type: Type.STRING,
                            description: "Um prompt detalhado para gerar uma imagem realista e bem iluminada que represente a ideia do post, seguindo as diretrizes visuais."
                        },
                        caption: {
                            type: Type.STRING,
                            description: "Uma legenda curta, impactante e emocional para o post, incluindo o CTA e as hashtags da empresa."
                        }
                    },
                    required: ["imagePrompt", "caption"]
                }
            }
        });

        // FIX: Extract text from response and parse JSON.
        const jsonResponse = parseJsonFromMarkdown<{ imagePrompt: string; caption: string; }>(response.text);
        return { type: 'image', content: jsonResponse };

    } catch (error) {
        console.error("Error in generatePostContent:", error);
        throw new Error("Failed to generate post content with Gemini API.");
    }
};

export const generateWrittenImageContent = async (idea: string, settings: CompanySettings): Promise<GeneratedPost> => {
    const systemInstruction = generateSystemInstruction(settings);
    const model = "gemini-2.5-pro";

    try {
        const response = await ai.models.generateContent({
            model,
            contents: `Crie um post com foco em texto na imagem, baseado na ideia: "${idea}". Gere um prompt para uma imagem de fundo sutil e limpa. Depois, crie uma legenda para o post, que é o texto principal que aparecerá sobre a imagem.`,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        imagePrompt: {
                            type: Type.STRING,
                            description: "Um prompt para uma imagem de fundo (background) que seja sutil, limpa e relacionada ao tema, ideal para sobrepor texto."
                        },
                        caption: {
                            type: Type.STRING,
                            description: "O texto principal do post. Deve ser curto, direto e impactante, como se fosse ser escrito sobre a imagem. Inclua CTA e hashtags."
                        }
                    },
                    required: ["imagePrompt", "caption"]
                }
            }
        });

        const jsonResponse = parseJsonFromMarkdown<{ imagePrompt: string; caption: string; }>(response.text);
        return { type: 'image', content: jsonResponse };

    } catch (error) {
        console.error("Error in generateWrittenImageContent:", error);
        throw new Error("Failed to generate written post content with Gemini API.");
    }
};

export const generateCarouselContent = async (idea: string, settings: CompanySettings): Promise<GeneratedPost> => {
    const systemInstruction = generateSystemInstruction(settings);
    const model = "gemini-2.5-pro";
  
    try {
      const response = await ai.models.generateContent({
        model,
        contents: `Crie um post em formato de carrossel com 3 a 5 slides sobre a ideia: "${idea}". Gere um prompt para a imagem de capa. Para cada slide, crie um título curto e um corpo de texto conciso. Finalize com uma legenda geral para o post, incluindo CTA e hashtags.`,
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    coverImagePrompt: {
                        type: Type.STRING,
                        description: "Um prompt detalhado para a imagem de capa do carrossel."
                    },
                    slides: {
                        type: Type.ARRAY,
                        description: "Uma lista de 3 a 5 slides para o carrossel.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING, description: "Título curto e chamativo para o slide." },
                                body: { type: Type.STRING, description: "Texto conciso para o corpo do slide." },
                            },
                             required: ["title", "body"]
                        }
                    },
                    caption: {
                        type: Type.STRING,
                        description: "A legenda final para o post do carrossel, incluindo CTA e hashtags."
                    }
                },
                 required: ["coverImagePrompt", "slides", "caption"]
            }
        }
      });
  
      const jsonResponse = parseJsonFromMarkdown<{ coverImagePrompt: string; slides: CarouselSlide[]; caption: string }>(response.text);
      return { type: 'carousel', content: jsonResponse };
  
    } catch (error) {
      console.error("Error in generateCarouselContent:", error);
      throw new Error("Failed to generate carousel content with Gemini API.");
    }
};


export const generateCaptionForImage = async (base64Image: string, mimeType: string, settings: CompanySettings): Promise<{ caption: string }> => {
    const systemInstruction = generateSystemInstruction(settings);
    // FIX: Use gemini-2.5-pro for multi-modal tasks.
    const model = "gemini-2.5-pro";
    
    try {
        const imagePart = {
            inlineData: {
                mimeType,
                data: base64Image,
            },
        };
        const textPart = {
            text: "Analise esta imagem e crie uma legenda criativa e relevante para ela, seguindo o tom de voz e as diretrizes da empresa. A legenda deve ser curta, emocional, incluir o CTA e as hashtags."
        };

        const response = await ai.models.generateContent({
            model,
            contents: { parts: [imagePart, textPart] },
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        caption: {
                            type: Type.STRING,
                            description: "A legenda gerada para a imagem."
                        }
                    },
                    required: ["caption"]
                }
            },
        });

        return parseJsonFromMarkdown<{ caption: string }>(response.text);
        
    } catch (error) {
        console.error("Error generating caption for image:", error);
        throw new Error("Failed to generate caption with Gemini API.");
    }
};


export const proofreadText = async (text: string, settings: CompanySettings): Promise<string> => {
    const systemInstruction = generateSystemInstruction(settings);
    // FIX: Use gemini-2.5-flash for basic text tasks like proofreading.
    const model = "gemini-2.5-flash";

    try {
        const response = await ai.models.generateContent({
            model,
            contents: `Revise e melhore o seguinte texto para um post, mantendo o tom de voz da ${settings.companyName}. Corrija a gramática, melhore a clareza e o impacto, mas mantenha a mensagem original. O texto é: "${text}"`,
            config: {
                systemInstruction,
                temperature: 0.3,
            }
        });
        // FIX: Extract text directly from response object.
        return response.text.trim();
    } catch (error) {
        console.error("Error proofreading text:", error);
        throw new Error("Failed to proofread text with Gemini API.");
    }
};


export const getProactiveSuggestion = async (recentPillars: string[], settings: CompanySettings): Promise<string> => {
    const systemInstruction = generateSystemInstruction(settings);
    const model = "gemini-2.5-flash";

    try {
        const response = await ai.models.generateContent({
            model,
            contents: `Considerando que os últimos posts da ${settings.companyName} foram sobre os temas [${recentPillars.join(', ')}], sugira uma ideia criativa e relevante para o próximo post. A sugestão deve ser uma frase curta e direta, que possa ser usada como ponto de partida para a criação de conteúdo. Evite os temas já abordados recentemente.`,
            config: {
                systemInstruction,
                temperature: 0.9,
            }
        });

        return response.text.trim().replace(/"/g, ''); // Remove quotes
    } catch (error) {
        console.error("Error getting proactive suggestion:", error);
        throw new Error("Failed to get suggestion with Gemini API.");
    }
};

export const analyzeTestimonial = async (testimonial: string, settings: CompanySettings): Promise<string[]> => {
    const systemInstruction = generateSystemInstruction(settings);
    const model = "gemini-2.5-flash";

    try {
        const response = await ai.models.generateContent({
            model,
            contents: `Analise o seguinte depoimento de cliente da ${settings.companyName}: "${testimonial}". Extraia de 2 a 4 tags ou palavras-chave que resumam os pontos positivos mencionados (ex: "atendimento rápido", "profissionalismo", "economia de energia", "qualidade do ar").`,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        tags: {
                            type: Type.ARRAY,
                            description: "Uma lista de 2 a 4 tags que resumem o depoimento.",
                            items: {
                                type: Type.STRING
                            }
                        }
                    },
                    required: ["tags"]
                }
            }
        });

        const jsonResponse = parseJsonFromMarkdown<{ tags: string[] }>(response.text);
        return jsonResponse.tags;
    } catch (error) {
        console.error("Error analyzing testimonial:", error);
        throw new Error("Failed to analyze testimonial with Gemini API.");
    }
};
