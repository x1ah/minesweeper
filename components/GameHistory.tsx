import React, { useMemo } from 'react';
import { GameRecord, DifficultyLevel } from '../types';
import { Clock, Trophy, XCircle, Trash2 } from 'lucide-react';

interface GameHistoryProps {
  records: GameRecord[];
  clearHistory: () => void;
  embedded?: boolean; // If true, removes outer card styles for embedding in mobile drawer
  currentDifficulty: DifficultyLevel;
}

const GameHistory: React.FC<GameHistoryProps> = ({ records, clearHistory, embedded = false, currentDifficulty }) => {
  
  const bestRecord = useMemo(() => {
    return records
      .filter(r => r.result === '胜利' && r.difficulty === currentDifficulty)
      .sort((a, b) => a.time - b.time)[0];
  }, [records, currentDifficulty]);

  // Common content rendering
  const content = (
    <div className="flex flex-col h-full">
      {!embedded && (
        <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-800/80 shrink-0">
          <h2 className="text-md font-semibold text-slate-200 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            历史记录
          </h2>
          <button 
            onClick={clearHistory}
            className="text-slate-500 hover:text-rose-400 transition-colors p-1"
            title="清除记录"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Best Time Banner */}
      <div className={`px-4 py-3 border-b border-slate-700/50 flex items-center justify-between shrink-0 ${embedded ? 'bg-slate-900/50' : 'bg-slate-800/30'}`}>
         <div className="flex flex-col">
            <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-0.5 flex items-center gap-1">
               <Trophy className="w-3 h-3 text-yellow-500/80" />
               {currentDifficulty}最佳
            </span>
            <div className="flex items-baseline gap-2">
               <span className={`text-xl font-mono font-bold ${bestRecord ? 'text-yellow-400' : 'text-slate-600'}`}>
                  {bestRecord ? bestRecord.time : '--'}
                  <span className="text-xs text-slate-600 ml-0.5">s</span>
               </span>
               {bestRecord && (
                  <span className="text-[10px] text-slate-500/60 font-mono">
                     {bestRecord.date.split(' ')[0]}
                  </span>
               )}
            </div>
         </div>

         {/* Embedded Delete Button (moved here for mobile layout) */}
         {embedded && (
            <button 
              onClick={clearHistory}
              className="text-slate-500 hover:text-rose-400 transition-colors p-2 bg-slate-800 rounded-lg border border-slate-700 shadow-sm"
              title="清除记录"
            >
              <Trash2 className="w-4 h-4" />
            </button>
         )}
      </div>
      
      {records.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-600 p-8 text-sm">
           <Clock className="w-8 h-8 mb-2 opacity-20" />
           <p>暂无游戏记录</p>
        </div>
      ) : (
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          <table className="w-full text-xs sm:text-sm text-left text-slate-300">
            <thead className={`text-xs text-slate-400 uppercase bg-slate-900/50 sticky top-0 z-10 backdrop-blur-md ${embedded ? 'bg-slate-900' : ''}`}>
              <tr>
                <th className="px-3 py-2 pl-4">结果</th>
                <th className="px-3 py-2">时间</th>
                <th className="px-3 py-2">难度</th>
                <th className="px-3 py-2 hidden sm:table-cell">日期</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors">
                  <td className="px-3 py-3 pl-4">
                    <span className={`flex items-center gap-1.5 font-medium ${
                      record.result === '胜利' ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {record.result === '胜利' ? <Trophy className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      {record.result}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-mono text-slate-200">
                    {record.time}s
                  </td>
                  <td className="px-3 py-3">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] border ${
                      record.difficulty === '初级' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' :
                      record.difficulty === '中级' ? 'border-blue-500/30 text-blue-400 bg-blue-500/10' :
                      'border-rose-500/30 text-rose-400 bg-rose-500/10'
                    }`}>
                      {record.difficulty}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-slate-500 hidden sm:table-cell">
                    {record.date.split(' ')[0]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="h-8"></div>
        </div>
      )}
    </div>
  );

  if (embedded) {
    return <div className="w-full h-full bg-slate-900">{content}</div>;
  }

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 animate-fade-in mt-4 lg:mt-0">
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden backdrop-blur-sm flex flex-col h-full shadow-sm">
        {content}
      </div>
    </div>
  );
};

export default GameHistory;