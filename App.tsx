import React, { useState, useEffect, useCallback } from 'react';
import { CellData, CellState, DifficultyLevel, DIFFICULTIES, GameStatus, GameRecord } from './types';
import { createEmptyBoard, initializeBoard, revealCell, toggleFlag, checkWin, revealAllMines } from './utils/gameLogic';
import Controls from './components/Controls';
import Timer from './components/Timer';
import GameHistory from './components/GameHistory';
import GameBoard from './components/GameBoard';
import { ChevronUp, ChevronDown, Clock } from 'lucide-react';

const App: React.FC = () => {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(DifficultyLevel.BEGINNER);
  const [board, setBoard] = useState<CellData[][]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [mineCount, setMineCount] = useState(10);
  const [flagsUsed, setFlagsUsed] = useState(0);
  const [isFlagMode, setIsFlagMode] = useState(false);
  const [time, setTime] = useState(0);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false); // New state for mobile history drawer

  const [history, setHistory] = useState<GameRecord[]>(() => {
    try {
      const saved = localStorage.getItem('minesweeper_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Timer logic
  useEffect(() => {
    let interval: number | undefined;
    if (gameStatus === GameStatus.PLAYING) {
      interval = window.setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStatus]);

  // Save history helper
  const saveGameRecord = useCallback((result: '胜利' | '失败', finalTime: number) => {
    const newRecord: GameRecord = {
      id: Date.now().toString(),
      result,
      time: finalTime,
      difficulty: difficulty,
      date: new Date().toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };
    
    setHistory(prev => {
      const newHistory = [newRecord, ...prev].slice(0, 20); // Keep last 20 games
      localStorage.setItem('minesweeper_history', JSON.stringify(newHistory));
      return newHistory;
    });
  }, [difficulty]);

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('minesweeper_history');
  };

  // Initialize game on load or reset
  const initGame = useCallback(() => {
    const config = DIFFICULTIES[difficulty];
    setBoard(createEmptyBoard(config.rows, config.cols));
    setGameStatus(GameStatus.IDLE);
    setMineCount(config.mines);
    setFlagsUsed(0);
    setTime(0);
  }, [difficulty]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleCellClick = (row: number, col: number) => {
    if (gameStatus === GameStatus.WON || gameStatus === GameStatus.LOST) return;

    // Handle flag mode for mobile
    if (isFlagMode) {
      handleCellRightClick(row, col);
      return;
    }

    const cell = board[row][col];
    if (cell.state === CellState.FLAGGED || cell.state === CellState.REVEALED) return;

    let newBoard = [...board];

    // First click initialization
    if (gameStatus === GameStatus.IDLE) {
      const config = DIFFICULTIES[difficulty];
      newBoard = initializeBoard(config.rows, config.cols, config.mines, row, col);
      setGameStatus(GameStatus.PLAYING);
    }

    const result = revealCell(newBoard, row, col);
    setBoard(result.newBoard);

    if (result.exploded) {
      setGameStatus(GameStatus.LOST);
      setBoard(revealAllMines(result.newBoard));
      saveGameRecord('失败', time);
    } else {
      if (checkWin(result.newBoard)) {
        setGameStatus(GameStatus.WON);
        setFlagsUsed(mineCount); // Visual cleanup
        saveGameRecord('胜利', time);
      }
    }
  };

  const handleCellRightClick = (row: number, col: number) => {
    if (gameStatus === GameStatus.WON || gameStatus === GameStatus.LOST) return;

    const cell = board[row][col];
    if (cell.state === CellState.REVEALED) return;

    const newBoard = toggleFlag(board, row, col);
    setBoard(newBoard);
    
    // Update flag count
    const newFlagCount = newBoard.flat().filter(c => c.state === CellState.FLAGGED).length;
    setFlagsUsed(newFlagCount);
  };

  return (
    // Use h-[100dvh] for mobile browsers to account for address bar
    <div className="h-[100dvh] w-screen bg-slate-900 overflow-hidden selection:bg-blue-500/30 font-sans text-slate-200 flex flex-col lg:flex-row">
      
      {/* ----------------- DESKTOP LAYOUT (Side by Side) ----------------- */}
      <aside className="hidden lg:flex w-80 xl:w-96 flex-col bg-slate-900 border-r border-slate-700/50 shadow-2xl z-20 shrink-0 h-full">
        <div className="flex flex-col h-full p-6 gap-6 overflow-y-auto no-scrollbar">
             <Controls 
               difficulty={difficulty}
               setDifficulty={setDifficulty}
               gameStatus={gameStatus}
               resetGame={initGame}
               remainingMines={mineCount - flagsUsed}
               toggleFlagMode={() => setIsFlagMode(!isFlagMode)}
               isFlagMode={isFlagMode}
             />
             <div className="flex justify-center w-full">
               <Timer time={time} />
             </div>
             <GameHistory 
                records={history} 
                clearHistory={clearHistory} 
                currentDifficulty={difficulty}
             />
        </div>
      </aside>

      <main className="hidden lg:block flex-1 h-full">
         <GameBoard 
            board={board}
            difficulty={difficulty}
            gameStatus={gameStatus}
            time={time}
            handleCellClick={handleCellClick}
            handleCellRightClick={handleCellRightClick}
            initGame={initGame}
         />
      </main>


      {/* ----------------- MOBILE LAYOUT (Top-Middle-Bottom) ----------------- */}
      
      {/* 1. TOP: Controls & Timer */}
      <div className="lg:hidden shrink-0 bg-slate-900 border-b border-slate-800 z-30 shadow-md flex flex-col gap-2 p-2">
         <Controls 
           difficulty={difficulty}
           setDifficulty={setDifficulty}
           gameStatus={gameStatus}
           resetGame={initGame}
           remainingMines={mineCount - flagsUsed}
           toggleFlagMode={() => setIsFlagMode(!isFlagMode)}
           isFlagMode={isFlagMode}
         />
         <div className="flex justify-center">
            <Timer time={time} />
         </div>
      </div>

      {/* 2. MIDDLE: Game Board (Flex 1 to take all available space) */}
      <div className="lg:hidden flex-1 relative w-full overflow-hidden bg-slate-950">
         <GameBoard 
            board={board}
            difficulty={difficulty}
            gameStatus={gameStatus}
            time={time}
            handleCellClick={handleCellClick}
            handleCellRightClick={handleCellRightClick}
            initGame={initGame}
         />
         {/* Mobile Footer Hint (Only show when history is closed) */}
         {!isHistoryOpen && (
           <div className="absolute bottom-1 left-0 right-0 text-center text-slate-500 text-[10px] pointer-events-none opacity-40 z-20">
              长按标记 / 点击翻开
           </div>
         )}
      </div>

      {/* 3. BOTTOM: History (Collapsible Drawer) */}
      <div 
        className={`lg:hidden shrink-0 bg-slate-900 border-t border-slate-700 z-40 transition-all duration-300 ease-in-out shadow-[0_-4px_20px_rgba(0,0,0,0.5)] flex flex-col ${
          isHistoryOpen ? 'h-[45vh]' : 'h-10'
        }`}
      >
         {/* Drawer Toggle Header */}
         <button 
           onClick={() => setIsHistoryOpen(!isHistoryOpen)}
           className="h-10 shrink-0 w-full flex items-center justify-between px-4 bg-slate-800 hover:bg-slate-750 transition-colors"
         >
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
               <Clock className="w-3.5 h-3.5" />
               <span>历史记录 {history.length > 0 && `(${history.length})`}</span>
            </div>
            {isHistoryOpen ? <ChevronDown className="w-4 h-4 text-slate-500"/> : <ChevronUp className="w-4 h-4 text-slate-500"/>}
         </button>
         
         {/* Content */}
         <div className="flex-1 overflow-hidden bg-slate-900 w-full relative">
            <GameHistory 
                records={history} 
                clearHistory={clearHistory} 
                embedded={true} 
                currentDifficulty={difficulty}
            />
         </div>
      </div>

    </div>
  );
};

export default App;