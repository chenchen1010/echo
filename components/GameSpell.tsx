import React, { useState, useEffect, useCallback } from 'react';
import { WordItem } from '../types';
import { VOCABULARY_LIST } from '../constants';
import { speakWord, preloadWord } from '../services/geminiService';
import { ArrowLeft, Star, Shuffle, Lightbulb } from 'lucide-react';

interface GameSpellProps {
  onBack: () => void;
}

const GameSpell: React.FC<GameSpellProps> = ({ onBack }) => {
  const [currentWord, setCurrentWord] = useState<WordItem | null>(null);
  const [scrambledLetters, setScrambledLetters] = useState<{char: string, id: string}[]>([]);
  const [placedLetters, setPlacedLetters] = useState<{char: string, id: string}[]>([]);
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const generateRound = useCallback(() => {
    setIsCorrect(false);
    setShowHint(false);
    setPlacedLetters([]);
    
    const target = VOCABULARY_LIST[Math.floor(Math.random() * VOCABULARY_LIST.length)];
    setCurrentWord(target);

    // Preload success audio
    preloadWord(`Correct! ${target.word}`);

    // Create scrambled letters with unique IDs to handle duplicate chars (e.g., 'book')
    const letters = target.word.split('').map((char, index) => ({
      char,
      id: `${char}-${index}-${Math.random()}`
    }));

    // Fisher-Yates shuffle
    for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
    }

    setScrambledLetters(letters);
  }, []);

  useEffect(() => {
    generateRound();
  }, [generateRound]);

  useEffect(() => {
      // Check win condition
      if (currentWord && placedLetters.length === currentWord.word.length) {
          const attempt = placedLetters.map(l => l.char).join('');
          if (attempt.toLowerCase() === currentWord.word.toLowerCase()) {
              setIsCorrect(true);
              setScore(s => s + 10);
              speakWord(`Correct! ${currentWord.word}`);
              setTimeout(generateRound, 2000);
          } else {
              // Wrong attempt - visual feedback could be added here
              speakWord("Try again");
              // Auto reset after delay if wrong
              setTimeout(() => {
                 setPlacedLetters([]);
                 // Reset scrambled letters to initial shuffled state? 
                 // Actually easier to just put them back in the pool.
                 const letters = currentWord.word.split('').map((char, index) => ({
                    char,
                    id: `${char}-${index}-${Math.random()}`
                 }));
                 // Shuffle again
                 for (let i = letters.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [letters[i], letters[j]] = [letters[j], letters[i]];
                 }
                 setScrambledLetters(letters);
              }, 1000);
          }
      }
  }, [placedLetters, currentWord, generateRound]);

  const handleLetterClick = (letterObj: {char: string, id: string}) => {
      if (isCorrect) return;
      
      // Move from scrambled to placed
      setScrambledLetters(prev => prev.filter(l => l.id !== letterObj.id));
      setPlacedLetters(prev => [...prev, letterObj]);
      // Pronunciation removed per request
  };

  const handlePlacedClick = (letterObj: {char: string, id: string}) => {
      if (isCorrect) return;

      // Move back to scrambled
      setPlacedLetters(prev => prev.filter(l => l.id !== letterObj.id));
      setScrambledLetters(prev => [...prev, letterObj]);
  };

  const toggleHint = () => {
    setShowHint(!showHint);
    if (!showHint) speakWord("Here is a hint.");
  }

  if (!currentWord) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4 bg-sky-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition">
          <ArrowLeft className="text-gray-600" />
        </button>
        <div className="flex items-center gap-2 bg-white px-6 py-2 rounded-full shadow-inner border-2 border-accent">
          <Star className="text-accent fill-accent" />
          <span className="text-2xl font-bold text-gray-700">{score}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center max-w-2xl mx-auto w-full">
        
        {/* Image Card */}
        <div 
            onClick={() => speakWord(currentWord.word)}
            className="bg-white p-8 rounded-3xl shadow-xl border-4 border-white mb-8 transform transition hover:scale-105 duration-300 cursor-pointer"
        >
            <div className="text-9xl mb-2 text-center">{currentWord.emoji}</div>
             {showHint && (
                 <div className="text-center mt-2">
                     <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-lg font-mono text-lg tracking-widest">
                        {currentWord.syllables.join(' • ')}
                     </span>
                 </div>
             )}
        </div>

        {/* Drop Zone */}
        <div className="flex gap-2 mb-12 min-h-[80px] flex-wrap justify-center p-4 bg-white/50 rounded-2xl w-full">
            {placedLetters.map((l) => (
                <button
                    key={l.id}
                    onClick={() => handlePlacedClick(l)}
                    className="w-14 h-14 md:w-16 md:h-16 bg-primary text-white text-3xl font-bold rounded-xl shadow-lg border-b-4 border-red-700 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center animate-pop"
                >
                    {l.char}
                </button>
            ))}
             {/* Placeholders for remaining letters */}
             {Array.from({ length: Math.max(0, currentWord.word.length - placedLetters.length) }).map((_, i) => (
                 <div key={i} className="w-14 h-14 md:w-16 md:h-16 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50"></div>
             ))}
        </div>

        {/* Letter Bank */}
        <div className="flex gap-3 flex-wrap justify-center">
            {scrambledLetters.map((l) => (
                <button
                    key={l.id}
                    onClick={() => handleLetterClick(l)}
                    className="w-14 h-14 md:w-16 md:h-16 bg-white text-gray-700 text-3xl font-bold rounded-xl shadow-md border-b-4 border-gray-200 hover:bg-gray-50 hover:border-secondary hover:text-secondary active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center"
                >
                    {l.char}
                </button>
            ))}
        </div>

        {/* Hint Button */}
        <div className="mt-auto mb-8">
            <button 
                onClick={toggleHint}
                className="flex items-center gap-2 text-gray-500 hover:text-accent transition-colors text-sm font-bold uppercase tracking-wide"
            >
                <Lightbulb size={20} />
                {showHint ? "Hide Hint" : "Need a Hint?"}
            </button>
        </div>

      </div>
    </div>
  );
};

export default GameSpell;