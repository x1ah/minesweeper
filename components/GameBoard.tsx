import React from 'react';
import { CellData, DifficultyLevel, DIFFICULTIES, GameStatus } from '../types';
import Cell from './Cell';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface GameBoardProps {
  board: CellData[][];
  difficulty: DifficultyLevel;
  gameStatus: GameStatus;
  time: number;
  handleCellClick: (row: number, col: number) => void;
  handleCellRightClick: (row: number, col: number) => void;
  initGame: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  board,
  difficulty,
  gameStatus,
  time,
  handleCellClick,
  handleCellRightClick,
  initGame
}) => {
  return (
    <div className="flex-1 relative bg-slate-950 flex flex-col overflow-hidden w-full h-full">
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950/80 to-slate-950"></div>
         <div className={`absolute inset-0 opacity-20 transition-colors duration-1000 ${
            gameStatus === GameStatus.WON ? 'bg-emerald-900/30' :
            gameStatus === GameStatus.LOST ? 'bg-rose-900/30' :
            ''
         }`}></div>
      </div>

      {/* Board Scroll Container */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-4 lg:p-8 no-scrollbar relative z-10 w-full h-full">
        <div className="relative">
           
           {/* Board Glow */}
           <div className={`absolute -inset-4 rounded-3xl blur-xl opacity-20 transition-all duration-1000 ${
              gameStatus === GameStatus.WON ? 'bg-emerald-500' :
              gameStatus === GameStatus.LOST ? 'bg-rose-500' :
              'bg-blue-600'
           }`}></div>

           {/* The Grid */}
           <div className="relative bg-slate-900 p-3 rounded-xl border border-slate-700 shadow-2xl">
              <div 
                className="grid gap-1"
                style={{ 
                  gridTemplateColumns: `repeat(${DIFFICULTIES[difficulty].cols}, minmax(0, 1fr))`,
                }}
              >
                {board.map((row, rIndex) => (
                  row.map((cell, cIndex) => (
                    <Cell 
                      key={`${rIndex}-${cIndex}`} 
                      data={cell} 
                      onClick={handleCellClick}
                      onContextMenu={handleCellRightClick}
                      gameStatus={gameStatus}
                    />
                  ))
                ))}
              </div>
           </div>

           {/* Game Over / Win Overlay */}
           {(gameStatus === GameStatus.WON || gameStatus === GameStatus.LOST) && (
             <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
               <div className="bg-slate-900/95 backdrop-blur-md px-8 py-6 rounded-2xl border border-slate-600 shadow-2xl animate-pop pointer-events-auto flex flex-col items-center gap-3 text-center min-w-[200px]">
                 {gameStatus === GameStatus.WON ? (
                   <>
                     <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
                     <div>
                       <h2 className="text-2xl font-bold text-white">胜利!</h2>
                       <p className="text-slate-300 text-sm">耗时: {time}秒</p>
                     </div>
                   </>
                 ) : (
                   <>
                     <AlertCircle className="w-12 h-12 text-rose-500 animate-pulse" />
                     <h2 className="text-2xl font-bold text-white">游戏结束</h2>
                   </>
                 )}
                 <button 
                  onClick={initGame}
                  className="mt-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-blue-900/20 w-full"
                 >
                   再玩一次
                 </button>
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;