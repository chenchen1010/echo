import React, { useState } from 'react';
import { GameMode } from './types';
import MainMenu from './components/MainMenu';
import GameListen from './components/GameListen';
import GameSpell from './components/GameSpell';
import StudyMode from './components/StudyMode';

const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<GameMode>(GameMode.MENU);

  const renderView = () => {
    switch (currentMode) {
      case GameMode.LISTEN:
        return <GameListen onBack={() => setCurrentMode(GameMode.MENU)} />;
      case GameMode.SPELL:
        return <GameSpell onBack={() => setCurrentMode(GameMode.MENU)} />;
      case GameMode.STUDY:
        return <StudyMode onBack={() => setCurrentMode(GameMode.MENU)} />;
      case GameMode.MENU:
      default:
        return <MainMenu onSelectMode={setCurrentMode} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-800 font-sans overflow-hidden">
      {renderView()}
    </div>
  );
};

export default App;