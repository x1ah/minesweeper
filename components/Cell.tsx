import React, { memo } from 'react';
import { CellData, CellState } from '../types';
import { Flag, Bomb, X } from 'lucide-react';

interface CellProps {
  data: CellData;
  onClick: (row: number, col: number) => void;
  onContextMenu: (row: number, col: number) => void;
  gameStatus: number; // enum value
}

// Colors for neighbor counts 1-8
const NUMBER_COLORS = [
  '',
  'text-blue-400',
  'text-emerald-400',
  'text-rose-400',
  'text-violet-400',
  'text-amber-500',
  'text-cyan-400',
  'text-pink-500',
  'text-gray-400',
];

const Cell: React.FC<CellProps> = ({ data, onClick, onContextMenu }) => {
  const { row, col, state, isMine, neighborMines } = data;

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onContextMenu(row, col);
  };

  // Base style
  const baseClass = "w-8 h-8 sm:w-10 sm:h-10 border-b-4 border-r-2 flex items-center justify-center text-sm sm:text-lg font-bold select-none transition-all duration-75 cursor-pointer rounded-sm";
  
  // Hidden state
  if (state === CellState.HIDDEN) {
    return (
      <div 
        className={`${baseClass} bg-slate-700 border-slate-900/40 hover:bg-slate-600 active:bg-slate-600 active:border-none active:translate-y-[2px]`}
        onClick={() => onClick(row, col)}
        onContextMenu={handleContextMenu}
      />
    );
  }

  // Flagged state
  if (state === CellState.FLAGGED) {
    return (
      <div 
        className={`${baseClass} bg-slate-700 border-slate-900/40`}
        onContextMenu={handleContextMenu}
        onClick={(e) => { e.preventDefault(); /* Prevent click on flagged */ }}
      >
        <Flag className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-amber-400 animate-pop" />
      </div>
    );
  }

  // Revealed Mine
  if (state === CellState.REVEALED && isMine) {
    return (
      <div className={`${baseClass} bg-red-500/90 border-transparent border-0 rounded shadow-inner animate-shake`}>
        <Bomb className="w-5 h-5 sm:w-6 sm:h-6 text-slate-900 fill-slate-900" />
      </div>
    );
  }

  // Revealed Safe
  return (
    <div 
      className={`${baseClass} bg-slate-800/80 border-transparent border-0 rounded cursor-default`}
      onContextMenu={(e) => e.preventDefault()}
    >
      {neighborMines > 0 && (
        <span className={`${NUMBER_COLORS[neighborMines]} drop-shadow-lg`}>
          {neighborMines}
        </span>
      )}
    </div>
  );
};

export default memo(Cell); // Memoize to prevent re-rendering entire board on timer tick
