export interface ContentPillar {
    name: string;
    description: string;
}

export const contentPillars: ContentPillar[] = [
    {
        name: 'Conforto e Bem-Estar',
        description: 'Posts que associam a climatização a momentos de relaxamento, conforto em casa e bem-estar da família.'
    },
    {
        name: 'Saúde e Qualidade do Ar',
        description: 'Conteúdo educativo sobre a importância de um ar-condicionado limpo para a saúde respiratória, combate a alergias, etc.'
    },
    {
        name: 'Economia e Eficiência',
        description: 'Dicas sobre como usar o ar condicionado de forma eficiente para economizar energia, e os benefícios de modelos mais novos.'
    },
    {
        name: 'Serviços e Profissionalismo',
        description: 'Posts que destacam a qualidade dos serviços da GOÍS, como PMOC, manutenção preventiva e a expertise da equipe.'
    },
    {
        name: 'Institucional e Prova Social',
        description: 'Mostra os bastidores da empresa, depoimentos de clientes satisfeitos e fortalece a marca na comunidade.'
    },
];


// --- Commemorative Dates ---
interface CommemorativeDate {
  name: string;
  month: number; // 1-12
  day: number;
}

const commemorativeDates: CommemorativeDate[] = [
    { name: "Dia Mundial da Saúde", month: 4, day: 7 },
    { name: "Dia do Trabalho", month: 5, day: 1 },
    { name: "Dia das Mães", month: 5, day: 12 }, // Note: This is an example, the actual day varies.
    { name: "Dia dos Namorados", month: 6, day: 12 },
    { name: "Início do Inverno", month: 6, day: 21 },
    { name: "Dia do Amigo", month: 7, day: 20 },
    { name: "Dia dos Pais", month: 8, day: 11 }, // Note: This is an example, the actual day varies.
    { name: "Dia do Cliente", month: 9, day: 15 },
    { name: "Início da Primavera", month: 9, day: 23 },
    { name: "Dia das Crianças", month: 10, day: 12 },
    { name: "Black Friday", month: 11, day: 29 }, // Note: Varies.
    { name: "Início do Verão", month: 12, day: 21 },
    { name: "Véspera de Natal", month: 12, day: 24 },
    { name: "Natal", month: 12, day: 25 },
    { name: "Véspera de Ano Novo", month: 12, day: 31 },
    { name: "Ano Novo", month: 1, day: 1 },
    { name: "Dia do Consumidor", month: 3, day: 15 },
    { name: "Dia da Mulher", month: 3, day: 8 },
    { name: "Início do Outono", month: 3, day: 20 },
    { name: "Dia dos Avós", month: 7, day: 26 },
    { name: "Dia do Arquiteto", month: 12, day: 15 },
    { name: "Dia do Engenheiro", month: 12, day: 11 },
];

export const sortedCommemorativeDates = commemorativeDates
  .sort((a, b) => {
    if (a.month !== b.month) {
      return a.month - b.month;
    }
    return a.day - b.day;
  })
  .map(date => ({
      name: date.name,
      dayMonth: `${String(date.day).padStart(2, '0')}/${String(date.month).padStart(2, '0')}`
  }));