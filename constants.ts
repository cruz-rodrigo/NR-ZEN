import { Domain } from './types';

// CONFIGURAÇÃO GERAL
export const DOMAIN_URL = "nrzen.com.br";
export const APP_URL = "app.nrzen.com.br";

// LOGO CONFIG:
// Se você tiver uma imagem (PNG/SVG) no futuro, coloque o caminho ou URL aqui.
// Exemplo: export const LOGO_IMAGE_URL = "/assets/logo.png";
// Deixe como "" (string vazia) para usar o logo em Texto (Tipográfico).
export const LOGO_IMAGE_URL = ""; 

// Palette - NR ZEN Premium Blue
// Uma paleta corporativa, tecnológica e serena.

export const COLORS = {
  primary: '#0F172A', // Slate 900 (Authority, Dark Blue-Grey)
  primaryLight: '#334155', // Slate 700
  brand: '#2563EB', // Royal Blue (Action)
  brandLight: '#3B82F6', // Blue 500
  accent: '#0EA5E9', // Sky Blue (Zen/Flow)
  
  // Risk Colors (Refined)
  green: '#10B981', // Emerald
  yellow: '#F59E0B', // Amber
  red: '#EF4444', // Red
  
  // UI
  textMain: '#0F172A', // Slate 900
  textSec: '#64748B', // Slate 500
  border: '#E2E8F0', // Slate 200
  bgApp: '#F8FAFC', // Slate 50 (Ultra light)
  bgCard: '#FFFFFF',
};

// Questionnaire Data
export const QUESTIONNAIRE_DATA: Domain[] = [
  {
    id: 1,
    title: "Demandas e ritmo de trabalho",
    questions: [
      { id: "D1_Q1", text: "Sinto que o volume de trabalho é adequado para a minha jornada.", type: "positive" },
      { id: "D1_Q2", text: "Tenho prazos tão apertados que preciso correr o tempo todo para cumpri-los.", type: "negative" },
      { id: "D1_Q3", text: "Consigo fazer pausas suficientes ao longo do trabalho.", type: "positive" },
      { id: "D1_Q4", text: "Com frequência levo preocupações do trabalho para casa por excesso de demanda.", type: "negative" },
      { id: "D1_Q5", text: "As mudanças de prioridade acontecem de forma planejada e comunicada.", type: "positive" }
    ]
  },
  {
    id: 2,
    title: "Autonomia e controle",
    questions: [
      { id: "D2_Q1", text: "Tenho liberdade para decidir como organizar minhas tarefas.", type: "positive" },
      { id: "D2_Q2", text: "Eu me sinto microgerenciado(a) na maior parte do tempo.", type: "negative" },
      { id: "D2_Q3", text: "Posso opinar sobre a forma como o trabalho é feito no meu setor.", type: "positive" },
      { id: "D2_Q4", text: "Mudanças importantes no trabalho acontecem sem que eu seja consultado(a).", type: "negative" },
      { id: "D2_Q5", text: "Tenho clareza sobre quais resultados são esperados de mim.", type: "positive" }
    ]
  },
  {
    id: 3,
    title: "Apoio da liderança e da organização",
    questions: [
      { id: "D3_Q1", text: "Minha liderança direta está disponível para apoiar quando surgem dificuldades.", type: "positive" },
      { id: "D3_Q2", text: "Quando há problemas, a culpa é rapidamente colocada nas pessoas, não nos processos.", type: "negative" },
      { id: "D3_Q3", text: "Recebo orientações claras quando algo precisa ser ajustado no meu trabalho.", type: "positive" },
      { id: "D3_Q4", text: "Sinto que posso falar abertamente sobre problemas de trabalho sem medo de represálias.", type: "positive" },
      { id: "D3_Q5", text: "Quando peço ajuda, costumo receber respostas do tipo ‘se vira’.", type: "negative" }
    ]
  },
  {
    id: 4,
    title: "Relações e clima social",
    questions: [
      { id: "D4_Q1", text: "O clima entre colegas é respeitoso na maior parte do tempo.", type: "positive" },
      { id: "D4_Q2", text: "Já presenciei ou sofri situações de desrespeito ou humilhação no trabalho.", type: "negative" },
      { id: "D4_Q3", text: "Conflitos entre pessoas são tratados de forma construtiva.", type: "positive" },
      { id: "D4_Q4", text: "Costumo evitar falar com algumas pessoas por medo de como vão reagir.", type: "negative" },
      { id: "D4_Q5", text: "Sinto que faço parte de uma equipe, não apenas de um grupo de pessoas.", type: "positive" }
    ]
  },
  {
    id: 5,
    title: "Reconhecimento e justiça",
    questions: [
      { id: "D5_Q1", text: "Sinto que meu esforço é reconhecido de alguma forma.", type: "positive" },
      { id: "D5_Q2", text: "Percebo diferenças injustas de tratamento entre pessoas ou áreas.", type: "negative" },
      { id: "D5_Q3", text: "As decisões importantes (promoções, mudanças de função) parecem justas e transparentes.", type: "positive" },
      { id: "D5_Q4", text: "Recebo retorno (feedback) com frequência suficiente para me desenvolver.", type: "positive" },
      { id: "D5_Q5", text: "Às vezes sinto que ‘tanto faz’ o que eu faço, nada muda.", type: "negative" }
    ]
  },
  {
    id: 6,
    title: "Equilíbrio trabalho–vida pessoal",
    questions: [
      { id: "D6_Q1", text: "Em geral, consigo equilibrar as demandas de trabalho com minha vida pessoal.", type: "positive" },
      { id: "D6_Q2", text: "Costumo fazer horas extras frequentes sem planejamento.", type: "negative" },
      { id: "D6_Q3", text: "Tenho flexibilidade para lidar com imprevistos pessoais quando necessário.", type: "positive" },
      { id: "D6_Q4", text: "Fico pensando em problemas do trabalho mesmo fora do horário.", type: "negative" },
      { id: "D6_Q5", text: "Sinto que a organização se preocupa com o equilíbrio entre trabalho e vida pessoal.", type: "positive" }
    ]
  }
];