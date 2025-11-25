import React, { useState, useEffect } from 'react';
import { WordItem } from '../types';
import { VOCABULARY_LIST } from '../constants';
import { speakWord, preloadWord } from '../services/geminiService';
import { ArrowLeft, ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';

interface StudyModeProps {
  onBack: () => void;
}

const StudyMode: React.FC<StudyModeProps> = ({ onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const word = VOCABULARY_LIST[currentIndex];

  // Preload audio for current, previous, and next cards to ensure instant playback
  useEffect(() => {
      const prevIndex = (currentIndex - 1 + VOCABULARY_LIST.length) % VOCABULARY_LIST.length;
      const nextIndex = (currentIndex + 1) % VOCABULARY_LIST.length;

      // Preload current first for immediate responsiveness
      preloadWord(VOCABULARY_LIST[currentIndex].word);
      // Then neighbors
      preloadWord(VOCABULARY_LIST[nextIndex].word);
      preloadWord(VOCABULARY_LIST[prevIndex].word);
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % VOCABULARY_LIST.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + VOCABULARY_LIST.length) % VOCABULARY_LIST.length);
  };

  const playAudio = () => {
    speakWord(word.word);
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4 bg-emerald-50">
      <div className="flex justify-between items-center mb-8">
        <button onClick={onBack} className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition">
          <ArrowLeft className="text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-gray-600">Flashcards</h2>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full">
        
        <div className="relative w-full max-w-md aspect-[3/4] bg-white rounded-[40px] shadow-2xl border-8 border-white flex flex-col items-center justify-center p-8 space-y-6">
            {/* Category Label */}
            <div className="absolute top-6 px-4 py-1 bg-gray-100 rounded-full text-gray-500 text-sm font-bold uppercase tracking-wider">
                {word.category}
            </div>

            {/* Removed animation as requested */}
            <div className="text-[120px] filter drop-shadow-md cursor-pointer hover:scale-110 transition-transform" onClick={playAudio}>
                {word.emoji}
            </div>

            <div className="text-center space-y-2">
                <h1 className="text-6xl font-bold text-gray-800 tracking-tight">{word.word}</h1>
                <p className="text-2xl text-gray-500 font-mono bg-gray-50 px-4 py-2 rounded-xl inline-block shadow-inner border border-gray-100">
                    {word.phonetic}
                </p>
            </div>

            <button 
                onClick={playAudio}
                className="mt-4 p-4 bg-secondary text-white rounded-full shadow-lg hover:bg-teal-500 transition active:scale-95"
            >
                <Volume2 size={32} />
            </button>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-8 mt-10">
            <button onClick={handlePrev} className="p-4 bg-white rounded-full shadow-lg hover:bg-gray-50 active:scale-95 transition text-gray-700">
                <ChevronLeft size={32} />
            </button>
            <span className="text-xl font-bold text-gray-400">
                {currentIndex + 1} / {VOCABULARY_LIST.length}
            </span>
            <button onClick={handleNext} className="p-4 bg-white rounded-full shadow-lg hover:bg-gray-50 active:scale-95 transition text-gray-700">
                <ChevronRight size={32} />
            </button>
        </div>

      </div>
    </div>
  );
};

export default StudyMode;