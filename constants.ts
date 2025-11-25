import { WordItem, Category } from './types';

export const VOCABULARY_LIST: WordItem[] = [
  // Stationery
  { id: '1', word: 'pencil', category: Category.STATIONERY, emoji: '✏️', syllables: ['pen', 'cil'], phonetic: "['pensl]" },
  { id: '2', word: 'pen', category: Category.STATIONERY, emoji: '🖊️', syllables: ['pen'], phonetic: "[pen]" },
  { id: '3', word: 'rubber', category: Category.STATIONERY, emoji: '🧽', syllables: ['rub', 'ber'], phonetic: "['rʌbə]" },
  { id: '4', word: 'ruler', category: Category.STATIONERY, emoji: '📏', syllables: ['ru', 'ler'], phonetic: "['ru:lə]" },
  { id: '5', word: 'book', category: Category.STATIONERY, emoji: '📖', syllables: ['book'], phonetic: "[buk]" },
  { id: '6', word: 'bag', category: Category.STATIONERY, emoji: '🎒', syllables: ['bag'], phonetic: "[bæg]" },
  { id: '7', word: 'pencil case', category: Category.STATIONERY, emoji: '👝', syllables: ['pen', 'cil', 'case'], phonetic: "['pensl keis]" },
  { id: '8', word: 'crayon', category: Category.STATIONERY, emoji: '🖍️', syllables: ['cray', 'on'], phonetic: "['kreiən]" },
  { id: '9', word: 'paper', category: Category.STATIONERY, emoji: '📄', syllables: ['pa', 'per'], phonetic: "['peipə]" },

  // Furniture
  { id: '10', word: 'desk', category: Category.FURNITURE, emoji: '🏫', syllables: ['desk'], phonetic: "[desk]" }, // Using school emoji as proxy for desk context if specific unavailable
  { id: '11', word: 'chair', category: Category.FURNITURE, emoji: '🪑', syllables: ['chair'], phonetic: "[tʃeə]" },
  { id: '12', word: 'board', category: Category.FURNITURE, emoji: '📋', syllables: ['board'], phonetic: "[bɔ:d]" }, // Clipboard/Whiteboard
  { id: '13', word: 'cupboard', category: Category.FURNITURE, emoji: '🚪', syllables: ['cup', 'board'], phonetic: "['kʌbəd]" },
  { id: '14', word: 'bookcase', category: Category.FURNITURE, emoji: '📚', syllables: ['book', 'case'], phonetic: "['bukkeis]" },

  // School Structure
  { id: '15', word: 'school', category: Category.STRUCTURE, emoji: '🏫', syllables: ['school'], phonetic: "[sku:l]" },
  { id: '16', word: 'classroom', category: Category.STRUCTURE, emoji: '🧑‍🏫', syllables: ['class', 'room'], phonetic: "['klɑ:srum]" },
  { id: '17', word: 'door', category: Category.STRUCTURE, emoji: '🚪', syllables: ['door'], phonetic: "[dɔ:]" },
  { id: '18', word: 'window', category: Category.STRUCTURE, emoji: '🪟', syllables: ['win', 'dow'], phonetic: "['windəu]" },
  { id: '19', word: 'wall', category: Category.STRUCTURE, emoji: '🧱', syllables: ['wall'], phonetic: "[wɔ:l]" },
  { id: '20', word: 'playground', category: Category.STRUCTURE, emoji: '🛝', syllables: ['play', 'ground'], phonetic: "['pleigraund]" },

  // People
  { id: '21', word: 'teacher', category: Category.PEOPLE, emoji: '👩‍🏫', syllables: ['teach', 'er'], phonetic: "['ti:tʃə]" },
];

export const SUCCESS_MESSAGES = [
  "Awesome Job!",
  "Super Star!",
  "You're Amazing!",
  "Fantastic!",
  "Keep it up!",
  "Brilliant!"
];