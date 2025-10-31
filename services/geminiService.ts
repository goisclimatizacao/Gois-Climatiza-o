import { GoogleGenAI, Type } from "@google/genai";
import { systemInstruction } from '../prompt-engineering/systemContext';
import type { AspectRatio, GeneratedPost } from "../types";

interface ImagePostContent {
  imagePrompt: string;
  caption: string;
}

interface CarouselPostContent {
    coverImagePrompt: string;
    slides: { title: string; body: string; }[],
    caption: string;
}

interface GeneratedImage {
    base64: string;
    mimeType: string;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const imagePostSchema = {
    type: Type.OBJECT,
    properties: {
        imagePrompt: {
            type: Type.STRING,
            description: "Um prompt detalhado em inglês para gerar uma imagem ultrarrealista. A cena DEVE ser do cotidiano brasileiro, com pessoas e ambientes autênticos de Presidente Prudente, SP. A composição fotográfica deve seguir a regra dos terços. A iluminação deve ser natural e suave. **IMPORTANTE**: Inclua sistemas de ar condicionado modernos e discretos, como modelos Split Hi-Wall, Cassete ou Piso-Teto. Evite aparelhos de janela antigos. A composição deve deixar a área do canto inferior direito visualmente limpa e sem elementos importantes, pois um logo será aplicado sobre a imagem nessa área. **EVITE a todo custo:** estéticas de banco de imagens, pessoas posando para a câmera, ambientes genéricos e iluminação artificial óbvia. Foco na emoção e autenticidade da cena. Ex: 'Candid photo following the rule of thirds, a young Brazilian family relaxes in their modern, sunlit living room in Presidente Prudente, a discreet mini-split air conditioner on the wall. The mood is peaceful. The bottom-right corner is clear. Shot on a 50mm lens, soft natural light, high detail, photorealistic.'",
        },
        caption: {
            type: Type.STRING,
            description: "A legenda para o post, em português. Deve ser concisa (2-3 frases curtas) e usar uma abordagem emocional e indireta, focando nos benefícios (conforto, saúde, bem-estar) e não no serviço em si. Crie uma conexão com o leitor. **OBRIGATÓRIO** finalizar com um CTA claro que inclua o telefone para contato (ex: 'Fale conosco pelo (18) 98103-2773') e hashtags relevantes.",
        },
    },
    required: ['imagePrompt', 'caption'],
};

const writtenImagePostSchema = {
    type: Type.OBJECT,
    properties: {
        titleForImage: { type: Type.STRING, description: "Um título curto e impactante (máximo 5 palavras) para ser inserido na imagem." },
        bodyForImage: { type: Type.STRING, description: "Um texto de apoio curto (máximo 15 palavras) para ser inserido na imagem, abaixo do título." },
        caption: { type: Type.STRING, description: "A legenda para o post do Instagram, que será exibida abaixo da imagem. Deve seguir todas as regras de tom de voz, CTA com telefone e hashtags." },
    },
    required: ['titleForImage', 'bodyForImage', 'caption'],
};

const captionOnlySchema = {
    type: Type.OBJECT,
    properties: {
        caption: {
            type: Type.STRING,
            description: "A legenda para o post, em português, baseada na imagem fornecida. Deve ser concisa (2-3 frases curtas) e usar uma abordagem emocional e indireta, focando nos benefícios (conforto, saúde, bem-estar) que a imagem transmite. Crie uma conexão com o leitor. **OBRIGATÓRIO** finalizar com um CTA claro que inclua o telefone para contato (ex: 'Fale conosco pelo (18) 98103-2773') e hashtags relevantes.",
        },
    },
    required: ['caption'],
};

const carouselPostSchema = {
    type: Type.OBJECT,
    properties: {
        coverImagePrompt: {
            type: Type.STRING,
            description: "Prompt em inglês para a IMAGEM DE CAPA do carrossel. Deve ser visualmente impactante e seguir todas as diretrizes de realismo e autenticidade."
        },
        slides: {
            type: Type.ARRAY,
            description: "Uma lista de 2 a 4 slides para o carrossel. Cada slide deve ser curto, direto e informativo.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "Título curto e chamativo para o slide (máx 5 palavras)." },
                    body: { type: Type.STRING, description: "Texto de apoio para o slide (máx 20 palavras ou 3 tópicos curtos)." },
                },
                required: ["title", "body"]
            }
        },
        caption: {
            type: Type.STRING,
            description: "A legenda final para o post de carrossel, incluindo CTA com telefone e hashtags."
        }
    },
    required: ["coverImagePrompt", "slides", "caption"]
};

const testimonialAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        tags: {
            type: Type.ARRAY,
            description: "Uma lista de 2 a 4 palavras-chave ou frases curtas que resumem os pontos positivos do depoimento.",
            items: { type: Type.STRING }
        }
    },
    required: ["tags"]
};

const proactiveSuggestionSchema = {
    type: Type.OBJECT,
    properties: {
        suggestion: {
            type: Type.STRING,
            description: "Uma ideia de post curta, criativa e estratégica, pronta para ser usada no gerador de conteúdo."
        }
    },
    required: ["suggestion"]
};


const callGemini = async (prompt: string, schema: object): Promise<any> => {
    const model = 'gemini-2.5-flash';
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: schema,
        }
    });
    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
}

export const generatePostContent = async (idea: string): Promise<GeneratedPost> => {
    const post = await callGemini(`Com base na seguinte ideia, gere o conteúdo para um post com imagem e legenda: "${idea}"`, imagePostSchema) as ImagePostContent;
    return { type: 'image', content: post };
};

export const generateWrittenImageContent = async (idea: string): Promise<GeneratedPost> => {
    const textContent = await callGemini(`Gere o texto para uma imagem de post escrito com base na seguinte ideia: "${idea}"`, writtenImagePostSchema) as { titleForImage: string; bodyForImage: string; caption: string; };

    const { titleForImage, bodyForImage, caption } = textContent;

    const imagePrompt = `A ultra-realistic, professional social media graphic that looks like it was made by a senior designer for 'GOÍS Climatização'.
- Aesthetics: Minimalist, clean, modern, and trustworthy, with plenty of negative space.
- Background: A subtle background using the brand's dark blue (#002060) or a clean, light gray.
- Layout: Apply the rule of thirds. The main text should not be dead center.
- Typography: Use the 'Montserrat' and 'Lato' fonts. The text must be sharp and highly readable.
- Title Text: Prominently display the text "${titleForImage}" in 'Montserrat Bold'.
- Body Text: Below the title, in a smaller size, display the text "${bodyForImage}" in 'Lato Regular'.
- Color Palette: Text and graphic elements MUST strictly use the brand's primary colors: white text on the dark blue background, or dark blue (#002060) text on a light background. Use green (#94c11f) for small, subtle accents only.
- Branding: **CRITICAL**: The official company logo will be programmatically added to the bottom-right corner later. Ensure this area remains completely clean and visually uncluttered. Do not generate any text or logos yourself.
- Final Output: Photorealistic graphic render, 8k, highest detail, sharp focus on text.`;

    return { type: 'image', content: { imagePrompt, caption } };
}

export const generateCarouselContent = async (idea: string): Promise<GeneratedPost> => {
    const post = await callGemini(`Gere o conteúdo para um post em formato carrossel (capa, 2-4 slides, e legenda final) com base na ideia: "${idea}"`, carouselPostSchema) as CarouselPostContent;
    return { type: 'carousel', content: post };
};

export const generateCaptionForImage = async (base64Image: string, mimeType: string): Promise<{ caption: string }> => {
    const model = 'gemini-2.5-flash';

    const imagePart = { inlineData: { mimeType, data: base64Image } };
    const textPart = { text: 'Analise esta imagem de um serviço ou ambiente climatizado e crie uma legenda para um post no Instagram, seguindo as diretrizes do sistema.' };

    const response = await ai.models.generateContent({
        model: model,
        contents: { parts: [imagePart, textPart] },
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: captionOnlySchema,
        }
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as { caption: string };
};

export const generateImage = async (prompt: string, aspectRatio: AspectRatio): Promise<GeneratedImage[]> => {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 2,
          outputMimeType: 'image/jpeg',
          aspectRatio: aspectRatio,
        },
    });

    return response.generatedImages.map(img => ({
        base64: img.image.imageBytes,
        mimeType: 'image/jpeg'
    }));
};

export const proofreadText = async (text: string): Promise<string> => {
    const model = 'gemini-2.5-flash';
    const response = await ai.models.generateContent({
        model: model,
        contents: `Revise e melhore o seguinte texto para um post de Instagram, mantendo o tom de voz da GOÍS Climatização. Seja conciso e impactante. Mantenha o CTA e as hashtags no final. Texto original: "${text}"`,
        config: { systemInstruction },
    });
    return response.text;
};

export const analyzeTestimonial = async (text: string): Promise<string[]> => {
    const result = await callGemini(`Analise o seguinte depoimento e extraia os principais pontos positivos em formato de tags: "${text}"`, testimonialAnalysisSchema) as { tags: string[] };
    return result.tags;
}

export const getProactiveSuggestion = async (recentPillars: string[]): Promise<string> => {
    const prompt = `Com base nos pilares de conteúdo recentes (${recentPillars.join(', ')}), sugira uma nova ideia de post criativa e estratégica que ainda não foi abordada ou que mereça destaque agora.`;
    const result = await callGemini(prompt, proactiveSuggestionSchema) as { suggestion: string };
    return result.suggestion;
}
