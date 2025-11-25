export enum Category {
  STATIONERY = 'Stationery',
  FURNITURE = 'Furniture',
  STRUCTURE = 'School & Structure',
  PEOPLE = 'People'
}

export interface WordItem {
  id: string;
  word: string;
  category: Category;
  emoji: string;
  syllables: string[]; // For hints like rub-ber
  phonetic: string;    // IPA, e.g., ['pensl]
}

export enum GameMode {
  MENU = 'MENU',
  LISTEN = 'LISTEN', // Listen and Find
  SPELL = 'SPELL',   // Jumbled Words / Spelling
  STUDY = 'STUDY'    // Flashcards
}

export interface GameState {
  currentMode: GameMode;
  score: number;
  currentQuestionIndex: number;
}