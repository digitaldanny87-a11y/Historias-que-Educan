export enum ActivityType {
  STORY = 'STORY',
  QUIZ = 'QUIZ',
  DRAWING = 'DRAWING',
  VOCABULARY = 'VOCABULARY',
  MATH = 'MATH'
}

export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface BookPage {
  type: ActivityType;
  title: string;
  content: string; // Used for story text, math problems, or instructions
  options?: QuizOption[]; // Only for QUIZ
  hint?: string; // Optional hint
  colorTheme?: string; // Hex code or tailwind class suggestion
}

export interface GeneratedBook {
  title: string;
  description: string;
  pages: BookPage[];
}

export interface UserPreferences {
  childName: string;
  age: number;
  topics: string[];
  difficulty: 'Fácil' | 'Medio' | 'Difícil';
}

export const AVAILABLE_TOPICS = [
  "Animales",
  "Espacio",
  "Dinosaurios",
  "Matemáticas",
  "Ciencia",
  "Superhéroes",
  "Naturaleza",
  "Música",
  "Historia",
  "Fantasía"
];