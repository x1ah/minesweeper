import React from 'react';
import { DifficultyLevel, DIFFICULTIES, GameStatus } from '../types';
import { RefreshCw, Trophy, Flag } from 'lucide-react';

interface ControlsProps {
  difficulty: DifficultyLevel;
  setDifficulty: (diff: DifficultyLevel) => void;
  gameStatus: GameStatus;
  resetGame: () => void;
  remainingMines: number;
  toggleFlagMode: () => void;
  isFlagMode: boolean;
}

const Controls: React.FC<ControlsProps> = ({ 
  difficulty, 
  setDifficulty, 
  resetGame, 
  remainingMines,
  toggleFlagMode,
  isFlagMode
}) => {
  return (
    <div className="flex flex-col gap-2 sm:gap-4 w-full">
      {/* Top Bar: Difficulty & Title */}
      <div className="flex flex-col gap-2 sm:gap-4 bg-slate-800/50 p-3 sm:p-4 rounded-xl border border-slate-700 backdrop-blur-sm shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center justify-center lg:justify-start gap-2">
          <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
          扫雷 Pro
        </h1>
        
        <div className="grid grid-cols-3 gap-1 bg-slate-900/50 p-1 rounded-lg">
          {(Object.keys(DIFFICULTIES) as DifficultyLevel[]).filter(d => d !== DifficultyLevel.CUSTOM).map((level) => (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              className={`px-2 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 truncate ${
                difficulty === level 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Info Bar: Mine Counter, Reset */}
      <div className="flex justify-between items-center bg-slate-800/80 p-2 sm:p-3 rounded-lg border border-slate-700 shadow-sm">
        <div className="flex items-center gap-2 text-rose-400 font-mono text-lg sm:text-xl px-2">
          <Flag className="w-5 h-5 fill-rose-400/20" />
          <span>{remainingMines}</span>
        </div>

        <button 
          onClick={resetGame}
          className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors hover:rotate-180 duration-500 shadow-lg border border-slate-600"
          title="重置游戏"
        >
          <RefreshCw className="w-5 h-5" />
        </button>

         {/* Mobile Flag Toggle */}
        <button
          onClick={toggleFlagMode}
          className={`lg:hidden p-2 rounded-lg font-bold flex items-center gap-2 transition-colors ${
             isFlagMode ? 'bg-amber-500 text-white' : 'bg-slate-700 text-slate-400'
          }`}
          title="切换标记模式"
        >
          <Flag className={`w-5 h-5 ${isFlagMode ? 'fill-current' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default Controls;