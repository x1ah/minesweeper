import React from 'react';
import { Timer as TimerIcon } from 'lucide-react';

interface TimerProps {
  time: number;
}

const Timer: React.FC<TimerProps> = ({ time }) => {
  return (
    <div className="flex items-center space-x-2 bg-slate-800/80 px-4 py-2 rounded-lg border border-slate-700 shadow-sm min-w-[100px] justify-between">
      <TimerIcon className="w-5 h-5 text-blue-400" />
      <span className="font-mono text-xl text-blue-100 tracking-wider">
        {Math.min(time, 999).toString().padStart(3, '0')}
      </span>
    </div>
  );
};

export default Timer;