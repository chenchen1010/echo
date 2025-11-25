import React, { useState, useEffect, useCallback } from 'react';
import { WordItem } from '../types';
import { VOCABULARY_LIST } from '../constants';
import { speakWord, getEncouragement, preloadWord } from '../services/geminiService';
import { Volume2, ArrowLeft, RefreshCw, Star } from 'lucide-react';

interface GameListenProps {
  onBack: () => void;
}

const GameListen: React.FC<GameListenProps> = ({ onBack }) => {
  const [currentWord, setCurrentWord] = useState<WordItem | null>(null);
  const [options, setOptions] = useState<WordItem[]>([]);
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [encouragement, setEncouragement] = useState("");

  const generateRound = useCallback(() => {
    setIsCorrect(null);
    setEncouragement("");
    
    // Pick a random target
    const target = VOCABULARY_LIST[Math.floor(Math.random() * VOCABULARY_LIST.length)];
    setCurrentWord(target);

    // Preload the success message audio so it plays instantly when they win
    preloadWord("Correct! " + target.word);

    // Pick 3 distractors unique from target
    const distractors: WordItem[] = [];
    while (distractors.length < 3) {
      const d = VOCABULARY_LIST[Math.floor(Math.random() * VOCABULARY_LIST.length)];
      if (d.id !== target.id && !distractors.find(x => x.id === d.id)) {
        distractors.push(d);
      }
    }

    // Shuffle options
    setOptions([target, ...distractors].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    generateRound();
  }, [generateRound]);

  // Auto-play sound when new word loads (with slight delay for UX)
  useEffect(() => {
    if (currentWord && !isCorrect) {
       const timer = setTimeout(() => {
         handlePlaySound();
       }, 500);
       return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWord, isCorrect]);

  const handlePlaySound = async () => {
    if (!currentWord || loading) return;
    setLoading(true);
    await speakWord(currentWord.word);
    setLoading(false);
  };

  const handleOptionClick = async (selected: WordItem) => {
    if (isCorrect !== null || !currentWord) return;

    if (selected.id === currentWord.id) {
      setIsCorrect(true);
      setScore(s => s + 10);
      const msg = await getEncouragement();
      setEncouragement(msg);
      
      // Play sound again for reinforcement - should be cached now due to preload
      await speakWord("Correct! " + currentWord.word);

      setTimeout(() => {
        generateRound();
      }, 2500);
    } else {
      // Wrong answer logic
      const btn = document.getElementById(`btn-${selected.id}`);
      if(btn) {
          btn.classList.add('animate-shake');
          setTimeout(() => btn.classList.remove('animate-shake'), 500);
      }
      speakWord("Try again");
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button onClick={onBack} className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition">
          <ArrowLeft className="text-gray-600" />
        </button>
        <div className="flex items-center gap-2 bg-white px-6 py-2 rounded-full shadow-inner border-2 border-accent">
          <Star className="text-accent fill-accent" />
          <span className="text-2xl font-bold text-gray-700">{score}</span>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-700">Listen & Find</h2>
          <button 
            onClick={handlePlaySound}
            disabled={loading}
            className={`
              relative group bg-primary text-white p-8 rounded-full shadow-lg 
              transform transition-all hover:scale-110 active:scale-95
              ${loading ? 'opacity-70 cursor-wait' : ''}
            `}
          >
            {loading ? <RefreshCw className="animate-spin" size={48} /> : <Volume2 size={48} />}
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm text-gray-400 w-full whitespace-nowrap">
                Click to listen again
            </span>
          </button>
        </div>

        {isCorrect && (
            <div className="animate-bounce text-4xl font-bold text-green-500 drop-shadow-md">
                {encouragement || "Correct!"}
            </div>
        )}

        <div className="grid grid-cols-2 gap-6 w-full max-w-2xl mt-8">
          {options.map((opt) => (
            <button
              id={`btn-${opt.id}`}
              key={opt.id}
              onClick={() => handleOptionClick(opt)}
              disabled={isCorrect !== null}
              className={`
                h-40 rounded-3xl text-7xl flex items-center justify-center shadow-md border-b-8 transition-all duration-200 transform
                ${isCorrect && opt.id === currentWord?.id 
                    ? 'bg-green-100 border-green-400 scale-105 ring-4 ring-green-300' 
                    : 'bg-white border-gray-200 hover:border-secondary hover:bg-gray-50 active:border-b-0 active:translate-y-2'
                }
              `}
            >
              {opt.emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameListen;