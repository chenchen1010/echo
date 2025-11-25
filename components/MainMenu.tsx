import React from 'react';
import { GameMode } from '../types';
import { Ear, Pencil, BookOpen, GraduationCap } from 'lucide-react';

interface MainMenuProps {
  onSelectMode: (mode: GameMode) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onSelectMode }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-8 animate-pop">
      <div className="text-center space-y-2">
        <h1 className="text-5xl md:text-7xl font-bold text-primary drop-shadow-lg tracking-wider">
          Word Explorer
        </h1>
        <p className="text-xl text-gray-600 font-medium">Ready to learn school words?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <button
          onClick={() => onSelectMode(GameMode.STUDY)}
          className="group relative bg-white border-4 border-secondary rounded-3xl p-8 hover:bg-secondary transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl shadow-lg flex flex-col items-center gap-4"
        >
          <div className="bg-secondary/20 p-6 rounded-full group-hover:bg-white/30 transition-colors">
            <BookOpen size={48} className="text-secondary group-hover:text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-700 group-hover:text-white">Learn & Study</h2>
          <p className="text-gray-500 group-hover:text-white/90">Look at the pictures</p>
        </button>

        <button
          onClick={() => onSelectMode(GameMode.LISTEN)}
          className="group relative bg-white border-4 border-primary rounded-3xl p-8 hover:bg-primary transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl shadow-lg flex flex-col items-center gap-4"
        >
          <div className="bg-primary/20 p-6 rounded-full group-hover:bg-white/30 transition-colors">
            <Ear size={48} className="text-primary group-hover:text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-700 group-hover:text-white">Sound Detective</h2>
          <p className="text-gray-500 group-hover:text-white/90">Listen and find the picture</p>
        </button>

        <button
          onClick={() => onSelectMode(GameMode.SPELL)}
          className="group relative bg-white border-4 border-accent rounded-3xl p-8 hover:bg-accent transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl shadow-lg flex flex-col items-center gap-4 col-span-1 md:col-span-2"
        >
          <div className="bg-accent/20 p-6 rounded-full group-hover:bg-white/30 transition-colors">
            <Pencil size={48} className="text-orange-500 group-hover:text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-700 group-hover:text-white">Spelling Hero</h2>
          <p className="text-gray-500 group-hover:text-white/90">Unscramble the letters</p>
        </button>
      </div>

      <div className="absolute bottom-4 text-center text-gray-400 text-sm">
        <p>Use chrome for best audio experience</p>
      </div>
    </div>
  );
};

export default MainMenu;